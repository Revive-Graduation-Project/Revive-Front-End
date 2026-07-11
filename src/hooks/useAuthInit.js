import { useEffect } from "react";
import { useAuthStore } from "../store";

/**
 * Custom hook to handle session restoration on application mount.
 * Delegates the logic to restoreSession action in authStore.js
 */
export const useAuthInit = () => {
    const restoreSession = useAuthStore((state) => state.restoreSession);

    useEffect(() => {
       restoreSession();
    }, [restoreSession]);
};