import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store";

/** Roles allowed to access the dashboard */
const STAFF_ROLES = ["admin", "manager", "chief", "chef"];

/**
 * StaffRoute
 *
 * Wraps routes that require staff privileges (admin, manager, chief).
 * Redirects unauthenticated users to login.
 * Redirects authenticated non-staff users (role = "user") back to home.
 */
function StaffRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const isStaff = user && STAFF_ROLES.includes(user.role?.toLowerCase());

  useEffect(() => {
    // If logged in but not staff, redirect to home
    if (isAuthenticated && user && !isStaff) {
      console.warn("Access Denied: User does not have staff privileges.", user.role);
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, isStaff, navigate]);

  // Not logged in at all
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

  // Logged in but wrong role — block rendering while useEffect redirects
  if (!isStaff) {
    return null;
  }

  return children;
}

export default StaffRoute;
