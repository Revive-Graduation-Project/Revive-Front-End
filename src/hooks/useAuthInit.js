// useAuthInit.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const useAuthInit = () => {
  const navigate = useNavigate();
  const { isAuthenticated , restoreSession , logout } = useAuthStore();

  // 1 Bootstrap effect — run once on app mount
  useEffect(() => {
    restoreSession().catch(() => {
      // If restore fails, go to login
      navigate('/auth/login', { replace: true }); // Replace to avoid back navigation to protected routes
    });
  }, [navigate]); 

  // 2 Reactive effect — run whenever session expires during runtime
  useEffect(() => {
    if (isAuthenticated === false) {
      logout();  
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);
};
