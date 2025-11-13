import { useState, useEffect, useRef } from "react";
import GenreInput from "./GenreInput";
import TextAreaWithSuggestions from "./TextAreaWithSuggestions";
import apiClient from "../api/apiClient"; // <-- Importa el cliente API
import type { BeatSheetDto, UpdateBeatSheetDto } from "../types/beatSheet"; // <-- (Ver nota abajo)

// --- Lógica de auto-guardado ---
const AUTOSAVE_DELAY = 1000; // 1 segundo de retraso

// Mapea las etiquetas a las claves del DTO para el renderizado
const beatSheetFields: { label: string; key: keyof BeatSheetDto }[] = [
  { label: "TÍTULO DEL PROYECTO:", key: "title" },
  { label: "LOGLINE:", key: "logline" },
  { label: "GÉNERO:", key: "genre" },
  { label: "FECHA:", key: "date" },
  { label: "1. Imagen de apertura (1):", key: "openingImage" },
  { label: "2. Declaración del tema (5):", key: "themeStated" },
  { label: "3. Planteamiento (1-10):", key: "setUp" },
  { label: "4. Catalizador (12):", key: "catalyst" },
  { label: "5. Debate (12-25):", key: "debate" },
  { label: "6. Transición al segundo acto (25):", key: "breakIntoTwo" },
  { label: "7. Trama B (30):", key: "bStory" },
  { label: "8. Juegos y risas (30-35):", key: "funAndGames" },
  { label: "9. Punto intermedio (55):", key: "midpoint" },
  { label: "10. Los malos estrechan el cerco (55-75):", key: "badGuysCloseIn" },
  { label: "11. Todo está perdido (75):", key: "allIsLost" },
  { label: "12. Noche oscura del alma (75-85):", key: "darkNightOfTheSoul" },
  { label: "13. Transición al tercer acto (85):", key: "breakIntoThree" },
  { label: "14. Final (85-110):", key: "finale" },
  { label: "15. Imagen de cierre (110):", key: "finalImage" },
];

const autoGrow = (element: HTMLTextAreaElement) => {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

type Props = {
  projectId: string;
  // projectName ya no es necesario, el título vendrá de la API
  projectName: string | undefined; 
};

export default function BeatSheet({ projectId }: Props) {
  // 1. Estado para guardar los datos de la hoja
  const [beatSheet, setBeatSheet] = useState<BeatSheetDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sheetRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);

  // 2. Efecto para CARGAR la BeatSheet
  useEffect(() => {
    if (!projectId) return;

    setIsLoading(true);
    const fetchBeatSheet = async () => {
      try {
        // GET /api/projects/{projectId}/beatsheet
        const response = await apiClient.get(`/projects/${projectId}/beatsheet`);
        setBeatSheet(response.data);
      } catch (error) {
        console.error("Error al cargar BeatSheet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeatSheet();
  }, [projectId]);

  // 3. Efecto para GUARDAR la BeatSheet (con debounce)
  useEffect(() => {
    // No guardar si:
    // - Aún no se ha cargado (beatSheet es null)
    // - El proyecto no está definido
    // - Ya hay un guardado en curso (isLoading)
    if (!beatSheet || !projectId || isLoading) {
      return;
    }

    // Si hay un timer pendiente, lo cancelamos
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Creamos un nuevo timer
    debounceTimer.current = window.setTimeout(async () => {
      try {
        // Prepara el DTO: quita los campos que no se actualizan
        const { id, projectId: pId, title, date, ...updateDto } = beatSheet;
        
        // PUT /api/projects/{projectId}/beatsheet
        await apiClient.put(`/projects/${projectId}/beatsheet`, updateDto);
        console.log("BeatSheet guardada.");

      } catch (error) {
        console.error("Error al auto-guardar BeatSheet:", error);
      }
    }, AUTOSAVE_DELAY);

    // Limpia el timer si el componente se desmonta
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [beatSheet, projectId, isLoading]); // Se dispara con cada cambio en beatSheet

  // 4. Handler unificado para actualizar el estado local
  const handleInputChange = (
    key: keyof UpdateBeatSheetDto,
    newText: string
  ) => {
    // Actualiza el estado local, lo que disparará el efecto de auto-guardado
    setBeatSheet(prev => {
      if (!prev) return null;
      return { ...prev, [key]: newText };
    });
  };

  // 5. Auto-grow al cargar y al cambiar
  useEffect(() => {
    if (sheetRef.current) {
      const textareas = sheetRef.current.querySelectorAll<HTMLTextAreaElement>(".beat-sheet__input");
      textareas.forEach(autoGrow);
    }
  }, [beatSheet]); // Se re-calcula cuando los datos cambian

  if (isLoading) {
    return <div className="beat-sheet">Cargando...</div>;
  }
  
  if (!beatSheet) {
    return <div className="beat-sheet">Error al cargar la hoja de trama.</div>;
  }

  return (
    <div className="beat-sheet" ref={sheetRef}>
      {beatSheetFields.map(({ label, key }) => {
        const value = beatSheet[key] as string;
        const isReadOnly = (key === 'title' || key === 'date');

        return (
          <div
            key={key}
            className="beat-sheet__item"
            data-item-label={key === 'date' ? "fecha" : undefined}
          >
            <label className="beat-sheet__label">{label}</label>

            {isReadOnly ? (
              // 6. Inputs de Título y Fecha son solo de lectura
              <div
                className="beat-sheet__input beat-sheet__input--static"
                aria-label={label}
              >
                {value}
              </div>
            ) : key === 'genre' ? (
              // 7. Input de Género
              <GenreInput
                value={value}
                onChange={(newValue) => handleInputChange(key, newValue)}
                onInput={(e) => autoGrow(e.currentTarget as HTMLTextAreaElement)}
                ariaLabel={label}
              />
            ) : (
              // 8. Inputs de Texto normales
              <TextAreaWithSuggestions
                className="beat-sheet__input"
                rows={1}
                value={value}
                onChange={(newValue) => handleInputChange(key as keyof UpdateBeatSheetDto, newValue)}
                onInput={(e) => autoGrow(e.currentTarget as HTMLTextAreaElement)}
                ariaLabel={label}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}