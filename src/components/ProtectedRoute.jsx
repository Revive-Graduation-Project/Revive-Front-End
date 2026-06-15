import { Link } from "react-router";
import { useAuthStore } from "../store";

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 *
 * - Authenticated  → renders children normally
 * - NOT authenticated → shows a branded page prompting
 *                       the user to log in (no auto-redirect)
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 pt-24 md:pt-32">
        <div className="relative bg-white rounded-3xl shadow-xl max-w-md w-full p-10 text-center overflow-hidden">

          {/* Decorative top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: "linear-gradient(90deg, var(--color-green), var(--color-orange))" }}
          />

          {/* Lock icon with branded ring */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center"
               style={{ background: "linear-gradient(135deg, #e8f5e9, #fff3e0)" }}>
            <svg
              className="w-10 h-10"
              style={{ color: "var(--color-green)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            You need to be logged in to access this page.
            <br />
            Sign in to enjoy your full{" "}
            <span className="font-semibold" style={{ color: "var(--color-green)" }}>Re</span>
            <span className="font-semibold" style={{ color: "var(--color-orange)" }}>vive</span>
            {" "}experience.
          </p>

          {/* Login button */}
          <Link
            to="/auth/login"
            className="inline-block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, var(--color-green), #43a047)" }}
          >
            Log In
          </Link>

          {/* Secondary actions */}
          <div className="mt-5 flex items-center justify-center gap-3 text-sm text-gray-400">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              ← Back to Home
            </Link>
            <span>·</span>
            <Link to="/auth/signup" className="transition-colors font-medium" style={{ color: "var(--color-orange)" }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;

