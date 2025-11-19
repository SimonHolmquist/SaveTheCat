import React from "react";
import type { Note, EmotionalCharge } from "../types/note";
import SceneHeadingInput from "./SceneHeadingInput";
import TextAreaWithSuggestions from "./TextAreaWithSuggestions";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
    onUpdate: (id: string, newContent: Partial<Omit<Note, "id" | "x" | "y">>) => void;
};

const CHARGES: EmotionalCharge[] = ["+/-", "-/+", "+/+", "-/-"];

export default function NoteDetailModal({ isOpen, onClose, note, onUpdate }: Props) {
    if (!isOpen || !note) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
         // Cierra el modal si se hace clic en el fondo oscuro
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleTextAreaChange = (
        newValue: string,
        field: "description" | "emotionalDescription" | "conflict"
    ) => {
        onUpdate(note.id, { [field]: newValue });
    };

    const handleSceneHeadingChange = (newValue: string) => {
        onUpdate(note.id, { sceneHeading: newValue });
    };

    const handleChargeClick = () => {
        const currentIndex = CHARGES.indexOf(note.emotionalCharge);
        const nextIndex = (currentIndex + 1) % CHARGES.length;
        const newCharge = CHARGES[nextIndex];
        onUpdate(note.id, { emotionalCharge: newCharge });
    };
    
    const handleInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        // Auto-grow logic simple para el modal
        const target = e.currentTarget;
        target.style.height = "auto";
        target.style.height = `${target.scrollHeight}px`;
    };

    const isRed = note.emotionalCharge === "-/-" || note.emotionalCharge === "-/+";
    const buttonClass = `note__charge-btn ${isRed ? "note__charge-btn--red" : ""}`;

    return (
        <div className="modal__overlay" onClick={handleOverlayClick}>
            <div className="modal__content note-detail-modal" style={{ backgroundColor: note.color }}>
                <div className="note-detail-modal__header">
                    <h3>Detalles de la Escena</h3>
                    <button onClick={onClose} className="modal__close-btn">✕</button>
                </div>

                <div className="note-detail-modal__body">
                    <label className="detail-label">ENCABEZADO</label>
                    <SceneHeadingInput
                        value={note.sceneHeading}
                        onChange={handleSceneHeadingChange}
                        onInput={handleInput}
                        placeholder="INT. CASA - DÍA"
                        ariaLabel="Encabezado de escena"
                    />

                    <label className="detail-label">DESCRIPCIÓN</label>
                    <TextAreaWithSuggestions
                        className="note__textarea note__description"
                        rows={4}
                        value={note.description}
                        onChange={(val) => handleTextAreaChange(val, "description")}
                        onInput={handleInput}
                        placeholder="¿Qué sucede en la escena?"
                        ariaLabel="Descripción"
                    />

                    <div className="note__field-group">
                        <div style={{display:'flex', flexDirection:'column', gap:'4px', flex: 1}}>
                            <label className="detail-label">CAMBIO EMOCIONAL</label>
                             <div style={{display: 'flex', gap: '8px'}}>
                                <button
                                    type="button"
                                    className={buttonClass}
                                    onClick={handleChargeClick}
                                    title="Cambiar carga"
                                >
                                    {note.emotionalCharge}
                                </button>
                                <TextAreaWithSuggestions
                                    className="note__textarea"
                                    rows={1}
                                    value={note.emotionalDescription}
                                    onChange={(val) => handleTextAreaChange(val, "emotionalDescription")}
                                    onInput={handleInput}
                                    placeholder="Descripción del cambio..."
                                    ariaLabel="Descripción emocional"
                                />
                             </div>
                        </div>
                    </div>

                    <label className="detail-label">CONFLICTO</label>
                    <div className="note__field-group">
                        <span className="note__conflict-label">&gt;&lt;</span>
                        <TextAreaWithSuggestions
                            className="note__textarea"
                            rows={1}
                            value={note.conflict}
                            onChange={(val) => handleTextAreaChange(val, "conflict")}
                            onInput={handleInput}
                            placeholder="¿Cuál es el conflicto?"
                            ariaLabel="Conflicto"
                        />
                    </div>
                </div>
                
                <div className="modal__buttons">
                    <button className="modal__btn" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}