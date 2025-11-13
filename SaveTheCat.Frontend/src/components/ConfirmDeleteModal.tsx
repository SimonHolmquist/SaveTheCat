import React from "react";

type Props = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
};

export default function ConfirmDeleteModal({ isOpen, onConfirm, onCancel, message }: Props) {
    if (!isOpen) {
        return null;
    }

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="modal__overlay" onClick={onCancel}>
            <div className="modal__content" onClick={handleModalClick}>
                <p>{message || "¿Estás seguro de que quieres eliminar esta nota?"}</p>
                <div className="modal__buttons">
                    <button
                        type="button"
                        className="modal__btn modal__btn--cancel"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="modal__btn modal__btn--confirm"
                        onClick={onConfirm}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
