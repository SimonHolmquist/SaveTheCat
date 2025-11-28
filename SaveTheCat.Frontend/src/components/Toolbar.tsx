import UserMenu from "./UserMenu"; // <-- 1. Importar

type Props = {
  onCharactersClick: () => void;
  onLocationsClick: () => void;
  onProjectsClick: () => void;
};

export default function Toolbar({
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

      {/* --- 2. Añadir el menú de usuario aquí --- */}
      <UserMenu />
    </div>
  );
}
