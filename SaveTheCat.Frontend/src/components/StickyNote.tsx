import React, { useEffect, useRef, useCallback } from "react";
import type { Note, EmotionalCharge } from "../types/note";
import SceneHeadingInput from "./SceneHeadingInput";
import TextAreaWithSuggestions from "./TextAreaWithSuggestions";

type Props = {
    note: Note;
    onChange: (id: string, newContent: Partial<Omit<Note, "id" | "x" | "y">>) => void;
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
    onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
    isDragging: boolean;
    isSelected: boolean;
};

const CHARGES: EmotionalCharge[] = ["+/-", "-/+", "+/+", "-/-"];

const autoGrow = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
};

export default function StickyNote({
    note,
    onChange,
    onRemove,
    onDragStart,
    onSelect,
    isDragging,
    isSelected
}: Props) {
    const noteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (noteRef.current) {
            const textareas = noteRef.current.querySelectorAll<HTMLTextAreaElement>(".note__textarea");
            textareas.forEach(autoGrow);
        }
    }, []);

    const handleTextAreaChange = (
        newValue: string,
        field: "description" | "emotionalDescription" | "conflict"
    ) => {
        onChange(note.id, { [field]: newValue });
    };

    const handleSceneHeadingChange = (newValue: string) => {
        onChange(note.id, { sceneHeading: newValue });
    };

    const handleInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        autoGrow(e.currentTarget);
    };

    const handleChargeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const currentIndex = CHARGES.indexOf(note.emotionalCharge);
        const nextIndex = (currentIndex + 1) % CHARGES.length;
        const newCharge = CHARGES[nextIndex];
        onChange(note.id, { emotionalCharge: newCharge });
    };

    const handleNoteClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect(note.id);
    }, [onSelect, note.id]);

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onRemove(note.id);
    };

    const isRed = note.emotionalCharge === "-/-" || note.emotionalCharge === "-/+";
    const buttonClass = `note__charge-btn ${isRed ? "note__charge-btn--red" : ""}`;

    return (
        <div
            ref={noteRef}
            className={`note ${isDragging ? "note--dragging" : ""} ${isSelected ? "note--selected" : ""}`}
            style={{ left: note.x, top: note.y, backgroundColor: note.color }}
            onClick={handleNoteClick}
            role="group"
            aria-label="Nota adhesiva"
        >
            <button
                type="button"
                onClick={handleDeleteClick}
                className="note__close-pin"
                aria-label="Eliminar nota"
                title="Eliminar"
            >
                ✕
            </button>

            <div className="note__drag-area" onMouseDown={onDragStart} />

            <SceneHeadingInput
                value={note.sceneHeading}
                onChange={handleSceneHeadingChange}
                onInput={handleInput}
                placeholder="ESCENA"
                ariaLabel="Encabezado de escena"
            />

            <TextAreaWithSuggestions
                className="note__textarea note__description"
                rows={2}
                value={note.description}
                onChange={(newValue) => handleTextAreaChange(newValue, "description")}
                onInput={handleInput}
                placeholder="Descripción de la escena"
                ariaLabel="Descripción de la escena"
            />

            <div className="note__field-group">
                <button
                    type="button"
                    className={buttonClass}
                    onClick={handleChargeClick}
                    aria-label="Cambiar carga emocional"
                    title="Cambiar carga emocional"
                >
                    {note.emotionalCharge}
                </button>
                <TextAreaWithSuggestions
                    className="note__textarea"
                    rows={1}
                    value={note.emotionalDescription}
                    onChange={(newValue) => handleTextAreaChange(newValue, "emotionalDescription")}
                    onInput={handleInput}
                    placeholder="Descripción emocional"
                    ariaLabel="Descripción de la carga emocional"
                />
            </div>

            <div className="note__field-group">
                <span className="note__conflict-label" aria-hidden="true">&gt;&lt;</span>
                <TextAreaWithSuggestions
                    className="note__textarea"
                    rows={1}
                    value={note.conflict}
                    onChange={(newValue) => handleTextAreaChange(newValue, "conflict")}
                    onInput={handleInput}
                    placeholder="Conflicto"
                    ariaLabel="Conflicto de la escena"
                />
            </div>
        </div>
    );
}
