import React, { forwardRef } from "react";
import StickyNote from "./StickyNote";
import type { Note } from "../types/note";

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
    onUpdateNote,
    onRemoveNote,
}, ref) => {
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
            <div className="board__act-label board__act-label--1" aria-hidden>
                ACTO I<br />(pp. 1-25)
            </div>
            <div className="board__act-label board__act-label--2" aria-hidden>
                ACTO II<br />(pp. 25-55)
            </div>
            <div className="board__act-label board__act-label--3" aria-hidden>
                ACTO II<br />(pp. 55-85)
            </div>
            <div className="board__act-label board__act-label--4" aria-hidden>
                ACTO III<br />(pp. 85-110)
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
                        onChange={onUpdateNote}
                        onRemove={onRemoveNote}
                        onDragStart={(e) => onDragStart(e, n)}
                        onSelect={onSelectNote}
                        isDragging={isDragging}
                        isSelected={isSelected}
                    />
                );
            })}
        </div>
    );
});

export default StickyBoard;
