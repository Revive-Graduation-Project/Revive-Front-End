import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { validateEmail } from "../../utils/authValidation"; 

function Login() {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // 2. Add local state for frontend validation errors
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the specific error when the user starts typing again
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 3. Validate before submitting to the backend
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email address";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Stop submission if there are errors
    }

    await login(formData);
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) navigate("/");
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Left Side */}
      <div className="flex flex-col justify-center w-full md:w-1/2 relative">
        <div className="absolute top-8 left-8">
          <img
            src="/Revive.svg"
            alt="Revive Logo"
            className="h-10 object-contain"
          />
        </div>

        <div className="flex justify-center items-center">
          <div className="bg-white w-87.5 rounded-2xl shadow-md p-8 flex flex-col items-center">
            <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
              Welcome Back
            </h2>

            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <MdEmail className="absolute top-3 left-3 text-gray-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ${
                      validationErrors.email ? "border-red-500 focus:ring-red-500" : "border-orange focus:ring-orange-400"
                    }`}
                  />
                </div>
                {/* 4. Display Email Error */}
                {validationErrors.email && (
                  <p className="text-red-500 text-xs ml-4">{validationErrors.email}</p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-1 ${
                      validationErrors.password ? "border-red-500 focus:ring-red-500" : "border-orange focus:ring-orange"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* 5. Display Password Error */}
                {validationErrors.password && (
                  <p className="text-red-500 text-xs ml-4">{validationErrors.password}</p>
                )}
                
                <Link
                  to="/auth/forgot-password"
                  className="self-end text-[11px] text-gray-500 hover:text-orange mt-1"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Backend Error from Zustand Store */}
              {error && (
                <p className="text-red-500 text-xs text-center mt-2">
                  {typeof error === "string"
                    ? error
                    : "Login failed, please try again"}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange hover:bg-orange-500 text-white py-2 rounded-full text-sm font-semibold mt-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="w-full flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-1"></div>
              <p className="mx-2 text-gray-500">or</p>
              <div className="border-t border-gray-300 flex-1"></div>
            </div>

            <div className="flex justify-center gap-5 mt-2">
              <button className="p-3 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition cursor-pointer">
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition cursor-pointer">
                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition cursor-pointer">
                <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
              <span>Don't have an account?</span>
              <Link
                to="/auth/signup"
                className="text-orange font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/Auth_image.jpg')" }}
      />
    </div>
  );
}

export default Login;