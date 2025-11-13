import type { Entity } from "../types/entities";

export const CHARACTERS_KEY = "save-the-cat-characters";
export const LOCATIONS_KEY = "save-the-cat-locations";

export function loadEntities<T extends Entity>(storageKey: string): T[] {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return [];

        const entities = JSON.parse(raw) as any[];

        return entities
            .filter((e) => typeof e.id === "string" && typeof e.name === "string")
            .map((e) => ({
                id: e.id,
                name: e.name,
            } as T));
    } catch {
        return [];
    }
}

export function saveEntities<T extends Entity>(storageKey: string, entities: T[]): void {
    try {
        localStorage.setItem(storageKey, JSON.stringify(entities));
    } catch {}
}
