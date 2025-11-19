import { useState, useEffect, useRef } from "react";
import GenreInput from "./GenreInput";
import TextAreaWithSuggestions from "./TextAreaWithSuggestions";
import apiClient from "../api/apiClient"; 
import type { BeatSheetDto, UpdateBeatSheetDto } from "../types/beatSheet";

const AUTOSAVE_DELAY = 1000;

const beatSheetFields: { label: string; key: keyof BeatSheetDto; description?: string }[] = [
  { label: "TÍTULO DEL PROYECTO:", key: "title", description: "El nombre oficial de tu guion." },
  { label: "LOGLINE:", key: "logline", description: "Tu historia resumida en una sola frase atractiva." },
  { label: "GÉNERO:", key: "genre", description: "El tipo de historia y sus reglas (ej: Un monstruo en casa)." },
  { label: "FECHA:", key: "date", description: "Fecha de la última modificación." },
  { label: "1. Imagen de apertura (1):", key: "openingImage", description: "Establece el tono, el estilo y el 'antes' del protagonista." },
  { label: "2. Declaración del tema (5):", key: "themeStated", description: "Alguien (no el prota) plantea la pregunta o lección moral de la historia." },
  { label: "3. Planteamiento (1-10):", key: "setUp", description: "Presenta al héroe, su mundo (tesis) y lo que le falta en su vida." },
  { label: "4. Catalizador (12):", key: "catalyst", description: "El evento que cambia la vida del héroe para siempre. No hay vuelta atrás." },
  { label: "5. Debate (12-25):", key: "debate", description: "¿Debe ir el héroe? ¿Se atreve? Duda antes de entrar al nuevo mundo." },
  { label: "6. Transición al segundo acto (25):", key: "breakIntoTwo", description: "El héroe decide actuar y cruza el umbral hacia el mundo invertido (antítesis)." },
  { label: "7. Trama B (30):", key: "bStory", description: "La historia de amor o amistad que porta el tema moral." },
  { label: "8. Juegos y risas (30-35):", key: "funAndGames", description: "La promesa de la premisa. Escenas icónicas del género." },
  { label: "9. Punto intermedio (55):", key: "midpoint", description: "Falsa victoria o falsa derrota. Las apuestas suben. El reloj empieza a correr." },
  { label: "10. Los malos estrechan el cerco (55-75):", key: "badGuysCloseIn", description: "Las fuerzas antagonistas atacan interna y externamente." },
  { label: "11. Todo está perdido (75):", key: "allIsLost", description: "Derrota aparente. Olor a muerte. El héroe pierde lo que creía querer." },
  { label: "12. Noche oscura del alma (75-85):", key: "darkNightOfTheSoul", description: "El héroe se lamenta y luego halla la solución (la verdad)." },
  { label: "13. Transición al tercer acto (85):", key: "breakIntoThree", description: "El héroe, habiendo aprendido el tema, decide luchar. Síntesis." },
  { label: "14. Final (85-110):", key: "finale", description: "El héroe aplica la lección aprendida para vencer al malo y cambiar el mundo." },
  { label: "15. Imagen de cierre (110):", key: "finalImage", description: "El espejo de la imagen de apertura. Muestra cuánto ha cambiado el héroe." },
];

const InfoTooltip = ({ text, direction = 'up' }: { text: string; direction?: 'up' | 'down' }) => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  const toggleTooltip = (e: React.MouseEvent) => {
      e.stopPropagation();
      setVisible(!visible);
  }

  // Estilos dinámicos según dirección
  const tooltipStyles: React.CSSProperties = {
      position: 'absolute',
      width: '220px',
      zIndex: 1001,
      background: '#333', // Gris oscuro estilo tooltip nativo
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '0.85rem',
      lineHeight: '1.4',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      whiteSpace: 'normal',
      textAlign: 'left',
      
      // Posicionamiento horizontal: empieza un poco a la izquierda del icono para que el cuerpo vaya a la derecha
      left: '-12px', 
      
      // Posicionamiento vertical
      ...(direction === 'up' 
          ? { bottom: '100%', marginBottom: '10px' } 
          : { top: '100%', marginTop: '10px' }
      )
  };

  // Estilos para la flecha (cola)
  const arrowStyles: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      left: '16px', // Alineado para apuntar al centro del icono (suponiendo icono ~20px)
      
      ...(direction === 'up'
          ? { 
              borderTop: '6px solid #333', 
              top: '100%' // Abajo del tooltip
            } 
          : { 
              borderBottom: '6px solid #333', 
              bottom: '100%' // Arriba del tooltip
            }
      )
  };

  return (
    <div 
      ref={wrapperRef}
      className="tooltip-container"
      style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}
    >
      <button 
        type="button"
        onClick={toggleTooltip}
        className="tooltip-trigger" 
        style={{ cursor: 'pointer', fontSize: '1.1em', background: 'transparent', border: 'none', padding: 0, lineHeight: 1, display:'flex' }}
        title="Click para ver información"
      >
          ℹ️
      </button>
      
      {visible && (
        <div style={tooltipStyles}>
          <div style={arrowStyles} />
          {text}
        </div>
      )}
    </div>
  );
};

const autoGrow = (element: HTMLTextAreaElement) => {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

type Props = {
  projectId: string;
  projectName: string | undefined;
};

export default function BeatSheet({ projectId }: Props) {
  const [beatSheet, setBeatSheet] = useState<BeatSheetDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sheetRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!projectId) return;

    setIsLoading(true);
    const fetchBeatSheet = async () => {
      try {
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

  useEffect(() => {
    if (!beatSheet || !projectId || isLoading) {
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(async () => {
      try {
        const { id, projectId: pId, title, date, ...updateDto } = beatSheet;
        await apiClient.put(`/projects/${projectId}/beatsheet`, updateDto);
        console.log("BeatSheet guardada.");
      } catch (error) {
        console.error("Error al auto-guardar BeatSheet:", error);
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [beatSheet, projectId, isLoading]); 

  const handleInputChange = (
    key: keyof UpdateBeatSheetDto,
    newText: string
  ) => {
    setBeatSheet(prev => {
      if (!prev) return null;
      return { ...prev, [key]: newText };
    });
  };

  useEffect(() => {
    if (sheetRef.current) {
      const textareas = sheetRef.current.querySelectorAll<HTMLTextAreaElement>(".beat-sheet__input");
      textareas.forEach(autoGrow);
    }
  }, [beatSheet]);

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
        
        // 'title' va hacia abajo, el resto hacia arriba
        const tooltipDirection = key === 'title' ? 'down' : 'up';

        return (
          <div
            key={key}
            className="beat-sheet__item"
            data-item-label={key === 'date' ? "fecha" : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                
                {/* Icono primero */}
                {beatSheetFields.find(f => f.key === key)?.description && (
                    <InfoTooltip 
                        text={beatSheetFields.find(f => f.key === key)!.description!} 
                        direction={tooltipDirection}
                    />
                )}

                {/* Texto después */}
                <label className="beat-sheet__label" style={{ marginRight: 0 }}>{label}</label>
            </div>

            {isReadOnly ? (
              <div
                className="beat-sheet__input beat-sheet__input--static"
                aria-label={label}
              >
                {value}
              </div>
            ) : key === 'genre' ? (
              <GenreInput
                value={value}
                onChange={(newValue) => handleInputChange(key, newValue)}
                onInput={(e) => autoGrow(e.currentTarget as HTMLTextAreaElement)}
                ariaLabel={label}
              />
            ) : (
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