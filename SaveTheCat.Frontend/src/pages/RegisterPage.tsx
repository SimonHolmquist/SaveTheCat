import React, { useCallback, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const validatePassword = useCallback((pwd: string): string | null => {
    if (pwd.length < 8) {
      return t('auth.validation.password.minLength');
    }
    if (!/[a-z]/.test(pwd)) {
      return t('auth.validation.password.lowercase');
    }
    if (!/[A-Z]/.test(pwd)) {
      return t('auth.validation.password.uppercase');
    }
    if (!/\d/.test(pwd)) {
      return t('auth.validation.password.digit');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pwd)) {
      return t('auth.validation.password.special');
    }
    return null;
  }, [t]);
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validar campos vacíos
    if (!email || !nickname || !password || !confirmPassword) {
      setError(t('auth.errors.requiredFields'));
      return;
    }

    // 2. Validar política de contraseña
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // 3. Validar que contraseñas coincidan
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    try {
      // --- Lógica de simulación eliminada ---
      // El backend manejará si el email o nickname ya existen

      await register(email, nickname, password);
      // Redirección se maneja en el contexto
    } catch (err: any) {
      console.error(err);
      // --- Error real de la API ---
      const errorMsg = err.response?.data?.message || t('auth.register.error');
      setError(errorMsg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <img src="/SaveTheCatBoardIcon.png" alt="Logo" className="auth-logo" />
        <h2>{t('auth.register.title')}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">{t('auth.common.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nickname">{t('auth.common.nickname')}</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('auth.common.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {t('auth.register.submit')}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login" className="auth-link">
            {t('auth.register.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}