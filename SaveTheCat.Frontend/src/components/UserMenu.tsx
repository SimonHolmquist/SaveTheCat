import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import apiClient from "../api/apiClient";
import { useTranslation } from "react-i18next"; // 1. Importar hook

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const { t, i18n } = useTranslation(); // 2. Usar hook
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleDeleteRequest = () => {
    setIsOpen(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete('/auth/delete-account');
      setShowDeleteModal(false);
      alert(t('toolbar.userMenu.accountDeleted'));
      logout();
    } catch (error) {
      console.error("Error deleting account:", error);
      setShowDeleteModal(false);
    }
  };

  // 3. Función para cambiar idioma
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  if (!currentUser) return null;

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {currentUser.nickname}
      </button>

      {isOpen && (
        <div className="user-menu-dropdown" role="menu">
          {/* 4. Botón de Idioma ES/EN */}
          <button
            type="button"
            className="user-menu-item"
            onClick={toggleLanguage}
            role="menuitem"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>Idioma / Language</span>
            <span>
              <span style={{ fontWeight: i18n.language.startsWith('es') ? 'bold' : 'normal' }}>ES</span>
              {' / '}
              <span style={{ fontWeight: i18n.language.startsWith('en') ? 'bold' : 'normal' }}>EN</span>
            </span>
          </button>

          <Link
            to="/account/change-password"
            className="user-menu-item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            {t('toolbar.userMenu.changePassword')}
          </Link>
          <button
            type="button"
            className="user-menu-item"
            role="menuitem"
            onClick={handleLogout}
          >
            {t('toolbar.userMenu.logout')}
          </button>
          <button
            type="button"
            className="user-menu-item user-menu-item--danger"
            role="menuitem"
            onClick={handleDeleteRequest}
          >
            {t('toolbar.userMenu.deleteAccount')}
          </button>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message={t('toolbar.userMenu.confirmDelete')}
      />
    </div>
  );
}