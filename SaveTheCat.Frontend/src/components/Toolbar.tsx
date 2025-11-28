import { forwardRef } from "react";
import UserMenu from "./UserMenu";
import { BEAT_STRUCTURE } from "../utils/beatColors";

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

      <div className="toolbar__group palette" style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {BEAT_STRUCTURE.map((beat) => (
          <div
            key={beat.key}
            className="palette__color"
            style={{
              backgroundColor: beat.color,
              cursor: 'help', // Cursor de ayuda para indicar que es informativo
              minWidth: '24px' // Asegurar que no se aplasten
            }}
            title={`${beat.label}`} // Tooltip nativo con el nombre del beat
            aria-label={beat.label}
          />
        ))}
      </div>

      <div className="toolbar__divider" />
      <UserMenu />
    </div>
  );
});

Toolbar.displayName = "Toolbar";

export default Toolbar;
