import React, { useState, useMemo } from "react"; // <-- 1. Importar useMemo
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"; // <-- 2. Importar useSearchParams
import apiClient from "../api/apiClient"; // <-- 3. Importar apiClient
import { useAuth } from "../context/AuthContext";

// (La función validatePassword sigue igual)
const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[a-z]/.test(password)) return "Debe contener al menos una minúscula.";
  if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula.";
  if (!/\d/.test(password)) return "Debe contener al menos un dígito.";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) return "Debe contener al menos un caracter especial.";
  return null;
};

export default function ResetPasswordPage() {
  // const [otp, setOtp] = useState(""); // <-- 4. ELIMINAR ESTADO DE OTP
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  // --- 5. Leer token y email desde la URL ---
  const [searchParams] = useSearchParams();
  const { token, email } = useMemo(() => ({
    token: searchParams.get("token"),
    email: searchParams.get("email"),
  }), [searchParams]);
  // --- Fin de la lectura ---

  const handleSubmit = async (e: React.FormEvent) => { // <-- 6. Convertir a async
    e.preventDefault();
    setError("");

    // if (!otp || !password || !confirmPassword) { // <-- 7. Quitar OTP de la validación
    if (!password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // --- 8. Validar que tenemos token y email ---
    if (!token || !email) {
      setError("El enlace de reseteo es inválido o ha caducado.");
      return;
    }
    // --- Fin de la validación ---

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // --- 9. Lógica de API real ---
    try {
      console.log("Cambiando contraseña para:", email);
      const resetDto = { email, token, newPassword: password };
      await apiClient.post("/auth/reset-password", resetDto);
      
      alert("¡Contraseña cambiada con éxito! Serás redirigido a Iniciar Sesión.");
      navigate("/login");

    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error al cambiar la contraseña. El enlace puede haber caducado.";
      setError(errorMsg);
    }
    // --- Fin de la lógica de API ---
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Establecer Nueva Contraseña</h2>
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
            <label htmlFor="password">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Guardar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}