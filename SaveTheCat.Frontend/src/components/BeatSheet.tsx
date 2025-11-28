import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import GenreInput from "./GenreInput";
import TextAreaWithSuggestions from "./TextAreaWithSuggestions";
import apiClient from "../api/apiClient";
import type { BeatSheetDto, UpdateBeatSheetDto } from "../types/beatSheet";
import { getColorForBeat } from "../utils/beatColors";
import { useTranslation } from "react-i18next";

const beatFieldsKeys: (keyof BeatSheetDto)[] = [
  "title", "logline", "genre", "date", "openingImage", "themeStated",
  "setUp", "catalyst", "debate", "breakIntoTwo", "bStory", "funAndGames",
  "midpoint", "badGuysCloseIn", "allIsLost", "darkNightOfTheSoul",
  "breakIntoThree", "finale", "finalImage"
];

const AUTOSAVE_DELAY = 1000;

const INPUT_STYLE = { backgroundColor: 'rgba(255, 255, 255, 0.5)' };

const InfoTooltip = ({ text, direction = 'up' }: { text: string; direction?: 'up' | 'down' }) => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
  };

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
        style={{ cursor: 'pointer', fontSize: '1.1em', background: 'transparent', border: 'none', padding: 0, lineHeight: 1, display: 'flex' }}
        title={t('beatSheet.infoTooltip')}
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

const BeatSheet = forwardRef<HTMLDivElement, Props>(({ projectId }: Props, ref) => {
  const [beatSheet, setBeatSheet] = useState<BeatSheetDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sheetRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);
  const { t } = useTranslation();

  useImperativeHandle(ref, () => sheetRef.current!, []);

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
    return <div className="beat-sheet">{t('common.loading')}</div>;
  }

  if (!beatSheet) {
    return <div className="beat-sheet">{t('beatSheet.errorLoading')}</div>;
  }

  return (
    <div className="beat-sheet" ref={sheetRef}>
      {beatFieldsKeys.map((key) => {
        const value = beatSheet[key] as string;

        let label = "";
        let description = "";

        if (["title", "logline", "genre", "date"].includes(key)) {
          label = t(`beatSheet.${key}`);
          description = t(`beatSheet.desc_${key}`);
        } else {
          label = t(`beatSheet.beats.${key}` as any); // Type cast si TS se queja
          description = t(`beatSheet.beatDescriptions.${key}`);
        }

        const isReadOnly = (key === 'title' || key === 'date');
        const fieldColor = getColorForBeat(key);
        const tooltipDirection = key === 'title' ? 'down' : 'up';

        return (
          <div
            key={key}
            className="beat-sheet__item"
            data-item-label={key === 'date' ? t('beatSheet.date') : undefined}
            style={{
              backgroundColor: fieldColor,
              padding: '8px',
              borderRadius: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <InfoTooltip text={description} direction={tooltipDirection} />

              <label className="beat-sheet__label" style={{ marginRight: 0 }} title={t('beatSheet.infoTooltip')}>
                {label}
              </label>
            </div>

            {isReadOnly ? (
              <div
                className="beat-sheet__input beat-sheet__input--static"
                aria-label={label}
                style={{ backgroundColor: fieldColor }}
              >
                {value}
              </div>
            ) : key === 'genre' ? (
              <GenreInput
                value={value}
                onChange={(newValue) => handleInputChange(key, newValue)}
                onInput={(e) => autoGrow(e.currentTarget as HTMLTextAreaElement)}
                ariaLabel={label}
                style={INPUT_STYLE}
              />
            ) : (
              <TextAreaWithSuggestions
                className="beat-sheet__input"
                rows={1}
                value={value}
                onChange={(newValue) => handleInputChange(key as keyof UpdateBeatSheetDto, newValue)}
                onInput={(e) => autoGrow(e.currentTarget as HTMLTextAreaElement)}
                ariaLabel={label}
                style={INPUT_STYLE}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

BeatSheet.displayName = "BeatSheet";

export default BeatSheet;