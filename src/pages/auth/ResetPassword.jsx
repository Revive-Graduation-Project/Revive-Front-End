import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/auth.service";
import { toast } from "sonner";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword: password });
      toast.success("Password reset successfully. You can now log in.");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex w-full min-h-screen bg-gray-100 items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full mx-4">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Invalid Link</h2>
          <p className="text-gray-600 mb-6">
            The password reset link is invalid or has expired. Please request a new link.
          </p>
          <Link
            to="/auth/forgot-password"
            className="inline-block bg-orange text-white px-6 py-2 rounded-full font-semibold hover:bg-orange/90 transition"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-full relative">
        <div className="absolute top-8 left-8">
          <Link to="/">
            <img
              src="/Revive.svg"
              alt="Revive Logo"
              className="h-10 object-contain"
            />
          </Link>
        </div>

        <div className="flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 flex flex-col items-center">
            <h2 className="text-center text-2xl font-semibold mb-2 text-gray-800">
              Set New Password
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Please enter your new password below.
            </p>

            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full bg-orange hover:bg-orange/90 text-white py-2 rounded-full text-sm font-semibold mt-4 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
