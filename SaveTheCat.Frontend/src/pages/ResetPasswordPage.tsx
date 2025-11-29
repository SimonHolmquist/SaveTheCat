import React, { useState, useMemo, useCallback } from "react"; // <-- 1. Importar useMemo
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"; // <-- 2. Importar useSearchParams
import apiClient from "../api/apiClient"; // <-- 3. Importar apiClient
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  // const [otp, setOtp] = useState(""); // <-- 4. ELIMINAR ESTADO DE OTP
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  // Mantén todos los hooks en el tope del componente para evitar desalineación
  // cuando el estado de autenticación cambie entre renderizados.
  const [searchParams] = useSearchParams();
  const { token, email } = useMemo(() => ({
    token: searchParams.get("token"),
    email: searchParams.get("email"),
  }), [searchParams]);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const validatePassword = useCallback((pwd: string): string | null => {
    if (pwd.length < 8) return t('auth.validation.password.minLength');
    if (!/[a-z]/.test(pwd)) return t('auth.validation.password.lowercase');
    if (!/[A-Z]/.test(pwd)) return t('auth.validation.password.uppercase');
    if (!/\d/.test(pwd)) return t('auth.validation.password.digit');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pwd)) return t('auth.validation.password.special');
    return null;
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => { // <-- 6. Convertir a async
    e.preventDefault();
    setError("");

    // if (!otp || !password || !confirmPassword) { // <-- 7. Quitar OTP de la validación
    if (!password || !confirmPassword) {
      setError(t('auth.errors.requiredFields'));
      return;
    }

    // --- 8. Validar que tenemos token y email ---
    if (!token || !email) {
      setError(t('auth.resetPassword.invalidLink'));
      return;
    }
    // --- Fin de la validación ---

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.resetPassword.mismatch'));
      return;
    }

    // --- 9. Lógica de API real ---
    try {
      console.log("Cambiando contraseña para:", email);
      const resetDto = { email, token, newPassword: password };
      await apiClient.post("/auth/reset-password", resetDto);

      alert(t('auth.resetPassword.success'));
      navigate("/login");

    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || t('auth.resetPassword.error');
      setError(errorMsg);
    }
    // --- Fin de la lógica de API ---
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <img src="/SaveTheCatBoardIcon.png" alt="Logo" className="auth-logo" />
        <h2>{t('auth.resetPassword.title')}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          {/* --- 10. ELIMINAR CAMPO OTP ---
          <div className="form-group">
            <label htmlFor="otp">OTP (Código del email)</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          */}

          <div className="form-group">
            <label htmlFor="password">{t('auth.common.newPassword')}</label>
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
            {t('auth.resetPassword.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}