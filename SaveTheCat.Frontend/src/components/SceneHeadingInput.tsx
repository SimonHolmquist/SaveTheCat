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
    const updateSuggestions = (element: HTMLTextAreaElement) => {
        const text = element.value;
        const cursorIndex = element.selectionStart;
        const separatorIndex = text.indexOf('/');

        if (separatorIndex === -1 || cursorIndex <= separatorIndex) {
             const part1 = text.substring(0, separatorIndex > -1 ? separatorIndex : text.length).trim();
             
             // AQUÍ SE USA LA CONSTANTE QUE DABA ERROR
             const filtered = INTERIOR_EXTERIOR.filter(s => s.startsWith(part1.toUpperCase()));
             
             setSuggestions(filtered);
             setShowSuggestions(filtered.length > 0);
             return;
        }

        // 2. Está después del separador "/"
        const afterSlashFull = text.substring(separatorIndex + 1); // Todo despues del /
        const cursorInSecondPart = cursorIndex - (separatorIndex + 1); // Cursor relativo a la 2da parte
        
        // Analizamos la segunda parte para ver si estamos en LOCACION o HORA
        // Buscamos si hay un espacio que separe Locacion de Hora
        // Pero ojo, la locación puede tener espacios (CASA DE JUAN).
        // Una heurística simple: Sugerir Locaciones hasta que se seleccione una o se detecte un TIME_OF_DAY al final.
        
        // Para simplificar el "Instantaneo":
        // Si estamos escribiendo justo después del /, sugerimos Locaciones.
        // Si ya hay texto y espacio, sugerimos Hora.
        
        const textUpToCursor = afterSlashFull.substring(0, cursorInSecondPart).trimStart();
        // Verificamos si lo que hay antes del cursor parece una locación completa (esto es difícil sin saber si terminó).
        // Mejor enfoque: Mostrar locaciones. Si el usuario escribe algo que coincida con el inicio de una HORA, mostrar hora.
        
        // Simplificación robusta:
        // Tomamos la última palabra que se está escribiendo
        const words = textUpToCursor.split(' ');
        const lastWord = words[words.length - 1].toUpperCase();
        
        // Si la última palabra machea con el inicio de un TIEMPO, sugerimos tiempos.
        const matchingTimes = TIMES_OF_DAY.filter(t => t.startsWith(lastWord) && lastWord.length > 0);
        
        if (matchingTimes.length > 0) {
             setSuggestions(matchingTimes);
             setShowSuggestions(true);
        } else {
             // Si no parece un tiempo, sugerimos Locaciones que coincidan con todo el bloque tras el /
             const locationSearch = textUpToCursor.toUpperCase(); // Buscar por todo el string
             const filteredLocations = locationNames.filter(l => l.startsWith(locationSearch));
             
             // Si no hay texto aún, mostrar todas las locaciones
             if (textUpToCursor.length === 0) {
                  setSuggestions(locationNames);
                  setShowSuggestions(locationNames.length > 0);
             } else {
                  setSuggestions(filteredLocations);
                  setShowSuggestions(filteredLocations.length > 0);
             }
        }
        setActiveSuggestionIndex(0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setInputValue(newText);
        onChange(newText);
        updateSuggestions(e.target); // Pasa el target
    };

    const handleCursorActivity = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        updateSuggestions(e.currentTarget);
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
                onClick={handleCursorActivity} 
                onKeyUp={handleCursorActivity}
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