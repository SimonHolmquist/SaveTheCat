import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmailPage() {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-form-container" style={{ textAlign: 'center' }}>
        <h2>Verifica tu Correo</h2>
        <p style={{ color: '#ccc' }}>
          Te hemos enviado un correo. Por favor, haz clic en el enlace para verificar tu cuenta.
        </p>
        <p style={{ color: '#ccc', marginTop: '20px' }}>
          (Si estás en modo de desarrollo, revisa la consola del backend para ver el enlace de verificación).
        </p>
        <div className="auth-links" style={{ justifyContent: 'center', marginTop: '30px' }}>
          <Link to="/login" className="auth-link" style={{ 
            background: '#646cff', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '6px',
            textDecoration: 'none'
            }}>
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}