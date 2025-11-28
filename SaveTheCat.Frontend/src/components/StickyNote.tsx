import React from "react";
import type { Note } from "../types/note";
import { useTranslation } from "react-i18next";

type Props = {
    note: Note;
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;     // Esto abrirá el modal
    onEdit: (id: string) => void;
    onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
    isDragging: boolean;
    isSelected: boolean;
};

export default function StickyNote({
    note,
    onRemove,
    onDragStart,
    onSelect,
    onEdit,
    isDragging,
    isSelected
}: Props) {

    const { t } = useTranslation()

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onRemove(note.id);
    };

    // Solo selecciona, no edita
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isDragging) {
            onSelect(note.id);
        }
    };

    // Doble click abre el modal
    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onEdit(note.id);
    };

    return (
        <div
            className={`note ${isDragging ? "note--dragging" : ""} ${isSelected ? "note--selected" : ""}`}
            style={{ left: note.x, top: note.y, backgroundColor: note.color }}
            onMouseDown={onDragStart} // Inicia el arrastre
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            role="button"
            aria-label={`Nota: ${note.sceneHeading || t('note.untitled')}`}
        >
            <button
                type="button"
                onClick={handleDeleteClick}
                className="note__close-pin"
                title={t('note.deleteTooltip')}
            >
                ✕
            </button>

            <div className="note__preview-content">
                <span className="note__preview-title">
                    {note.sceneHeading || t("board.newScene")}
                </span>
                <div className="note__indicators">
                    {note.description && <span title={t('note.hasDescription')}>📝</span>}
                    {note.conflict && <span title={t('note.hasConflict')}>⚔️</span>}
                </div>
            </div>
        </div>
    );
}