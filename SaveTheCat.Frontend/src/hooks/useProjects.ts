import { useState, useEffect, useCallback } from "react"; 
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

export interface Project {
  id: string;
  name: string;
}

export function useProjects() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id; 

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <-- 1. AÑADIR ESTADO DE CARGA

  // --- 1. EFECTO PARA CARGAR PROYECTOS ---
  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setIsLoading(false); // <-- 2. Actualizar estado de carga
      return;
    }

    const fetchProjects = async () => {
      setIsLoading(true); // <-- 3. Poner en true al empezar
      try {
        const response = await apiClient.get('/projects');
        const loadedProjects: Project[] = response.data;
        
        setProjects(loadedProjects);

        const activeIdKey = `ACTIVE_PROJECT_ID_${userId}`;
        let activeId = localStorage.getItem(activeIdKey);
        if (!activeId || !loadedProjects.some(p => p.id === activeId)) {
          activeId = loadedProjects[0]?.id ?? null;
        }
        
        setActiveProjectId(activeId);
                
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      } finally {
        setIsLoading(false); // <-- 4. Poner en false al terminar
      }
    };

    fetchProjects();
  }, [userId]); 

  // ... (Efecto de guardar proyecto activo) ...
  useEffect(() => {
    if (activeProjectId && userId) {
      const ACTIVE_PROJECT_ID_KEY = `ACTIVE_PROJECT_ID_${userId}`;
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, activeProjectId);
    }
  }, [activeProjectId, userId]);

  // ... (Funciones addProject, updateProject, removeProject) ...
  const addProject = useCallback(async (name: string) => {
    if (!name.trim()) return;
    const newName = name.trim().toUpperCase();

    try {
      const response = await apiClient.post('/projects', { name: newName });
      const newProject: Project = response.data; 

      setProjects((prev) => [...prev, newProject]);
      setActiveProjectId(newProject.id);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    }
  }, []);

  const updateProject = useCallback(async (id: string, newName: string) => {
    if (!newName.trim()) return;
    const upperName = newName.trim().toUpperCase();

    try {
      await apiClient.put(`/projects/${id}`, { name: upperName });

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: upperName } : p))
      );

    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    }
  }, []);

  const removeProject = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/projects/${id}`);
      
      let newActiveId: string | null = null;
      setProjects((prev) => {
          const newProjects = prev.filter((p) => p.id !== id);
          if (activeProjectId === id) {
             newActiveId = newProjects[0]?.id ?? null;
             setActiveProjectId(newActiveId);
          }
          return newProjects;
      });

    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
    }
  }, [activeProjectId]);

  const setActiveProject = useCallback((id: string) => {
    setActiveProjectId(id);
  }, []);


  return {
    projects, 
    activeProjectId,
    isLoading, // <-- 5. RETORNAR EL ESTADO
    addProject,
    updateProject,
    removeProject,
    setActiveProject,
  };
}