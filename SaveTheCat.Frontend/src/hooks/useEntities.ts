import { useState, useEffect, useCallback } from "react";
import type { Entity } from "../types/entities";
// Importa el cliente API en lugar de las utilidades de storage
import apiClient from "../api/apiClient";

// El hook ahora toma el ID del proyecto y el tipo de entidad
export function useEntities<T extends Entity>(
  projectId: string | null,
  entityType: 'characters' | 'locations'
) {
  // 1. El estado se inicializa vacío
  const [entities, setEntities] = useState<T[]>([]);

  // 2. Efecto de carga: se dispara cuando el projectId o el tipo de entidad cambian
  useEffect(() => {
    // No cargar nada si no hay un proyecto activo
    if (!projectId) {
      setEntities([]);
      return;
    }

    const fetchEntities = async () => {
      try {
        // Llama al endpoint GET /api/projects/{projectId}/characters (o /locations)
        const response = await apiClient.get(`/projects/${projectId}/${entityType}`);
        setEntities(response.data);
      } catch (error) {
        console.error(`Error al cargar ${entityType}:`, error);
        // Aquí podrías manejar un 401 (token expirado) y forzar un logout
      }
    };

    fetchEntities();
  }, [projectId, entityType]); // Depende del proyecto y el tipo

  // 3. Funciones CRUD refactorizadas para usar la API

  const addEntity = useCallback(async (name: string) => {
    if (!name.trim() || !projectId) return;
    
    const dto = { name: name.trim().toUpperCase() };

    try {
      // POST /api/projects/{projectId}/characters
      // El backend devuelve la nueva entidad creada (con ID)
      const response = await apiClient.post(`/projects/${projectId}/${entityType}`, dto);
      const newEntity = response.data;
      
      // Actualiza el estado local
      setEntities((prev) => [...prev, newEntity]);
    } catch (error) {
      console.error(`Error al crear ${entityType}:`, error);
    }
  }, [projectId, entityType]);

  const updateEntity = useCallback(async (id: string, newName: string) => {
    if (!newName.trim() || !projectId) return;

    const dto = { name: newName.trim().toUpperCase() };

    try {
      // PUT /api/projects/{projectId}/characters/{id}
      await apiClient.put(`/projects/${projectId}/${entityType}/${id}`, dto);

      // Actualiza el estado local (actualización optimista)
      setEntities((prev) =>
        prev.map((e) => (e.id === id ? { ...e, name: dto.name } : e))
      );
    } catch (error) {
      console.error(`Error al actualizar ${entityType}:`, error);
    }
  }, [projectId, entityType]);

  const removeEntity = useCallback(async (id: string) => {
    if (!projectId) return;

    try {
      // DELETE /api/projects/{projectId}/characters/{id}
      await apiClient.delete(`/projects/${projectId}/${entityType}/${id}`);

      // Actualiza el estado local (actualización optimista)
      setEntities((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error(`Error al eliminar ${entityType}:`, error);
    }
  }, [projectId, entityType]);

  // Ya no necesitamos createId, la API se encarga
  return { entities, addEntity, updateEntity, removeEntity } as const;
}