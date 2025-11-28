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
    onAddLocation: (name: string) => void;
    onOpenLocationsModal: () => void;
};

const ADD_LOCATION_LABEL = "AGREGAR LOCACION";

export default function SceneHeadingInput({
    value,
    onChange,
    onInput,
    placeholder,
    ariaLabel,
    onAddLocation,
    onOpenLocationsModal
}: Props) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Estado para saber qué parte estamos editando: 'prefix' | 'location' | 'time'
    const [currentPart, setCurrentPart] = useState<'prefix' | 'location' | 'time' | null>(null);
    const [currentQuery, setCurrentQuery] = useState("");

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

    const parseHeading = (text: string) => {
        const trimmed = text.trimStart();
        const prefix = PREFIXES.find((p) => trimmed.startsWith(p)) ?? "";

        const afterPrefix = prefix ? trimmed.substring(prefix.length).trimStart() : trimmed;
        const dashIndex = afterPrefix.indexOf("-");

        if (dashIndex === -1) {
            return { prefix, location: afterPrefix.trim(), time: "" };
        }

        const location = afterPrefix.substring(0, dashIndex).trim();
        const time = afterPrefix.substring(dashIndex + 1).trim();
        return { prefix, location, time };
    };

    const formatHeading = (prefix: string, location: string, time: string) => {
        const prefixPart = prefix ? `${prefix} ` : "";
        const locationPart = location ? `${location} ` : "";
        const dashPart = prefix || location || time ? "- " : "";
        const timePart = time ? `${time}` : "";

        return `${prefixPart}${locationPart}${dashPart}${timePart}`;
    };

    const updateSuggestions = (element: HTMLTextAreaElement) => {
        const text = element.value.toUpperCase(); // Normalizamos para búsqueda
        const cursorIndex = element.selectionStart;

        const { part, query } = analyzeCursorPosition(text, cursorIndex);
        setCurrentPart(part);
        setCurrentQuery(query);

        if (part === 'location' && locationNames.length === 0) {
            setSuggestions([ADD_LOCATION_LABEL]);
            setShowSuggestions(true);
            setActiveSuggestionIndex(0);
            return;
        }

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

        if ((part === 'prefix' || part === 'time') && filtered.length === 0) {
            filtered = source;
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
        if (e.key === "Enter" || e.key === "Tab") {
            if ((!showSuggestions || suggestions.length === 0) && currentPart === 'location') {
                const normalized = currentQuery.trim();
                if (normalized) {
                    e.preventDefault();
                    handleLocationSelection(normalized.toUpperCase());
                }
                return;
            }
        }

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

    const applyNewValue = (newText: string, newCursorPos: number) => {
        setInputValue(newText);
        onChange(newText);
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
                updateSuggestions(textareaRef.current);
            }
        }, 0);
    };

    const handleLocationSelection = (locationText: string) => {
        if (!textareaRef.current) return;

        const { prefix } = parseHeading(inputValue);
        const normalized = locationText.toUpperCase();

        if (!locationNames.includes(normalized)) {
            onAddLocation(normalized);
        }

        const newText = formatHeading(prefix, normalized, "");
        applyNewValue(newText, newText.length);
    };

    const selectSuggestion = (suggestion: string) => {
        if (!textareaRef.current || !currentPart) return;

        const { prefix, location } = parseHeading(inputValue);

        if (currentPart === 'prefix') {
            const newText = `${suggestion}  - `;
            applyNewValue(newText, suggestion.length + 1);
        }
        else if (currentPart === 'location') {
            if (suggestion === ADD_LOCATION_LABEL) {
                setShowSuggestions(false);
                setActiveSuggestionIndex(0);
                onOpenLocationsModal();
                return;
            }

            const newText = formatHeading(prefix, suggestion, "");

            if (!locationNames.includes(suggestion)) {
                onAddLocation(suggestion);
            }

            applyNewValue(newText, newText.length);
        }
        else if (currentPart === 'time') {
            const newText = formatHeading(prefix, location, suggestion);
            applyNewValue(newText, newText.length);
        }
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