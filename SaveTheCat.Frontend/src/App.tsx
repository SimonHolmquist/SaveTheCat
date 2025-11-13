import React, { useCallback, useRef, useState, useEffect } from "react";
import StickyBoard from "./components/StickyBoard";
import BeatSheet from "./components/BeatSheet";
import Toolbar from "./components/Toolbar";
import { useStickyNotes } from "./hooks/useStickyNotes";
import type { Note } from "./types/note";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import "./styles/globals.css";
import { useEntities } from "./hooks/useEntities";
import type { Character, Location } from "./types/entities";
// Ya no importamos las claves fijas
import EntityModal from "./components/EntityModal";
import { EntityProvider } from "./context/EntityContext";

// --- ¡Nuevos imports! ---
import { useProjects } from "./hooks/useProjects";
import ProjectModal from "./components/ProjectModal";

export default function App() {
    // --- 1. Hook de Proyectos ---
    const {
        projects,
        activeProjectId,
        isLoading: isLoadingProjects, // <-- 1. OBTENER EL ESTADO
        addProject,
        updateProject,
        removeProject,
        setActiveProject
    } = useProjects();

    // --- 2. Hooks de Datos (ahora dependen de activeProjectId) ---
    // Si no hay proyecto activo (ej. en la carga inicial), usamos un fallback
    const activeId = activeProjectId ?? "default";
    const activeProjectName = projects.find(p => p.id === activeProjectId)?.name;

    const {
        notes,
        addNoteAt,
        updateNote,
        updateNotePosition,
        updateNoteColor,
        removeNote,
        NOTE_W_PERCENT,
        MAX_NOTES
    } = useStickyNotes(activeId); 

    const {
        entities: characters,
        addEntity: addCharacter,
        updateEntity: updateCharacter,
        removeEntity: removeCharacter
    } = useEntities<Character>(activeId, 'characters'); 

    const {
        entities: locations,
        addEntity: addLocation,
        updateEntity: updateLocation,
        removeEntity: removeLocation
    } = useEntities<Location>(activeId, 'locations'); 

    const boardRef = useRef<HTMLDivElement>(null);

    const [draggingNote, setDraggingNote] = useState<{
        id: string;
        offsetX: number;
        offsetY: number;
    } | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

    type ModalType = "characters" | "locations" | "projects" | null; 
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    // --- 3. Crear proyecto por defecto si no existe ninguno ---
    useEffect(() => {
        // ¡CONDICIÓN IMPORTANTE! No ejecutar si está cargando
        if (isLoadingProjects) {
            return;
        }
        
        if (projects.length === 0 && !activeProjectId) {
            addProject("MI PRIMER PROYECTO");
        }
    // 2. Añadir isLoadingProjects a las dependencias
    }, [projects, activeProjectId, addProject, isLoadingProjects]);
    
    // --- 4. Resetea la selección al cambiar de proyecto ---
    useEffect(() => {
        setSelectedNoteId(null);
        setDraggingNote(null);
    }, [activeProjectId]);

    // --- Handlers (sin cambios) ---
    const handleBackgroundClick: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        if (!(boardRef.current instanceof HTMLDivElement)) return;
        if (draggingNote) return;

        const bounds = boardRef.current.getBoundingClientRect();
        addNoteAt(e.clientX - bounds.left, e.clientY - bounds.top, bounds.width, bounds.height);

        setSelectedNoteId(null);
    }, [addNoteAt, draggingNote]);

    const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>, note: Note) => {
        if (!boardRef.current) return;
        if ((e.target as HTMLElement).closest(".note__close-pin")) {
            return;
        }
        e.stopPropagation();

        const boardBounds = boardRef.current.getBoundingClientRect();
        const mouseX = e.clientX - boardBounds.left;
        const mouseY = e.clientY - boardBounds.top;

        setDraggingNote({
            id: note.id,
            offsetX: mouseX - note.x,
            offsetY: mouseY - note.y
        });

        setSelectedNoteId(note.id);
    }, []);

    const handleDragMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!draggingNote || !boardRef.current) return;
        e.stopPropagation();

        const boardBounds = boardRef.current.getBoundingClientRect();
        const boardW = boardBounds.width;
        const boardH = boardBounds.height;

        const mouseX = e.clientX - boardBounds.left;
        const mouseY = e.clientY - boardBounds.top;

        let newX = mouseX - draggingNote.offsetX;
        let newY = mouseY - draggingNote.offsetY;

        const noteWidth = boardW * NOTE_W_PERCENT;

        newX = Math.max(8, Math.min(newX, boardW - noteWidth - 8));
        newY = Math.max(8, Math.min(newY, boardH - noteWidth - 8));

        updateNotePosition(draggingNote.id, newX, newY);
    }, [draggingNote, updateNotePosition, NOTE_W_PERCENT]);

    const handleDragEnd = useCallback(() => {
        setDraggingNote(null);
    }, []);

    const handleSelectNote = useCallback((id: string) => {
        setSelectedNoteId(id);
    }, []);

    const handleColorChange = useCallback((color: string) => {
        if (selectedNoteId) {
            updateNoteColor(selectedNoteId, color);
        }
    }, [selectedNoteId, updateNoteColor]);

    const handleRequestDelete = useCallback((id: string) => {
        setNoteToDelete(id);
    }, []);

    const handleCancelDelete = useCallback(() => {
        setNoteToDelete(null);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (noteToDelete) {
            removeNote(noteToDelete);
        }
        setNoteToDelete(null);
    }, [noteToDelete, removeNote]);

    
    // --- 5. Renderizado ---
    // 3. Modifica el estado de carga
    if (isLoadingProjects || !activeProjectId) {
        return <div className="app-container">Cargando...</div>;
    }

    return (
        <div className="app-container">
            <Toolbar
                selectedNoteId={selectedNoteId}
                onColorChange={handleColorChange}
                onProjectsClick={() => setActiveModal("projects")} 
                onCharactersClick={() => setActiveModal("characters")}
                onLocationsClick={() => setActiveModal("locations")}
            />
            
            <EntityProvider value={{ characters, locations }}>
                <div className="app-content">
                    <BeatSheet
                        projectId={activeProjectId}
                        projectName={activeProjectName}
                    />
                    
                    <StickyBoard
                        ref={boardRef}
                        notes={notes}
                        maxNotes={MAX_NOTES}
                        draggingNoteId={draggingNote?.id ?? null}
                        selectedNoteId={selectedNoteId}
                        onBackgroundClick={handleBackgroundClick}
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                        onSelectNote={handleSelectNote}
                        onUpdateNote={updateNote}
                        onRemoveNote={handleRequestDelete}
                    />
                </div>
            </EntityProvider>

            <ConfirmDeleteModal
                isOpen={noteToDelete !== null}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {/* --- 6. Nuevos Modales --- */}
            <ProjectModal
                isOpen={activeModal === "projects"}
                onClose={() => setActiveModal(null)}
                projects={projects}
                activeProjectId={activeProjectId}
                onAdd={addProject}
                onUpdate={updateProject}
                onDelete={removeProject}
                onSelect={(id) => {
                    setActiveProject(id);
                    setActiveModal(null); // Cierra el modal al seleccionar
                }}
            />

            <EntityModal
                isOpen={activeModal === "characters"}
                onClose={() => setActiveModal(null)}
                title="Gestionar Personajes"
                placeholderName="Nombre del personaje"
                entities={characters}
                onAdd={addCharacter}
                onUpdate={updateCharacter}
                onDelete={removeCharacter}
            />

            <EntityModal
                isOpen={activeModal === "locations"}
                onClose={() => setActiveModal(null)}
                title="Gestionar Locaciones"
                placeholderName="Nombre de la locación"
                entities={locations}
                onAdd={addLocation}
                onUpdate={updateLocation}
                onDelete={removeLocation}
            />
        </div>
    );
}