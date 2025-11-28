import React, { useState, useEffect, useRef, type CSSProperties } from "react";

// Los 10 géneros de "¡Salva al gato!"
const SAVE_THE_CAT_GENRES = [
    "Un monstruo en casa",
    "El vellocino de oro",
    "La lámpara maravillosa",
    "Un tipo con un problema",
    "Ritos de iniciación",
    "Amor de colegas",
    "¿Por qué lo hizo?",
    "El triunfo del tonto",
    "Soy un interno",
    "Superhéroes"
];

// Helper para validar
const isValidGenre = (text: string) => {
    const upperText = text.toUpperCase().trim();
    return SAVE_THE_CAT_GENRES.some(g => g.toUpperCase() === upperText);
};

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
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Sincroniza el estado local si el prop (valor guardado) cambia
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value]); // No incluir 'inputValue' aquí
    
    useEffect(() => {
        autoGrow(textareaRef.current);
    }, [value]);

    const updateSuggestions = (text: string) => {
        const textUpper = text.toUpperCase();
        if (text.trim() === "") {
            // Si está vacío, muestra todos
            setSuggestions(SAVE_THE_CAT_GENRES);
            setShowSuggestions(true);
        } else {
            // Filtra mientras escribe
            const filtered = SAVE_THE_CAT_GENRES.filter(s => 
                s.toUpperCase().startsWith(textUpper)
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        }
        setActiveSuggestionIndex(0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        // BUG 4 FIX: Solo actualiza el estado local, no llama a onChange
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
        // BUG 4 FIX: Al seleccionar, SÍ llamamos a onChange para guardar
        setInputValue(suggestion);
        onChange(suggestion); // <--- Guarda el valor
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);
        textareaRef.current?.focus();
    };

    const handleBlur = () => {
        setTimeout(() => {
            // BUG 4 FIX: Al salir, valida el texto.
            const trimmedValue = inputValue.trim();
            if (isValidGenre(trimmedValue)) {
                // Si es válido, lo guarda (y formatea)
                const validGenre = SAVE_THE_CAT_GENRES.find(g => g.toUpperCase() === trimmedValue.toUpperCase()) || trimmedValue;
                setInputValue(validGenre);
                onChange(validGenre); 
            } else {
                // Si no es válido, revierte al valor original guardado
                setInputValue(value); 
            }
            setShowSuggestions(false);
        }, 150); // Retraso para permitir clic en sugerencias
    };

    return (
        <div className="input-suggestions__container">
            <textarea
                ref={textareaRef}
                className="beat-sheet__input"
                style={style}
                rows={1}
                value={inputValue}
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