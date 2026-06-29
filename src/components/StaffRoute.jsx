import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store";

/**
 * StaffRoute
 *
 * Wraps routes that require staff privileges (e.g., chefs, admins).
 * API-Ready: Uncomment the role check once the backend sends real user.role fields.
 */
function StaffRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Core Authentication Check
    // (Manual navigation is now used via buttons below)

    // 2. Role-Based Authorization Check
    // --- API READY LOGIC ---
    // TODO: Uncomment the block below once your backend connects and sends `user.role`.
    
    /*
    if (user && user.role !== "chef" && user.role !== "admin") {
      console.warn("Access Denied: User does not have staff privileges.");
      navigate("/", { replace: true }); 
    }
    */
    
  }, [isAuthenticated, user, navigate]);

  // Show friendly message while counting down to redirect for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Staff authentication required
        </h2>
        <div className="flex gap-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer" onClick={() => navigate("/auth/login")}>Login</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 cursor-pointer" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  // --- API READY LOGIC ---
  // TODO: Once backend is connected, you can uncomment this hard render block to strictly prevent UI rendering for non-staff
  /*
  if (user && user.role !== "chef" && user.role !== "admin") {
    return null; 
  }
  */

  return children;
}

export default StaffRoute;
