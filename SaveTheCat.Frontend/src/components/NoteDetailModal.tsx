// [file-path]: simonholmquist/savethecat/SaveTheCat-870e49267253fe7ea3a3d49bc18d5da1b2e9e0ac/SaveTheCat.Frontend/src/components/NoteDetailModal.tsx

import React from "react";
import type { Note, EmotionalCharge } from "../types/note";
import SceneHeadingInput from "./SceneHeadingInput";
import TextAreaWithSuggestions from "./TextAreaWithSuggestions";
import { getColorForBeat, BEAT_STRUCTURE } from "../utils/beatColors";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
    onUpdate: (id: string, newContent: Partial<Omit<Note, "id" | "x" | "y">>) => void;
    onOpenLocationsModal: () => void;
    onAddLocation: (name: string) => void;
};

const CHARGES: EmotionalCharge[] = ["+/-", "-/+", "+/+", "-/-"];

export default function NoteDetailModal({ isOpen, onClose, note, onUpdate, onOpenLocationsModal, onAddLocation }: Props) {
    if (!isOpen || !note) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleBeatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const beatItem = e.target.value;
        // Al cambiar el Beat, forzamos la actualización del color
        onUpdate(note.id, {
            beatItem,
            color: getColorForBeat(beatItem)
        });
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
        const target = e.currentTarget;
        target.style.height = "auto";
        target.style.height = `${target.scrollHeight}px`;
    };

    const isRed = note.emotionalCharge === "-/-" || note.emotionalCharge === "-/+";
    const buttonClass = `note__charge-btn ${isRed ? "note__charge-btn--red" : ""}`;

    return (
        <div className="modal__overlay" onClick={handleOverlayClick}>
            <div className="modal__content note-detail-modal" style={{ borderTop: `8px solid ${note.color}` }}>
                <div className="note-detail-modal__header">
                    <h3>Detalles de la Escena</h3>
                    <button onClick={onClose} className="modal__close-btn">✕</button>
                </div>

                <div className="note-detail-modal__body">



                    <label className="detail-label">TÍTULO</label>
                    <SceneHeadingInput
                        value={note.sceneHeading}
                        onChange={handleSceneHeadingChange}
                        onInput={handleInput}
                        placeholder="(INT. o EXT) - LOCACIÓN - TIEMPO"
                        ariaLabel="Encabezado de escena"
                        onOpenLocationsModal={onOpenLocationsModal}
                        onAddLocation={onAddLocation}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                            <label className="detail-label">CAMBIO EMOCIONAL</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
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
                                    placeholder="¿Qué cambio emocional ocurrió?"
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

                <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                    <label className="detail-label" style={{ display: 'block', marginBottom: '6px' }}>VINCULAR A HOJA DE TRAMA (DEFINE EL COLOR)</label>
                    <select
                        value={note.beatItem || ""}
                        onChange={handleBeatChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: 'white',
                            color: "#333",
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">-- Sin Asignar (Nota Libre) --</option>
                        {BEAT_STRUCTURE.map(beat => (
                            <option key={beat.key} value={beat.key}>
                                {beat.label}
                            </option>
                        ))}
                    </select>
                    {/* Pequeña previsualización del color seleccionado */}
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Color asignado:
                        <span style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: note.color,
                            border: '1px solid #ccc',
                            display: 'inline-block'
                        }}></span>
                    </div>
                </div>

                <div className="modal__buttons">
                    <button className="modal__btn" onClick={onClose}>Cerrar</button>
                </div>
                
            </div>
        </div>
    );
}