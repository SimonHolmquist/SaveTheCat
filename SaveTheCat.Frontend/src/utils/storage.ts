import type { Note, EmotionalCharge } from "../types/note";

const getStorageKey = (projectId: string) => `stc_${projectId}_sticky_notes`;
const DEFAULT_COLOR = "#fff59d";

export function loadNotes(projectId: string): Note[] {
    const KEY = getStorageKey(projectId);
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];

        const notes = JSON.parse(raw) as any[];

        return notes.map((note) => {
            if (typeof note.text === "string" && typeof note.sceneHeading === "undefined") {
                return {
                    id: note.id,
                    x: note.x,
                    y: note.y,
                    projectId,
                    sceneHeading: "",
                    description: note.text,
                    emotionalCharge: "+/-" as EmotionalCharge,
                    emotionalDescription: "",
                    conflict: "",
                    color: DEFAULT_COLOR
                };
            }

            return {
                id: note.id,
                x: note.x,
                y: note.y,
                projectId,
                sceneHeading: note.sceneHeading ?? "",
                description: note.description ?? "",
                emotionalCharge: note.emotionalCharge ?? "+/-",
                emotionalDescription: note.emotionalDescription ?? "",
                conflict: note.conflict ?? "",
                color: note.color ?? DEFAULT_COLOR
            };
        });
    } catch {
        return [];
    }
}

export function saveNotes(projectId: string, notes: Note[]): void {
    const KEY = getStorageKey(projectId);
    try {
        localStorage.setItem(KEY, JSON.stringify(notes));
    } catch {}
}
