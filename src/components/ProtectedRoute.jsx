import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store";

/**
 * Renders protected route content when authenticated, or displays a login prompt when not.
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // Show friendly message while counting down to redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Please log in to continue
        </h2>
        <div className="flex gap-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer" onClick={() => navigate("/auth/login")}>Login</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 cursor-pointer" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;

