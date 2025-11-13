import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Tu lógica de validación de contraseña
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!/[a-z]/.test(password)) {
    return "Debe contener al menos una minúscula.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Debe contener al menos una mayúscula.";
  }
  if (!/\d/.test(password)) {
    return "Debe contener al menos un dígito.";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
    return "Debe contener al menos un caracter especial (ej: !@#$).";
  }
  return null; // Es válida
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validar campos vacíos
    if (!email || !nickname || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
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
      setError("Las contraseñas no coinciden.");
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
      const errorMsg = err.response?.data?.message || "Error al registrarse. Inténtalo de nuevo.";
      setError(errorMsg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Registrarse</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
           <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button">
            Crear Cuenta
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login" className="auth-link">
            ¿Ya tienes cuenta? Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}