import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../services/auth.service";
import { toast } from "sonner";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await requestPasswordReset({ email });
      setSuccess(true);
      toast.success("Password reset email sent (if account exists)");
    } catch (error) {
      // Don't leak whether the email exists, just show a generic error if the network fails
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
              Forgot Password
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {success ? (
              <div className="w-full bg-green-50 text-green-700 p-4 rounded-lg text-sm mb-6 text-center">
                If an account exists for <b>{email}</b>, we have sent a password reset link to it. 
                Please check your inbox.
              </div>
            ) : (
              <form className="w-full space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <MdEmail className="absolute top-3 left-3 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-orange hover:bg-orange/90 text-white py-2 rounded-full text-sm font-semibold mt-4 transition cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <div className="mt-6 text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/auth/login"
                className="text-orange font-semibold hover:underline"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
