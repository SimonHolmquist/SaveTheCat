import { forwardRef } from "react";
import UserMenu from "./UserMenu";

type Props = {
  onCharactersClick: () => void;
  onLocationsClick: () => void;
  onProjectsClick: () => void;
};

const Toolbar = forwardRef<HTMLDivElement, Props>(({
  onCharactersClick,
  onLocationsClick,
  onProjectsClick,
}, ref) => {
  return (
    <div className="app-toolbar" ref={ref}>
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
      <UserMenu />
    </div>
  );
});

Toolbar.displayName = "Toolbar";

export default Toolbar;