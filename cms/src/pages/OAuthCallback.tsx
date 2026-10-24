import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
  const token = searchParams.get('token');

  if (!token) {
    navigate('/login', { replace: true });
    return;
  }

  const authenticate = async () => {
    try {
      await login(token);
      navigate('/dashboard', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
  };

  authenticate();
}, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4"></div>
      <p className="text-gray-600 font-medium">Authenticating securely...</p>
    </div>
  );
}


