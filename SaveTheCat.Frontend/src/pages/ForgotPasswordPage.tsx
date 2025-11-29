import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError(t('auth.errors.requiredFields'));
      return;
    }

    try {
      console.log("Enviando correo de reseteo a:", email);
      await apiClient.post("/auth/forgot-password", { email });
      setMessage(t('auth.forgotPassword.success'));
    } catch (err: any) {
      console.error(err);
      // --- Mensaje de error real ---
      // Generalmente, no querrás decirle al usuario si el correo falló o no
      // por razones de seguridad, así que el mensaje de éxito es suficiente.
      // Pero si la API falla por otra razón (ej. 500), mostramos un error genérico.
      if (!err.response?.data?.message) {
        setError(t('auth.errors.unexpected'));
      }
      // Si el backend devuelve un error específico (ej. "Email no válido"), se mostraría aquí:
      // const errorMsg = err.response?.data?.message || "Error al enviar el correo.";
      // setError(errorMsg);

      // Por ahora, mantenemos el mensaje de éxito para ofuscar si el email existe
       setMessage(t('auth.forgotPassword.success'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <img src="/SaveTheCatBoardIcon.png" alt="Logo" className="auth-logo" />
        <h2>{t('auth.forgotPassword.title')}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <p style={{ color: '#ccc', fontSize: '0.9em', textAlign: 'center' }}>
            {t('auth.forgotPassword.description')}
          </p>

          <div className="form-group">
            <label htmlFor="email">{t('auth.common.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button">
            {t('auth.forgotPassword.submit')}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login" className="auth-link">
            {t('auth.forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}