import React, { useState } from "react";
import type { Entity } from "../types/entities";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    placeholderName: string;
    entities: readonly Entity[];
    onAdd: (name: string) => void;
    onUpdate: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
};

export default function EntityModal({
    isOpen,
    onClose,
    title,
    placeholderName,
    entities,
    onAdd,
    onUpdate,
    onDelete,
}: Props) {
    const [newName, setNewName] = useState("");
    const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    if (!isOpen) {
        return null;
    }

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleClose = () => {
        setNewName("");
        setEditing(null);
        onClose();
    };

    const handleAdd = () => {
        onAdd(newName);
        setNewName("");
    };

    const handleStartEdit = (entity: Entity) => {
        setEditing({ id: entity.id, name: entity.name });
    };

    const handleCancelEdit = () => {
        setEditing(null);
    };

    const handleUpdate = () => {
        if (editing) {
            onUpdate(editing.id, editing.name);
            setEditing(null);
        }
    };

    const handleRequestDelete = (id: string) => {
        setDeletingId(id);
    };

    const handleConfirmDelete = () => {
        if (deletingId) {
            onDelete(deletingId);
        }
        setDeletingId(null);
    };

    const handleCancelDelete = () => {
        setDeletingId(null);
    };

    const getEntityName = (id: string) => entities.find((e) => e.id === id)?.name || "";

    const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita cualquier comportamiento por defecto
            handleAdd();
        }
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita cualquier comportamiento por defecto
            handleUpdate();
        }
    };

    return (
        <div className="modal__overlay" onClick={handleClose}>
            <div className="modal__content entity-modal" onClick={handleModalClick}>
                <h2>{title}</h2>

                <div className="entity-modal__form">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value.toUpperCase())}
                        onKeyDown={handleAddKeyDown}
                        placeholder={placeholderName}
                    />
                    <button type="button" onClick={handleAdd}>Añadir</button>
                </div>

                <ul className="entity-modal__list">
                    {entities.map((entity) => (
                        <li key={entity.id}>
                            {editing?.id === entity.id ? (
                                <div className="entity-modal__edit">
                                    <input
                                        type="text"
                                        value={editing.name}
                                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                        onKeyDown={handleEditKeyDown}
                                        autoFocus
                                    />
                                    <button onClick={handleUpdate}>Guardar</button>
                                    <button onClick={handleCancelEdit}>Cancelar</button>
                                </div>
                            ) : (
                                <div className="entity-modal__view">
                                    <span>{entity.name}</span>
                                    <div>
                                        <button onClick={() => handleStartEdit(entity)}>Editar</button>
                                        <button onClick={() => handleRequestDelete(entity.id)}>Eliminar</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="modal__buttons">
                    <button type="button" className="modal__btn" onClick={handleClose}>
                        Cerrar
                    </button>
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={deletingId !== null}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                message={`¿Estás seguro de que quieres eliminar "${getEntityName(deletingId || "")}"?`}
            />
        </div>
    );
}
