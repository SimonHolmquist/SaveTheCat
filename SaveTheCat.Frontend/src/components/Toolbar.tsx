import UserMenu from "./UserMenu"; // <-- 1. Importar

const PALETTE_COLORS = [
  "#fff59d",
  "#ffab91",
  "#f48fb1",
  "#ce93d8",
  "#b39ddb",
  "#9fa8da",
  "#90caf9",
  "#81d4fa",
  "#a5d6a7",
  "#e6ee9c",
];

type Props = {
  selectedNoteId: string | null;
  onColorChange: (color: string) => void;
  onCharactersClick: () => void;
  onLocationsClick: () => void;
  onProjectsClick: () => void;
};

export default function Toolbar({
  selectedNoteId,
  onColorChange,
  onCharactersClick,
  onLocationsClick,
  onProjectsClick,
}: Props) {
  return (
    <div className="app-toolbar">
      <div className="toolbar__group">
        <button
          type="button"
          className="toolbar__btn"
          title="Gestionar Proyectos"
          onClick={onProjectsClick}
        >
          📝
        </button>
        <button
          type="button"
          className="toolbar__btn"
          title="Personajes"
          onClick={onCharactersClick}
        >
          👤
        </button>
        <button
          type="button"
          className="toolbar__btn"
          title="Locaciones"
          onClick={onLocationsClick}
        >
          🏠
        </button>
      </div>

      <div className="toolbar__divider" />

      <div className="toolbar__group palette">
        {PALETTE_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className="palette__color"
            style={{ backgroundColor: color }}
            aria-label={`Cambiar color a ${color}`}
            title={`Cambiar color a ${color}`}
            disabled={!selectedNoteId}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>

      {/* --- 2. Añadir el menú de usuario aquí --- */}
      <UserMenu />
    </div>
  );
}