import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailConfirmPage() {
  // --- 1. TODOS LOS HOOKS ARRIBA ---
  const [status, setStatus] = useState<Status>('loading');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Combinamos las dos llamadas a useAuth en una sola
  const { loginWithToken, currentUser } = useAuth(); 
  
  // Extraemos token y email de la URL
  const { token, email } = useMemo(() => ({
    token: searchParams.get('token'),
    email: searchParams.get('email'),
  }), [searchParams]);

  useEffect(() => {
    // Si el usuario ya está logueado, o si el status ya cambió, no hacemos nada.
    if (currentUser || status !== 'loading') return;

    const verifyEmail = async () => {
      if (!token || !email) {
        setStatus('error');
        return;
      }

      try {
        // 1. Llama al backend para confirmar el email
        const response = await apiClient.post('/auth/confirm-email', { email, token });
        
        // 2. El backend devuelve un AuthResponseDto (token, user)
        const { token: jwtToken, user } = response.data;

        // 3. Usamos la función del contexto para loguear al usuario
        loginWithToken(jwtToken, user);

        // 4. Marcamos como exitoso
        setStatus('success');

        // 5. Redirigimos a la app principal después de 5 segundos
        setTimeout(() => {
          navigate('/');
        }, 5000);

      } catch (err) {
        console.error("Error al verificar el email:", err);
        setStatus('error');
      }
    };

    verifyEmail();
  // Añadimos currentUser a las dependencias. Si cambia, el efecto se re-evalúa
  }, [token, email, status, loginWithToken, navigate, currentUser]); 

  // --- 2. RETURNS CONDICIONALES (DESPUÉS DE LOS HOOKS) ---
  
  // Si el usuario ya está logueado (sea por este proceso o de antes),
  // lo redirigimos a la app.
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // --- Renderizado basado en el estado ---
  
  if (status === 'loading') {
    return (
      <div className="auth-page">
        <div className="auth-form-container" style={{ textAlign: 'center' }}>
          <h2>Verificando tu correo...</h2>
        </div>
      </div>
    );
  }
  
  if (status === 'error') {
     return (
      <div className="auth-page">
        <div className="auth-form-container" style={{ textAlign: 'center' }}>
          <h2>Error de Verificación</h2>
          <p style={{ color: '#ffab91' }}>
            No se pudo verificar tu correo. El enlace puede ser inválido o haber caducado.
          </p>
        </div>
      </div>
    );
  }

  // (status === 'success')
  return (
    <div className="auth-page">
      <div className="auth-form-container" style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#a5d6a7' }}>¡Correo Verificado!</h2>
        <p style={{ color: '#ccc' }}>
          Tu cuenta ha sido verificada con éxito.
        </p>
        <p style={{ color: '#ccc', marginTop: '20px' }}>
          Serás redireccionado a la aplicación en 5 segundos...
        </p>
      </div>
    </div>
  );
}