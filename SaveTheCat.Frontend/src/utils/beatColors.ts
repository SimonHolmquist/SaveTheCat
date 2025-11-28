export const DEFAULT_NOTE_COLOR = "#fff59d";

export const BEAT_COLORS: Record<string, string> = {
  openingImage: "#fff59d",
  themeStated: "#ffab91",
  setUp: "#f48fb1",
  catalyst: "#ce93d8",
  debate: "#b39ddb",
  breakIntoTwo: "#9fa8da",
  bStory: "#90caf9",
  funAndGames: "#81d4fa",
  midpoint: "#a5d6a7",
  badGuysCloseIn: "#e6ee9c",
  allIsLost: "#ffcc80",
  darkNightOfTheSoul: "#ffd54f",
  breakIntoThree: "#c5e1a5",
  finale: "#d7ccc8",
  finalImage: "#cfd8dc",
};

export const getColorForBeat = (beatItem?: string | null) => {
  if (!beatItem) return DEFAULT_NOTE_COLOR;
  return BEAT_COLORS[beatItem] ?? DEFAULT_NOTE_COLOR;
};
