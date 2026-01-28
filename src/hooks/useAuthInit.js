import { useEffect } from "react";
import { useNavigate } from "react-router";
import { restoreSession } from "../services/auth.service";

/**
 * Custom hook to handle session restoration on application mount.
 * Delegates the logic to auth.service and handles navigation on failure.
 */
export const useAuthInit = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            try {
                await restoreSession();
            } catch (error) {
                // If restoreSession throws, it means refresh failed
                navigate('/auth/login');
            }
        };

        initAuth();
    }, [navigate]);
};
