// [file-path]: simonholmquist/savethecat/SaveTheCat-870e49267253fe7ea3a3d49bc18d5da1b2e9e0ac/SaveTheCat.Frontend/src/utils/beatColors.ts
import i18n from "../i18n";

export const DEFAULT_NOTE_COLOR = "#fff59d";

// Definición centralizada de la estructura de Beats y sus colores
export const BEAT_STRUCTURE = [
  { key: "openingImage", label: "1. Imagen de apertura", color: "#FFEB3B" }, // Amarillo fuerte
  { key: "themeStated", label: "2. Declaración del tema", color: "#FFCC80" }, // Naranja claro
  { key: "setUp", label: "3. Planteamiento", color: "#EF9A9A" }, // Rojo claro
  { key: "catalyst", label: "4. Catalizador", color: "#CE93D8" }, // Violeta claro
  { key: "debate", label: "5. Debate", color: "#B39DDB" }, // Morado
  { key: "breakIntoTwo", label: "6. Transición al Acto 2", color: "#9FA8DA" }, // Índigo claro
  { key: "bStory", label: "7. Trama B", color: "#90CAF9" }, // Azul claro
  { key: "funAndGames", label: "8. Juegos y risas", color: "#81D4FA" }, // Celeste
  { key: "midpoint", label: "9. Punto intermedio", color: "#A5D6A7" }, // Verde
  { key: "badGuysCloseIn", label: "10. Los malos estrechan el cerco", color: "#E6EE9C" }, // Lima
  { key: "allIsLost", label: "11. Todo está perdido", color: "#FFE082" }, // Ámbar
  { key: "darkNightOfTheSoul", label: "12. Noche oscura del alma", color: "#FFD54F" }, // Amarillo oscuro
  { key: "breakIntoThree", label: "13. Transición al Acto 3", color: "#C5E1A5" }, // Verde claro
  { key: "finale", label: "14. Final", color: "#BCAAA4" }, // Marrón claro
  { key: "finalImage", label: "15. Imagen de cierre", color: "#CFD8DC" }, // Gris azulado
] as const;

// Mapa rápido para búsquedas por clave (usado por el hook)
export const BEAT_COLORS: Record<string, string> = BEAT_STRUCTURE.reduce((acc, beat) => {
  acc[beat.key] = beat.color;
  return acc;
}, {} as Record<string, string>);

export const getColorForBeat = (beatItem?: string | null) => {
  if (!beatItem) return DEFAULT_NOTE_COLOR;
  return BEAT_COLORS[beatItem] ?? DEFAULT_NOTE_COLOR;
};

export const getLabelForBeat = (beatItem?: string | null) => {
    const beat = BEAT_STRUCTURE.find(b => b.key === beatItem);
    return beat ? beat.label : i18n.t('noteDetail.unassigned');
};