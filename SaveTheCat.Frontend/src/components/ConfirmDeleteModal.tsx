import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
};

export default function ConfirmDeleteModal({ isOpen, onConfirm, onCancel, message }: Props) {
    const { t } = useTranslation();
    
    if (!isOpen) {
        return null;
    }


    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="modal__overlay" onClick={onCancel}>
            <div className="modal__content" onClick={handleModalClick}>
                <p>{message || t('modals.confirmDeleteNoteDefault')}</p>
                <div className="modal__buttons">
                    <button
                        type="button"
                        className="modal__btn modal__btn--cancel"
                        onClick={onCancel}
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        type="button"
                        className="modal__btn modal__btn--confirm"
                        onClick={onConfirm}
                    >
                        {t('common.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
}
