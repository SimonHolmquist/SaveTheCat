import React, { useCallback, useRef, useState, useEffect, useMemo } from "react";
import StickyBoard from "./components/StickyBoard";
import BeatSheet from "./components/BeatSheet";
import Toolbar from "./components/Toolbar";
import { useStickyNotes } from "./hooks/useStickyNotes";
import type { Note } from "./types/note";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import "./styles/globals.css";
import { useEntities } from "./hooks/useEntities";
import type { Character, Location } from "./types/entities";
import EntityModal from "./components/EntityModal";
import { EntityProvider } from "./context/EntityContext";
import { useProjects } from "./hooks/useProjects";
import ProjectModal from "./components/ProjectModal";
import NoteDetailModal from "./components/NoteDetailModal";
import TutorialOverlay, { type TutorialStep } from "./components/TutorialOverlay";
import { useAuth } from "./context/AuthContext";
import { useTranslation } from "react-i18next";

export default function App() {
    const {
        projects,
        activeProjectId,
        isLoading: isLoadingProjects,
        addProject,
        updateProject,
        removeProject,
        setActiveProject
    } = useProjects();

    const activeId = activeProjectId ?? "default";
    const activeProjectName = projects.find(p => p.id === activeProjectId)?.name;

    const {
        notes,
        addNoteAt,
        updateNote,
        updateNotePosition,
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
    const toolbarRef = useRef<HTMLDivElement>(null);
    const beatSheetRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLElement>(null); // 1. Nueva referencia para el footer

    // Referencias para solucionar los bugs
    const initializationRef = useRef(false); // Evita doble creación de proyecto
    const dragInteractionRef = useRef(false); // Distingue entre click y arrastre

    const [draggingNote, setDraggingNote] = useState<{
        id: string;
        offsetX: number;
        offsetY: number;
    } | null>(null);

    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    type ModalType = "characters" | "locations" | "projects" | null;
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [tutorialStepIndex, setTutorialStepIndex] = useState(0);
    const { currentUser } = useAuth();
    const { t } = useTranslation();

    const tutorialSteps = useMemo<TutorialStep[]>(() => [
        {
            title: t('tutorial.steps.toolbar'),
            description: t('tutorial.steps.toolbarDesc'),
            targetRef: toolbarRef,
        },
        {
            title: t('tutorial.steps.beatSheet'),
            description: t('tutorial.steps.beatSheetDesc'),
            targetRef: beatSheetRef,
        },
        {
            title: t('tutorial.steps.board'),
            description: t('tutorial.steps.boardDesc'),
            targetRef: boardRef,
        },
        {
            title: t('tutorial.steps.footer'),
            description: t('tutorial.steps.footerDesc'),
            targetRef: footerRef,
        },
    ], [t]);

    useEffect(() => {
        if (isLoadingProjects) return;

        if (!initializationRef.current && projects.length === 0 && !activeProjectId) {
            initializationRef.current = true;
            addProject(t('initialProjectName'));
        }
    }, [projects, activeProjectId, addProject, isLoadingProjects]);

    useEffect(() => {
        setSelectedNoteId(null);
        setEditingNoteId(null);
        setDraggingNote(null);
    }, [activeProjectId]);

    useEffect(() => {
        if (!currentUser || isLoadingProjects) return;
        const storageKey = `tutorialSeen-${currentUser.id}`;
        const hasSeenTutorial = localStorage.getItem(storageKey);
        if (!hasSeenTutorial) {
            setTutorialStepIndex(0);
            setIsTutorialOpen(true);
        }
    }, [currentUser, isLoadingProjects]);

    // --- Handlers ---

    const handleBackgroundClick: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        if (!(boardRef.current instanceof HTMLDivElement)) return;
        if (draggingNote) return;

        const bounds = boardRef.current.getBoundingClientRect();
        addNoteAt(e.clientX - bounds.left, e.clientY - bounds.top, bounds.width, bounds.height);

        setSelectedNoteId(null);
    }, [addNoteAt, draggingNote]);

    const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>, note: Note) => {
        if (!boardRef.current) return;
        if ((e.target as HTMLElement).closest(".note__close-pin")) return;

        e.stopPropagation();

        // --- BUG FIX 2: Resetear bandera de arrastre ---
        dragInteractionRef.current = false;

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

        // --- BUG FIX 2: Marcar que hubo movimiento ---
        dragInteractionRef.current = true;

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

    const handleNoteClick = useCallback((id: string) => {
        if (dragInteractionRef.current) return;
        setSelectedNoteId(id); // SOLO selecciona
    }, []);

    // Handler para edición (doble click)
    const handleNoteDoubleClick = useCallback((id: string) => {
        setEditingNoteId(id); // Abre modal
        setSelectedNoteId(id);
    }, []);

    const handleRequestDelete = useCallback((id: string) => {
        setNoteToDelete(id);
    }, []);

    const handleCancelDelete = useCallback(() => {
        setNoteToDelete(null);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (noteToDelete) {
            removeNote(noteToDelete);
            if (editingNoteId === noteToDelete) setEditingNoteId(null);
        }
        setNoteToDelete(null);
    }, [noteToDelete, removeNote, editingNoteId]);

    const noteBeingEdited = useMemo(() =>
        notes.find(n => n.id === editingNoteId) || null
        , [notes, editingNoteId]);

    const markTutorialAsSeen = useCallback(() => {
        if (currentUser) {
            localStorage.setItem(`tutorialSeen-${currentUser.id}`, "true");
        }
        setIsTutorialOpen(false);
    }, [currentUser]);

    const handleNextStep = useCallback(() => {
        if (tutorialStepIndex >= tutorialSteps.length - 1) {
            markTutorialAsSeen();
            return;
        }
        setTutorialStepIndex((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
    }, [markTutorialAsSeen, tutorialStepIndex, tutorialSteps.length]);

    const handlePrevStep = useCallback(() => {
        setTutorialStepIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    if (isLoadingProjects || !activeProjectId) {
        return <div className="app-container">{t('common.loading')}</div>;
    }

    return (
        <div className="app-container">
            <Toolbar
                ref={toolbarRef}
                onProjectsClick={() => setActiveModal("projects")}
                onCharactersClick={() => setActiveModal("characters")}
                onLocationsClick={() => setActiveModal("locations")}
            />

            <EntityProvider value={{ characters, locations }}>
                <div className="app-content">
                    <BeatSheet
                        ref={beatSheetRef}
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
                        onSelectNote={handleNoteClick}
                        onEditNote={handleNoteDoubleClick}
                        onUpdateNote={updateNote}
                        onRemoveNote={handleRequestDelete}
                    />
                </div>

                <NoteDetailModal
                    isOpen={!!editingNoteId}
                    onClose={() => setEditingNoteId(null)}
                    note={noteBeingEdited}
                    onUpdate={updateNote}
                    onOpenLocationsModal={() => setActiveModal("locations")}
                    onAddLocation={addLocation}
                />

                <ConfirmDeleteModal
                    isOpen={noteToDelete !== null}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />

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
                        setActiveModal(null);
                    }}
                />

                <EntityModal
                    isOpen={activeModal === "characters"}
                    onClose={() => setActiveModal(null)}
                    title={t('modals.manageCharacters')}
                    placeholderName={t('modals.characterPlaceholder')}
                    entities={characters}
                    onAdd={addCharacter}
                    onUpdate={updateCharacter}
                    onDelete={removeCharacter}
                />

                <EntityModal
                    isOpen={activeModal === "locations"}
                    onClose={() => setActiveModal(null)}
                    title={t('modals.manageLocations')}
                    placeholderName={t('modals.locationPlaceholder')}
                    entities={locations}
                    onAdd={addLocation}
                    onUpdate={updateLocation}
                    onDelete={removeLocation}
                />

                <TutorialOverlay
                    steps={tutorialSteps}
                    currentStep={tutorialStepIndex}
                    isOpen={isTutorialOpen}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                    onSkip={markTutorialAsSeen}
                />
            </EntityProvider>

            {/* 3. Asignar la referencia al footer */}
            <footer className="app-footer" ref={footerRef}>
                <a
                    href="https://github.com/SimonHolmquist"
                    target="_blank"
                    rel="noreferrer"
                    className="app-footer__link"
                >
                    {t('footer.by')}
                </a>
                <a
                    href="mailto:simon.holmquist@gmail.com"
                    className="app-footer__link"
                >
                    simon.holmquist@gmail.com
                </a>
                <a
                    href="https://cafecito.app/savethecatboard"
                    target="_blank"
                    rel="noreferrer"
                    className="app-footer__link"
                >
                    {t('footer.contribute')}
                </a>
            </footer>
        </div>
    );
}