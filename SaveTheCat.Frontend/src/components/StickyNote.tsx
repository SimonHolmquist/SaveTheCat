import React from "react";
import type { Note } from "../types/note";

type Props = {
    note: Note;
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;     // Esto abrirá el modal
    onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
    isDragging: boolean;
    isSelected: boolean;
};

export default function StickyNote({
    note,
    onRemove,
    onDragStart,
    onSelect,
    isDragging,
    isSelected
}: Props) {

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onRemove(note.id);
    };

    // Manejamos el click para abrir el modal (onSelect en App.tsx)
    const handleNoteClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // Solo seleccionamos si no estamos arrastrando (lógica simple)
        if (!isDragging) {
            onSelect(note.id);
        }
    };

    return (
        <div
            className={`note ${isDragging ? "note--dragging" : ""} ${isSelected ? "note--selected" : ""}`}
            style={{ left: note.x, top: note.y, backgroundColor: note.color }}
            onMouseDown={onDragStart} // Inicia el arrastre
            onClick={handleNoteClick} // Abre el modal al soltar el click
            role="button"
            aria-label={`Nota: ${note.sceneHeading || "Sin título"}`}
        >
            <button
                type="button"
                onClick={handleDeleteClick}
                className="note__close-pin"
                title="Eliminar nota"
            >
                ✕
            </button>

            <div className="note__preview-content">
                <span className="note__preview-title">
                    {note.sceneHeading || "NUEVA ESCENA"}
                </span>
                {/* Indicadores visuales pequeños si tiene contenido */}
                <div className="note__indicators">
                    {note.description && <span title="Tiene descripción">📝</span>}
                    {note.conflict && <span title="Tiene conflicto">⚔️</span>}
                </div>
            </div>
        </div>
    );
}