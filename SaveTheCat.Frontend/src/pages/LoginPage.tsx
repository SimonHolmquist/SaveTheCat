import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t('auth.errors.requiredFields'));
      return;
    }
    
    try {
      await login(email, password);
      // La redirección se maneja dentro de authContext.login
    } catch (err: any) {
      console.error(err);
      // --- Error real de la API ---
      const errorMsg = err.response?.data?.message || t('auth.login.error');
      setError(errorMsg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>{t('auth.login.title')}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">{t('auth.common.emailOrNickname')}</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('auth.common.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="auth-button">
            {t('auth.login.submit')}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/register" className="auth-link">
            {t('auth.login.register')}
          </Link>
          <Link to="/forgot-password" className="auth-link">
            {t('auth.login.forgotPassword')}
          </Link>
        </div>
      </div>
    </div>
  );
}