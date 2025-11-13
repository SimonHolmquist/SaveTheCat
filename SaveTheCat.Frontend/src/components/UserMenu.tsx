import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmDeleteModal from "./ConfirmDeleteModal"; // Reutilizamos tu modal
import apiClient from "../api/apiClient";

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se hace clic fuera de él
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
      // 3. Llamar a la API
      await apiClient.delete('/auth/delete-account');

      setShowDeleteModal(false);
      alert("Cuenta eliminada exitosamente.");
      logout(); // Cierra sesión después de eliminar

    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      setShowDeleteModal(false);
      alert("Error al eliminar la cuenta. Por favor, inténtalo de nuevo.");
    }
  };

  if (!currentUser) {
    return null; // No mostrar nada si no hay usuario (aunque esto no debería pasar en una ruta protegida)
  }

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
          <Link
            to="/account/change-password"
            className="user-menu-item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Cambiar Contraseña
          </Link>
          <button
            type="button"
            className="user-menu-item"
            role="menuitem"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
          <button
            type="button"
            className="user-menu-item user-menu-item--danger"
            role="menuitem"
            onClick={handleDeleteRequest}
          >
            Eliminar Cuenta
          </button>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message="¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
      />
    </div>
  );
}