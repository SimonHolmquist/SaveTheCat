import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import apiClient from "../api/apiClient"; 
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Por favor, introduce tu email.");
      return;
    }

    try {
      console.log("Enviando correo de reseteo a:", email);
      await apiClient.post("/auth/forgot-password", { email });
      setMessage(
        "Si existe una cuenta con este email, se ha enviado un correo con instrucciones."
      );
    } catch (err: any) {
      console.error(err);
      // --- Mensaje de error real ---
      // Generalmente, no querrás decirle al usuario si el correo falló o no
      // por razones de seguridad, así que el mensaje de éxito es suficiente.
      // Pero si la API falla por otra razón (ej. 500), mostramos un error genérico.
      if (!err.response?.data?.message) {
        setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
      // Si el backend devuelve un error específico (ej. "Email no válido"), se mostraría aquí:
      // const errorMsg = err.response?.data?.message || "Error al enviar el correo.";
      // setError(errorMsg);

      // Por ahora, mantenemos el mensaje de éxito para ofuscar si el email existe
       setMessage(
        "Si existe una cuenta con este email, se ha enviado un correo con instrucciones."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Recuperar Contraseña</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          
          <p style={{ color: '#ccc', fontSize: '0.9em', textAlign: 'center' }}>
            Introduce tu email y te enviaremos un enlace para reiniciar tu contraseña.
          </p>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button">
            Enviar Correo
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}