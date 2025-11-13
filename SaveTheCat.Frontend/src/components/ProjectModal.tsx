import React, { useState } from "react";
import type { Project } from "../hooks/useProjects"; // Importa el tipo Project
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    projects: readonly Project[];
    activeProjectId: string | null;
    onAdd: (name: string) => void;
    onUpdate: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void; // Función para cambiar de proyecto
};

export default function ProjectModal({
    isOpen,
    onClose,
    projects,
    activeProjectId,
    onAdd,
    onUpdate,
    onDelete,
    onSelect,
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

    const handleStartEdit = (project: Project) => {
        setEditing({ id: project.id, name: project.name });
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
        // No permitir eliminar el único proyecto que queda
        if (projects.length <= 1) {
            alert("No puedes eliminar el único proyecto. Crea uno nuevo antes de eliminar este.");
            return;
        }
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

    const getProjectName = (id: string) => projects.find((e) => e.id === id)?.name || "";

    const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUpdate();
        }
    };

    return (
        <div className="modal__overlay" onClick={handleClose}>
            <div className="modal__content entity-modal" onClick={handleModalClick}>
                <h2>Gestionar Proyectos</h2>

                <div className="entity-modal__form">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value.toUpperCase())}
                        onKeyDown={handleAddKeyDown}
                        placeholder="Nuevo proyecto..."
                    />
                    <button type="button" onClick={handleAdd}>Añadir</button>
                </div>

                <ul className="entity-modal__list">
                    {projects.map((project) => (
                        <li key={project.id}
                            className={project.id === activeProjectId ? "entity-modal__item--active" : ""}
                        >
                            {editing?.id === project.id ? (
                                <div className="entity-modal__edit">
                                    <input
                                        type="text"
                                        value={editing.name}
                                        onChange={(e) => setEditing({ ...editing, name: e.target.value.toUpperCase() })}
                                        onKeyDown={handleEditKeyDown}
                                        autoFocus
                                    />
                                    <button onClick={handleUpdate}>Guardar</button>
                                    <button onClick={handleCancelEdit}>Cancelar</button>
                                </div>
                            ) : (
                                <div className="entity-modal__view">
                                    <span
                                        className="entity-modal__name"
                                        title="Seleccionar este proyecto"
                                        onClick={() => onSelect(project.id)}
                                    >
                                        {project.name}
                                        {project.id === activeProjectId && " (Activo)"}
                                    </span>
                                    <div>
                                        {project.id !== activeProjectId && (
                                            <button onClick={() => onSelect(project.id)}>
                                                Seleccionar
                                            </button>
                                        )}
                                        <button onClick={() => handleStartEdit(project)}>Editar</button>
                                        {projects.length > 1 && (
                                            <button onClick={() => handleRequestDelete(project.id)}>
                                                Eliminar
                                            </button>
                                        )}
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
                message={`¿Estás seguro de que quieres eliminar "${getProjectName(deletingId || "")}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
}