import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./i18n";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

// Importa las nuevas páginas
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.tsx";
import VerifyEmailConfirmPage from "./pages/VerifyEmailConfirmPage.tsx"

// Importa los estilos globales
import "./index.css";
import "./styles/globals.css";

const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <App />,
          },
          {
            path: "/account/change-password",
            element: <ChangePasswordPage />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
      // --- 2. AÑADIR LA NUEVA RUTA ---
      {
        path: "/verify-email-confirm",
        element: <VerifyEmailConfirmPage />,
      },
      // --- Fin de la nueva ruta ---
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);