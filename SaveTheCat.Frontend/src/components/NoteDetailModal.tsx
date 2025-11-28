import React from "react";
import type { Note, EmotionalCharge } from "../types/note";
import SceneHeadingInput from "./SceneHeadingInput";
import TextAreaWithSuggestions from "./TextAreaWithSuggestions";
import { getColorForBeat } from "../utils/beatColors";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
    onUpdate: (id: string, newContent: Partial<Omit<Note, "id" | "x" | "y">>) => void;
};

const CHARGES: EmotionalCharge[] = ["+/-", "-/+", "+/+", "-/-"];
const BEAT_OPTIONS = [
    { value: "", label: "-- Sin Asignar --" },
    { value: "openingImage", label: "Imagen de apertura" },
    { value: "themeStated", label: "Declaración del tema" },
    { value: "setUp", label: "Planteamiento" },
    { value: "catalyst", label: "Catalizador" },
    { value: "debate", label: "Debate" },
    { value: "breakIntoTwo", label: "Transición al Acto 2" },
    { value: "bStory", label: "Trama B" },
    { value: "funAndGames", label: "Juegos y risas" },
    { value: "midpoint", label: "Punto intermedio" },
    { value: "badGuysCloseIn", label: "Los malos estrechan..." },
    { value: "allIsLost", label: "Todo está perdido" },
    { value: "darkNightOfTheSoul", label: "Noche oscura" },
    { value: "breakIntoThree", label: "Transición al Acto 3" },
    { value: "finale", label: "Final" },
    { value: "finalImage", label: "Imagen de cierre" },
];

export default function NoteDetailModal({ isOpen, onClose, note, onUpdate }: Props) {
    if (!isOpen || !note) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Cierra el modal si se hace clic en el fondo oscuro
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleBeatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const beatItem = e.target.value;
        onUpdate(note.id, { beatItem, color: getColorForBeat(beatItem) });
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
                    
                    <label className="detail-label">TÍTULO</label>
                    <SceneHeadingInput
                        value={note.sceneHeading}
                        onChange={handleSceneHeadingChange}
                        onInput={handleInput}
                        placeholder="(INT. o EXT) - LOCACIÓN - TIEMPO"
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
                <div style={{ marginBottom: '8px' }}>
                        <label className="detail-label">VINCULAR A HOJA DE TRAMA</label>
                        <select
                            value={note.beatItem || ""}
                            onChange={handleBeatChange}
                            style={{
                                width: '100%',
                                padding: '6px',
                                borderRadius: '4px',
                                border: '1px solid rgba(0,0,0,0.1)',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                color: "black"
                            }}
                        >
                            {BEAT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                <div className="modal__buttons">
                    <button className="modal__btn" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}