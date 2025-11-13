import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient"; // <-- Importado
import { useAuth } from "../context/AuthContext"; // <-- Importado

// La función de validación sigue siendo útil
const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[a-z]/.test(password)) return "Debe contener al menos una minúscula.";
  if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula.";
  if (!/\d/.test(password)) return "Debe contener al menos un dígito.";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) return "Debe contener al menos un caracter especial.";
  return null;
};

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Para verificar (aunque la ruta está protegida)

  // Convertido a async para la llamada a la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!currentUser) {
      setError("No estás autenticado.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      // --- Lógica de API real ---
      const changePasswordDto = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
      
      // La API (el interceptor) usará el token del usuario actual
      await apiClient.post("/auth/change-password", changePasswordDto);

      setMessage("¡Contraseña cambiada con éxito!");
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/"), 2000);
      
    } catch (err: any) {
      // --- Error real de la API ---
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error al cambiar la contraseña.";
      setError(errorMsg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Cambiar Contraseña</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          
          <div className="form-group">
            <label htmlFor="currentPassword">Contraseña Actual</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
           <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button">
            Guardar Cambios
          </button>
        </form>
         <div className="auth-links">
          <Link to="/" className="auth-link">
            Volver a la App
          </Link>
        </div>
      </div>
    </div>
  );
}