import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

// Definimos el tipo de usuario (puedes expandirlo)
interface User {
  id: string;
  nickname: string;
  email: string;
}

// Definimos el tipo del contexto
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, nickname: string, pass: string) => Promise<void>;
  logout: () => void;
  loginWithToken: (token: string, user: User) => void; // <-- 1. AÑADIR NUEVA FUNCIÓN
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// El Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);
  const navigate = useNavigate();

  const login = async (email: string, pass: string) => {
    // ... (Tu código de login existente) ...
    console.log("Iniciando sesión real con:", email);
    const loginDto = {
      emailOrNickname: email,
      password: pass,
    };
    const response = await apiClient.post('/auth/login', loginDto);
    const { token, user } = response.data;
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    navigate("/");
  };

  const register = async (email: string, nickname: string, pass: string) => {
    // ... (Tu código de register existente) ...
    console.log("Registrando usuario real con:", email, nickname);
    const registerDto = { email, nickname, password: pass };
    await apiClient.post('/auth/register', registerDto);
    
    // Esto sigue siendo correcto, la página /verify-email es informativa
    navigate("/verify-email");
  };

  const logout = () => {
    // ... (Tu código de logout existente) ...
    console.log("Cerrando sesión real");
    setCurrentUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    navigate("/login");
  };

  // --- 2. AÑADIR IMPLEMENTACIÓN DE LA NUEVA FUNCIÓN ---
  const loginWithToken = (token: string, user: User) => {
    console.log("Iniciando sesión con token de verificación");
    // 1. Guarda el token y el usuario
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // 2. Actualiza el estado
    setCurrentUser(user);
    
    // 3. La página que llama a esto (VerifyEmailConfirmPage) se encargará de la redirección
  };
  // --- Fin de la nueva función ---

  const value = {
    currentUser,
    login,
    register,
    logout,
    loginWithToken, // <-- 3. Añadirla al valor del contexto
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para consumir el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}