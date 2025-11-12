import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Left Side (Form + Logo) */}
      <div className="flex flex-col justify-center w-full md:w-1/2 relative">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <img
            src="/Revive.svg"
            alt="Revive Logo"
            className="h-10 object-contain"
          />
        </div>

        {/* Login Card */}
        <div className="flex justify-center items-center">
          <div className="bg-white w-[350px] rounded-2xl shadow-md p-8 flex flex-col items-center">
            {/* Title */}
            <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
              Welcome Back
            </h2>

            {/* Form */}
            <form className="w-full space-y-4">
              {/* User Name */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="username" className="text-sm font-medium ">
                  User Name
                </label>
                <div className="relative">
                  <FaUser className="absolute top-3 left-3 text-gray-500" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Gmail */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Gmail
                </label>
                <div className="relative">
                  <MdEmail className="absolute top-3 left-3 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your gmail"
                    className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="password" className="text-sm font-medium ">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-500" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange"
                  />
                </div>

                <Link
                  to="#"
                  className="self-end text-[11px] text-gray-500 hover:text-orange mt-1"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                className="w-full bg-orange hover:bg-orange-500 text-white py-2 rounded-full text-sm font-semibold mt-2 transition cursor-pointer"
              >
                Log in
              </button>
            </form>

            {/* Divider */}
            <div className="w-full flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-1"></div>
              <p className="mx-2 text-gray-500">or</p>
              <div className="border-t border-gray-300 flex-1"></div>
            </div>

            {/* Social Login */}
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
          </div>
        </div>
      </div>

      {/* Right Side (Image) */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Auth_image.jpg')",
        }}
      />
    </div>
  );
}

export default Login;
