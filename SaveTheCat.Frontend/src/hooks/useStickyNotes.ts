import { useCallback, useEffect, useState } from "react";
import type { Note } from "../types/note";
// Importa el cliente API
import apiClient from "../api/apiClient";
import { DEFAULT_NOTE_COLOR, getColorForBeat } from "../utils/beatColors";

const NOTE_W_PERCENT = 0.08;
const MAX_NOTES = 40;

export function useStickyNotes(projectId: string | null) {
  // 1. El estado se inicializa vacío
  const [notes, setNotes] = useState<Note[]>([]);

  // 2. Efecto de carga: se dispara cuando el projectId cambia
  useEffect(() => {
    if (!projectId) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      try {
        // GET /api/projects/{projectId}/notes
        const response = await apiClient.get(`/projects/${projectId}/notes`);

        const normalizedNotes = response.data.map((note: Note) => {
          if (note.beatItem) {
            return { ...note, color: getColorForBeat(note.beatItem) };
          }

          return { ...note, color: note.color || DEFAULT_NOTE_COLOR };
        });

        setNotes(normalizedNotes);
      } catch (error) {
        console.error("Error al cargar las notas:", error);
      }
    };

    fetchNotes();
  }, [projectId]);

  // 3. Funciones CRUD refactorizadas

  const addNoteAt = useCallback(async (x: number, y: number, boardW: number, boardH: number) => {
    if (notes.length >= MAX_NOTES || !projectId) {
      return;
    }

    const noteWidth = boardW * NOTE_W_PERCENT;
    const nx = Math.max(8, Math.min(x - noteWidth / 2, boardW - noteWidth - 8));
    const ny = Math.max(8, Math.min(y - noteWidth / 2, boardH - noteWidth - 8));
    
    // Este DTO coincide con tu CreateStickyNoteDto
    const newNoteDto = {
      x: nx,
      y: ny,
      sceneHeading: "",
      description: "",
      emotionalCharge: "+/-",
      emotionalDescription: "",
      conflict: "",
      color: DEFAULT_NOTE_COLOR,
      beatItem: ""
    };

    try {
      // POST /api/projects/{projectId}/notes
      const response = await apiClient.post(`/projects/${projectId}/notes`, newNoteDto);
      const createdNote: Note = response.data; // El backend devuelve la nota con su ID
      
      // Actualiza el estado local
      setNotes((prevNotes) => [...prevNotes, createdNote]);
    } catch (error) {
      console.error("Error al crear la nota:", error);
    }
  }, [projectId, notes.length]); // Depende de projectId

  // Actualiza el contenido completo de la nota (ej. texto)
  const updateNote = useCallback((id: string, newContent: Partial<Omit<Note, "id" | "x" | "y">>) => {
    if (!projectId) return;

    // Actualización optimista del estado de React
    setNotes((prev) => {
      const newNotes = prev.map((n) => {
        if (n.id !== id) return n;

        const updatedNote = { ...n, ...newContent } as Note;

        if ("beatItem" in newContent) {
          updatedNote.color = getColorForBeat(newContent.beatItem);
        }

        return updatedNote;
      });

      // Busca la nota recién actualizada para enviarla a la API
      const updatedNote = newNotes.find(n => n.id === id);

      if (updatedNote) {
        // Prepara el DTO para el endpoint PUT
        // Desestructuramos para quitar campos que no van en el UpdateStickyNoteDto
        const { id: noteId, projectId: pId, ...updateDto } = updatedNote;

        // Llama a la API (fire-and-forget)
        // El estado ya se actualizó, solo enviamos el cambio al backend.
        apiClient.put(`/projects/${projectId}/notes/${id}`, updateDto)
          .catch(err => {
            console.error("Error al actualizar nota (revertir estado?):", err);
            // Aquí podrías implementar lógica para revertir el cambio si la API falla
          });
      }

      return newNotes;
    });
  }, [projectId]);

  // Actualización optimizada solo para posición
  const updateNotePosition = useCallback((id: string, x: number, y: number) => {
    if (!projectId) return;

    // Actualización optimista del estado
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));

    // Llama al endpoint PATCH optimizado (fire-and-forget)
    const positionDto = { x, y };
    apiClient.patch(`/projects/${projectId}/notes/${id}/position`, positionDto)
      .catch(err => console.error("Error al actualizar posición:", err));

  }, [projectId]);

  const removeNote = useCallback(async (id: string) => {
    if (!projectId) return;
    
    try {
      // DELETE /api/projects/{projectId}/notes/{id}
      await apiClient.delete(`/projects/${projectId}/notes/${id}`);
      
      // Actualiza el estado local
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
    }
  }, [projectId]);

  // Ya no usamos createId ni load/saveNotes
  return { notes, addNoteAt, updateNote, updateNotePosition, removeNote, NOTE_W_PERCENT, MAX_NOTES } as const;
}