import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Si no hay usuario, redirige a la página de login
    // 'replace' evita que el usuario pueda "volver" a la página protegida
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderiza el contenido de la ruta (en nuestro caso, App.tsx)
  return <Outlet />;
};

export default ProtectedRoute;