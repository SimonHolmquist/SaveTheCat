import { forwardRef } from "react";
import UserMenu from "./UserMenu";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation()
  
  return (
    <div className="app-toolbar" ref={ref}>
      <div className="toolbar__group">
        <button
          type="button"
          className="toolbar__btn"
          title={t('toolbar.projects')}
          onClick={onProjectsClick}
        >
          📝
        </button>
        <button
          type="button"
          className="toolbar__btn"
          title={t('toolbar.characters')}
          onClick={onCharactersClick}
        >
          👤
        </button>
        <button
          type="button"
          className="toolbar__btn"
          title={t('toolbar.locations')}
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