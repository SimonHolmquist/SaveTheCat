import React, { useState, useEffect, useRef, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

// Eliminado de aquí: const { t } = useTranslation()

const SAVE_THE_CAT_GENRES = [
    { key: "monsters" },
    { key: "fleece" },
    { key: "lamp" },
    { key: "problem" },
    { key: "rites" },
    { key: "love" },
    { key: "why" },
    { key: "triumph" },
    { key: "intern" },
    { key: "super" }
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
    ariaLabel: string;
    style?: CSSProperties;
};

export default function GenreInput({ value, onChange, onInput, ariaLabel, style }: Props) {
    // 1. MOVIDO AQUÍ: El hook se llama dentro del componente
    const { t } = useTranslation(); 
    
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 2. MOVIDO O ADAPTADO: isValidGenre ahora tiene acceso a 't'
    const isValidGenre = (text: string) => {
        const upperText = text.toUpperCase().trim();
        // Usamos el 't' del hook
        return SAVE_THE_CAT_GENRES.some(g => t(`genres.${g.key}`).toUpperCase() === upperText);
    };

    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

    useEffect(() => {
        autoGrow(textareaRef.current);
    }, [value]);

    const updateSuggestions = (text: string) => {
        const textUpper = text.toUpperCase();
        if (text.trim() === "") {
            setSuggestions(SAVE_THE_CAT_GENRES.map(g => g.key));
            setShowSuggestions(true);
        } else {
            const filtered = SAVE_THE_CAT_GENRES.filter(g =>
                t(`genres.${g.key}`).toUpperCase().startsWith(textUpper)
            );
            setSuggestions(filtered.map(g => g.key));
            setShowSuggestions(filtered.length > 0);
        }
        setActiveSuggestionIndex(0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setInputValue(newText);
        updateSuggestions(newText);
    };

    const handleFocus = () => {
        updateSuggestions(inputValue);
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
            if (suggestions[activeSuggestionIndex]) {
                selectSuggestion(suggestions[activeSuggestionIndex]);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        // Al seleccionar la clave (ej: "monsters"), guardamos eso directamente o 
        // podrías querer guardar el valor traducido. Tu lógica original guardaba la clave "suggestion"
        // que viene del .map(g => g.key) en updateSuggestions.
        setInputValue(suggestion);
        onChange(suggestion);
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);
        textareaRef.current?.focus();
    };

    const handleBlur = () => {
        setTimeout(() => {
            const trimmedValue = inputValue.trim();
            if (isValidGenre(trimmedValue)) {
                // Buscamos la key original basándonos en el texto traducido si el usuario lo escribió a mano
                const validGenreKey = SAVE_THE_CAT_GENRES.find(g => 
                    t(`genres.${g.key}`).toUpperCase() === trimmedValue.toUpperCase()
                )?.key || trimmedValue;
                
                setInputValue(validGenreKey);
                onChange(validGenreKey);
            } else {
                setInputValue(value);
            }
            setShowSuggestions(false);
        }, 150);
    };

    return (
        <div className="input-suggestions__container">
            <textarea
                ref={textareaRef}
                className="beat-sheet__input"
                style={style}
                rows={1}
                value={inputValue} // Aquí podrías querer mostrar el valor traducido usando t(`genres.${inputValue}`) si inputValue es una key
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onInput={onInput}
                aria-label={ariaLabel}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="input-suggestions__list">
                    {suggestions.map((suggestionKey, index) => (
                        <li
                            key={suggestionKey}
                            className={`input-suggestions__item ${index === activeSuggestionIndex ? "input-suggestions__item--active" : ""
                                }`}
                            onMouseDown={() => selectSuggestion(suggestionKey)}
                        >
                            {/* Mostramos el texto traducido en la lista */}
                            {t(`genres.${suggestionKey}`)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}