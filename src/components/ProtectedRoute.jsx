import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store";

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 *
 * - Authenticated  → renders children normally
 * - NOT authenticated → shows a friendly message for 2 seconds,
 *                       then redirects the user to the Login page
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Brief delay so the user can read the message before being redirected
      const timer = setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  // Show friendly message while counting down to redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Please log in to continue
        </h2>
        <p className="text-gray-500 text-sm">
          Redirecting you to the login page…
        </p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
