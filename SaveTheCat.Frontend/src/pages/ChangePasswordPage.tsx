import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient"; // <-- Importado
import { useAuth } from "../context/AuthContext"; // <-- Importado
import { useTranslation } from "react-i18next";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Para verificar (aunque la ruta está protegida)
  const { t } = useTranslation();

  const validatePassword = useCallback((password: string): string | null => {
    if (password.length < 8) return t('auth.validation.password.minLength');
    if (!/[a-z]/.test(password)) return t('auth.validation.password.lowercase');
    if (!/[A-Z]/.test(password)) return t('auth.validation.password.uppercase');
    if (!/\d/.test(password)) return t('auth.validation.password.digit');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) return t('auth.validation.password.special');
    return null;
  }, [t]);

  // Convertido a async para la llamada a la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!currentUser) {
      setError(t('auth.errors.notAuthenticated'));
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('auth.errors.requiredFields'));
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
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

      setMessage(t('auth.changePassword.success'));
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/"), 2000);
      
    } catch (err: any) {
      // --- Error real de la API ---
      console.error(err);
      const errorMsg = err.response?.data?.message || t('auth.changePassword.error');
      setError(errorMsg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>{t('auth.changePassword.title')}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <div className="form-group">
            <label htmlFor="currentPassword">{t('auth.common.currentPassword')}</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">{t('auth.common.newPassword')}</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
           <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.common.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button">
            {t('auth.changePassword.submit')}
          </button>
        </form>
         <div className="auth-links">
          <Link to="/" className="auth-link">
            {t('auth.common.backToApp')}
          </Link>
        </div>
      </div>
    </div>
  );
}