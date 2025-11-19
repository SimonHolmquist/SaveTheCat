import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEntitiesContext } from "../context/EntityContext";

// --- Constantes de Formato ---
const PREFIXES = ["INT.", "EXT."];
const TIMES_OF_DAY = [
    "DÍA", "NOCHE", "AMANECER", "ATARDECER", "MÁS TARDE", "CONTINUO", "AL MISMO TIEMPO"
];

const autoGrow = (element: HTMLTextAreaElement | null) => {
    if (element) {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    }
};

type Props = {
    value: string;
    onChange: (newValue: string) => void;
    onInput: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    ariaLabel: string;
};

export default function SceneHeadingInput({ value, onChange, onInput, placeholder, ariaLabel }: Props) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Estado para saber qué parte estamos editando: 'prefix' | 'location' | 'time'
    const [currentPart, setCurrentPart] = useState<'prefix' | 'location' | 'time' | null>(null);

    const { locations } = useEntitiesContext();
    const locationNames = useMemo(() => locations.map(l => l.name.toUpperCase()), [locations]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

    useEffect(() => {
        autoGrow(textareaRef.current);
    }, [value]);

    // --- Lógica de Análisis de Contexto ---
    const analyzeCursorPosition = (text: string, cursorIndex: number) => {
        // 1. Detectar PREFIJO (Inicio hasta primer espacio)
        const firstSpaceIndex = text.indexOf(' ');
        if (firstSpaceIndex === -1 || cursorIndex <= firstSpaceIndex) {
            return { part: 'prefix' as const, query: text.substring(0, cursorIndex).trim() };
        }

        // 2. Detectar TIEMPO (Después del último guion '-')
        const lastDashIndex = text.lastIndexOf('-');
        if (lastDashIndex !== -1 && cursorIndex > lastDashIndex) {
            // Verificamos si estamos realmente escribiendo el tiempo (después del guion)
            return { part: 'time' as const, query: text.substring(lastDashIndex + 1, cursorIndex).trimStart() };
        }

        // 3. Si no es prefijo ni tiempo, es LOCACIÓN (Entre prefijo y tiempo/final)
        // El query de locación es más complejo porque puede tener espacios.
        // Tomamos desde el primer espacio hasta el cursor o hasta el guion.
        const startLocation = firstSpaceIndex + 1;
        const endLocation = (lastDashIndex !== -1 && cursorIndex > lastDashIndex) ? lastDashIndex : cursorIndex;
        const query = text.substring(startLocation, endLocation).trimStart(); 
        
        // Truco: si estamos justo después del espacio del prefijo, mostrar todas las locaciones
        return { part: 'location' as const, query };
    };

    const updateSuggestions = (element: HTMLTextAreaElement) => {
        const text = element.value.toUpperCase(); // Normalizamos para búsqueda
        const cursorIndex = element.selectionStart;

        const { part, query } = analyzeCursorPosition(text, cursorIndex);
        setCurrentPart(part);

        let source: string[] = [];
        if (part === 'prefix') source = PREFIXES;
        else if (part === 'time') source = TIMES_OF_DAY;
        else if (part === 'location') source = locationNames;

        // Filtrar
        let filtered: string[] = [];
        if (!query) {
            filtered = source; // Mostrar todos si no hay texto
        } else {
            filtered = source.filter(item => item.startsWith(query));
        }

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        
        // IMPORTANTE: Solo reseteamos el índice si la lista cambió drásticamente o cerramos.
        // Pero para mantenerlo simple y funcional, lo reseteamos al filtrar.
        // El problema de navegación se soluciona en handleKeyUp.
        setActiveSuggestionIndex(0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value.toUpperCase();
        setInputValue(newText);
        onChange(newText);
        updateSuggestions(e.target);
    };

    // Maneja clicks y focus
    const handleCursorMove = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        updateSuggestions(e.currentTarget);
    };

    // Maneja navegación (no debe resetear el índice)
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

    // FIX DEL BUG: onKeyUp dispara updateSuggestions, lo que reseteaba el índice.
    // Filtramos las teclas de navegación para evitar el reseteo.
    const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter" || e.key === "Escape") {
            return;
        }
        updateSuggestions(e.currentTarget);
    };

    const selectSuggestion = (suggestion: string) => {
        if (!textareaRef.current || !currentPart) return;
        
        const text = inputValue;
        let newText = "";
        let newCursorPos = 0;

        if (currentPart === 'prefix') {
            // Reemplazar/Insertar prefijo
            const firstSpace = text.indexOf(' ');
            const rest = firstSpace === -1 ? "" : text.substring(firstSpace);
            newText = `${suggestion} ${rest.trimStart()}`;
            newCursorPos = suggestion.length + 1; // Cursor después del espacio
        } 
        else if (currentPart === 'location') {
            // Reemplazar/Insertar locación
            const firstSpace = text.indexOf(' ');
            const prefix = text.substring(0, firstSpace + 1);
            
            const dashIndex = text.indexOf('-');
            const suffix = dashIndex === -1 ? "" : text.substring(dashIndex); // " - DÍA"

            // Construimos: PREFIJO + SUGERENCIA + SUFIJO
            newText = `${prefix}${suggestion} ${suffix.trimStart()}`;
            
            // Si no había guion, lo sugerimos para el siguiente paso
            if (dashIndex === -1) {
                 newText = newText.trimEnd() + " - ";
            }
            newCursorPos = newText.length;
        } 
        else if (currentPart === 'time') {
            // Reemplazar/Insertar tiempo
            const lastDash = text.lastIndexOf('-');
            const base = text.substring(0, lastDash + 1); // "INT. CASA -"
            newText = `${base} ${suggestion}`;
            newCursorPos = newText.length;
        }

        setInputValue(newText);
        onChange(newText);
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);

        // Devolver el foco y mover cursor
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 150);
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
                onKeyUp={handleKeyUp} // Usamos handleKeyUp filtrado
                onBlur={handleBlur}
                onInput={onInput}
                onClick={handleCursorMove} // Click reposiciona el contexto
                onFocus={handleCursorMove} // Focus muestra sugerencias
                placeholder={placeholder}
                aria-label={ariaLabel}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="input-suggestions__list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            className={`input-suggestions__item ${index === activeSuggestionIndex ? "input-suggestions__item--active" : ""}`}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Evita perder el foco antes del click
                                selectSuggestion(suggestion);
                            }}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}