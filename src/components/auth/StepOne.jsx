import { FaUser, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

function StepOne({ formData, onChange, onNext, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
        Create Account
      </h2>
      <form className="w-full space-y-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">First Name</label>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={onChange}
              className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Last Name</label>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={onChange}
              className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Phone number</label>
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={onChange}
              className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <MdEmail className="absolute top-3 left-3 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={onChange}
              className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={onChange}
              className="w-full border border-orange rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange"
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
          <label className="text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-500" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={onChange}
              className="w-full border border-orange rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange"
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

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <button
          type="button"
          onClick={onNext}
          className="cursor-pointer w-full bg-(--color-orange) hover:bg-orange-500 text-white py-2 rounded-full text-sm font-semibold mt-2 transition"
        >
          Continue
        </button>
      </form>
    </>
  );
}

export default StepOne;
