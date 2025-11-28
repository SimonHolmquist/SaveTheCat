import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function VerifyEmailPage() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-form-container" style={{ textAlign: 'center' }}>
        <h2>{t('auth.verifyEmail.title')}</h2>
        <p style={{ color: '#ccc' }}>
          {t('auth.verifyEmail.description')}
        </p>
        <div className="auth-links" style={{ justifyContent: 'center', marginTop: '30px' }}>
          <Link to="/login" className="auth-link" style={{
            background: '#646cff',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none'
            }}>
            {t('auth.verifyEmail.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}