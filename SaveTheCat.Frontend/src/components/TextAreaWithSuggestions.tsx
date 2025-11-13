import React, { useState, useEffect, useRef, useMemo } from "react";
import { useEntitiesContext } from "../context/EntityContext";

// Helper para auto-grow
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
    ariaLabel: string;
    className: string;
    rows: number;
    placeholder?: string;
    disabled?: boolean; // <-- 1. AÑADIR ESTA LÍNEA
};

// Estado para gestionar la posición del popup
type SuggestionPosition = {
    top: number;
    left: number;
    query: string;
    triggerIndex: number;
};

export default function TextAreaWithSuggestions({
    value,
    onChange,
    onInput,
    ariaLabel,
    className,
    rows,
    placeholder,
    disabled, // <-- 2. AÑADIR ESTA LÍNEA
}: Props) {
    const { characters } = useEntitiesContext();
    const characterNames = useMemo(() => characters.map(c => c.name), [characters]);

    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [suggestionPosition, setSuggestionPosition] = useState<SuggestionPosition | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sincroniza el estado interno si el prop 'value' cambia desde fuera
    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value, inputValue]);

    // Llama a autoGrow cuando el valor cambia
    useEffect(() => {
        autoGrow(textareaRef.current);
    }, [value]);

    // Función para calcular la posición del cursor (muy simplificada)
    const getSuggestionPosition = (target: HTMLTextAreaElement) => {
        const { selectionStart, value } = target;

        const triggerIndex = value.lastIndexOf('@', selectionStart - 1);
        if (triggerIndex === -1) return null;

        const textSinceTrigger = value.substring(triggerIndex + 1, selectionStart);
        
        if (textSinceTrigger.includes(' ')) return null; 

        return {
            top: 30, 
            left: 0,
            query: textSinceTrigger,
            triggerIndex: triggerIndex,
        };
    };

    const updateSuggestions = (target: HTMLTextAreaElement) => {
        const pos = getSuggestionPosition(target);
        
        if (pos) {
            const queryUpper = pos.query.toUpperCase();
            const filtered = characterNames.filter(name =>
                name.toUpperCase().startsWith(queryUpper)
            );
            setSuggestions(filtered);
            setSuggestionPosition(pos); 
            setActiveSuggestionIndex(0);
        } else {
            setSuggestions([]);
            setSuggestionPosition(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setInputValue(newText);
        onChange(newText); 
        updateSuggestions(e.target);
        
        onInput(e);
    };
    
    const handleCursorActivity = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        updateSuggestions(e.currentTarget);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!suggestionPosition || suggestions.length === 0) return;

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
            setSuggestionPosition(null);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        if (!suggestionPosition || !textareaRef.current) return;

        const { value } = textareaRef.current;
        const { triggerIndex } = suggestionPosition;

        const textBefore = value.substring(0, triggerIndex + 1); // Incluye el @
        const textAfter = value.substring(triggerIndex + 1 + suggestionPosition.query.length);

        const newValue = textBefore + suggestion + " " + textAfter.trimStart();

        setInputValue(newValue);
        onChange(newValue); 
        setSuggestionPosition(null);
        setSuggestions([]);

        setTimeout(() => {
             if (textareaRef.current) {
                const newCursorPos = textBefore.length + suggestion.length + 1;
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
             }
        }, 0);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setSuggestionPosition(null);
        }, 150);
    };
    
    const showSuggestions = suggestionPosition && suggestions.length > 0;

    return (
        <div className="input-suggestions__container">
            <textarea
                ref={textareaRef}
                className={className}
                rows={rows}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onInput={onInput} 
                onClick={handleCursorActivity}
                onKeyUp={handleCursorActivity}
                placeholder={placeholder}
                aria-label={ariaLabel}
                autoComplete="off"
                disabled={disabled} // <-- 3. AÑADIR ESTA LÍNEA
            />
            {showSuggestions && (
                <ul className="input-suggestions__list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            className={`input-suggestions__item ${
                                index === activeSuggestionIndex ? "input-suggestions__item--active" : ""
                            }`}
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