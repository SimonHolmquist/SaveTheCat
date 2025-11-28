import React, { forwardRef } from "react";
import StickyNote from "./StickyNote";
import type { Note } from "../types/note";
import { useTranslation } from "react-i18next";

type Props = {
    notes: readonly Note[];
    maxNotes: number;
    draggingNoteId: string | null;
    selectedNoteId: string | null;
    onBackgroundClick: React.MouseEventHandler<HTMLDivElement>;
    onDragStart: (e: React.MouseEvent<HTMLDivElement>, note: Note) => void;
    onDragMove: React.MouseEventHandler<HTMLDivElement>;
    onDragEnd: React.MouseEventHandler<HTMLDivElement>;
    onSelectNote: (id: string) => void;
    onUpdateNote: (id: string, newContent: Partial<Omit<Note, "id" | "x" | "y">>) => void;
    onRemoveNote: (id: string) => void;
    onEditNote: (id: string) => void;
};

const StickyBoard = forwardRef<HTMLDivElement, Props>(({
    notes,
    maxNotes,
    draggingNoteId,
    selectedNoteId,
    onBackgroundClick,
    onDragStart,
    onDragMove,
    onDragEnd,
    onSelectNote,
    onRemoveNote,
    onEditNote,
}, ref) => {
    const { t } = useTranslation();

    return (
        <div
            ref={ref}
            className="board"
            onClick={onBackgroundClick}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
        >
            <img
                src="/Fondo.jpg"
                alt="Fondo"
                className="board__bg"
                aria-hidden
            />

            <div className="board__divider board__divider--1" aria-hidden />
            <div className="board__divider board__divider--2" aria-hidden />
            <div className="board__divider board__divider--3" aria-hidden />
            <div className="board__act-label board__act-label--1" aria-hidden style={{ whiteSpace: 'pre-wrap' }}>
                {t('board.act1')}
            </div>
            <div className="board__act-label board__act-label--2a" aria-hidden style={{ whiteSpace: 'pre-wrap' }}>
                {t('board.act2a')}
            </div>
            <div className="board__act-label board__act-label--2b" aria-hidden style={{ whiteSpace: 'pre-wrap' }}>
                {t('board.act2b')}
            </div>
            <div className="board__act-label board__act-label--3" aria-hidden style={{ whiteSpace: 'pre-wrap' }}>
                {t('board.act3')}
            </div>

            <div className="note-counter">
                {notes.length}/{maxNotes}
            </div>

            {notes.map((n) => {
                const isDragging = draggingNoteId === n.id;
                const isSelected = selectedNoteId === n.id;
                return (
                    <StickyNote
                        key={n.id}
                        note={n}
                        onRemove={onRemoveNote}
                        onDragStart={(e) => onDragStart(e, n)}
                        onSelect={onSelectNote}
                        onEdit={onEditNote}
                        isDragging={isDragging}
                        isSelected={isSelected}
                    />
                );
            })}
        </div>
    );
});

export default StickyBoard;
