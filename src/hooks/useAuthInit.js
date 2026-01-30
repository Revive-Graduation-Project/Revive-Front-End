import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

/**
 * Custom hook to handle session restoration on application mount.
 * Delegates the logic to restoreSession action and handles navigation on failure.
 */
export const useAuthInit = () => {
    const navigate = useNavigate();

    const { restoreSession } = useAuthStore.getState();

    useEffect(() => {

       restoreSession().catch(() => {
          navigate('/auth/login' , {replace: true}); // Redirect to login on session restore failure with replace to avoid back navigation
       })

    }, [navigate]);
};