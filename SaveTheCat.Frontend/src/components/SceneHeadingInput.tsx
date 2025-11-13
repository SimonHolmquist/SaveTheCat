import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEntitiesContext } from "../context/EntityContext";

// --- Constantes para las sugerencias ---
const INTERIOR_EXTERIOR = ["INT.", "EXT."];
const TIMES_OF_DAY = [
    "DIA", "TARDE", "NOCHE", "MAS TARDE", "AMANECER",
    "ATARDECER", "ANOCHECER", "CONTINUO", "AL MISMO TIEMPO"
];

const autoGrow = (element: HTMLTextAreaElement | null) => {
    if (element) {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    }
};

// --- Props que recibirá el componente ---
type Props = {
    value: string;
    onChange: (newValue: string) => void;
    onInput: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void; // Para auto-grow
    placeholder: string;
    ariaLabel: string;
};

export default function SceneHeadingInput({ value, onChange, onInput, placeholder, ariaLabel }: Props) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Obtenemos las locaciones desde el contexto
    const { locations } = useEntitiesContext();
    const locationNames = useMemo(() => locations.map(l => l.name.toUpperCase()), [locations]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sincroniza el estado interno si el prop 'value' cambia desde fuera
    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

    useEffect(() => {
        autoGrow(textareaRef.current);
    }, [value]);

    // La lógica principal para actualizar sugerencias
    const updateSuggestions = (text: string) => {
        const separatorIndex = text.indexOf('/');
        const part1 = text.substring(0, separatorIndex > -1 ? separatorIndex : text.length).trim();

        if (separatorIndex === -1) {
            // Caso 1: Escribiendo INT./EXT.
            const filtered = INTERIOR_EXTERIOR.filter(s => s.startsWith(part1.toUpperCase()));
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            // Caso 2: Escribiendo después del "/"
            const afterSlash = text.substring(separatorIndex + 1).trimStart();
            const firstSpaceIndex = afterSlash.indexOf(' ');

            if (firstSpaceIndex === -1) {
                // Escribiendo la HORA
                const timePart = afterSlash.trim().toUpperCase();
                const filteredTimes = TIMES_OF_DAY.filter(t => t.startsWith(timePart));
                setSuggestions(filteredTimes);
                setShowSuggestions(filteredTimes.length > 0);
            } else {
                // Escribiendo la LOCACION
                const locationPart = afterSlash.substring(firstSpaceIndex + 1).trimStart().toUpperCase();
                const filteredLocations = locationNames.filter(l => l.startsWith(locationPart));
                setSuggestions(filteredLocations);
                setShowSuggestions(filteredLocations.length > 0);
            }
        }
        setActiveSuggestionIndex(0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setInputValue(newText);
        onChange(newText); // Actualiza el estado en el hook padre
        updateSuggestions(newText);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            selectSuggestion(suggestions[activeSuggestionIndex]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        const separatorIndex = inputValue.indexOf('/');
        let newValue = "";

        if (separatorIndex === -1) {
            // Completando INT./EXT.
            newValue = `${suggestion} / `;
        } else {
            const part1 = inputValue.substring(0, separatorIndex + 1); // "INT. /"
            const afterSlash = inputValue.substring(separatorIndex + 1).trimStart();
            const firstSpaceIndex = afterSlash.indexOf(' ');

            if (firstSpaceIndex === -1) {
                // Completando HORA
                newValue = `${part1} ${suggestion} `;
            } else {
                // Completando LOCACION
                const timePart = afterSlash.substring(0, firstSpaceIndex);
                newValue = `${part1} ${timePart} ${suggestion}`;
            }
        }

        setInputValue(newValue);
        onChange(newValue); // Actualiza el estado final
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);

        // Devolver el foco al textarea
        textareaRef.current?.focus();
    };

    const handleBlur = () => {
        // Retrasamos el cierre para permitir el click en la sugerencia
        setTimeout(() => {
            setShowSuggestions(false);
        }, 150);
    };

    return (
        <div className="input-suggestions__container">
            <textarea
                ref={textareaRef}
                className="note__textarea note__scene-heading"
                rows={1}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onInput={onInput} // Pasa el evento onInput para el auto-grow
                placeholder={placeholder}
                aria-label={ariaLabel}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="input-suggestions__list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            className={`input-suggestions__item ${index === activeSuggestionIndex ? "input-suggestions__item--active" : ""
                                }`}
                            // Usamos onMouseDown en lugar de onClick para que se dispare antes que el onBlur
                            onMouseDown={() => selectSuggestion(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}