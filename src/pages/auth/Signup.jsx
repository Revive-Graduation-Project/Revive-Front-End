import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import AllergiesDropdown from "../../components/AllergiesDropdown";

function Signup() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Left Side */}
      <div className="flex flex-col justify-center w-full md:w-1/2 relative">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <img src="/Revive.svg" alt="Revive Logo" className="h-10" />
        </div>

        <div className="flex justify-center items-center">
          <div className="bg-white w-[380px] rounded-2xl shadow-md p-8 flex flex-col items-center">
            {/* Step 1 */}
            {step === 1 && (
              <>
                <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
                  Create Account
                </h2>
                <form className="w-full space-y-4">
                  {/* Full Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute top-3 left-3 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <MdEmail className="absolute top-3 left-3 text-gray-500" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <FaLock className="absolute top-3 left-3 text-gray-500" />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute top-3 left-3 text-gray-500" />
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        className="w-full border border-orange rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className=" cursor-pointer w-full bg-orange hover:bg-orange-500 text-white py-2 rounded-full text-sm font-semibold mt-2 transition"
                  >
                    Continue
                  </button>
                </form>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
                  Personal Information
                </h2>

                <form className="w-full space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Weight</label>
                    <input
                      type="text"
                      placeholder="Enter your weight"
                      className="w-full border border-orange rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Height</label>
                    <input
                      type="text"
                      placeholder="Enter your height"
                      className="w-full border border-orange rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Age</label>
                    <input
                      type="number"
                      placeholder="Enter your age"
                      className="w-full border border-orange rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  {/* Exercise */}
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Do you exercise regularly?
                    </label>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-1">
                        <input type="radio" name="exercise" /> Yes
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="exercise" /> No
                      </label>
                    </div>
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      What is your current goal?
                    </label>
                    <div className="flex flex-col gap-1 text-sm">
                      <label className="flex items-center gap-1">
                        <input type="radio" name="goal" /> Lose Weight
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="goal" /> Gain Weight
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="goal" /> Build Muscle
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="goal" /> Maintain Current
                        Shape
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cursor-pointer text-orange font-semibold text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="cursor-pointer bg-orange text-white px-6 py-2 rounded-full text-sm font-semibold "
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
                  Health Conditions
                </h2>

                <form className="w-full space-y-4">
                  <AllergiesDropdown />

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-orange font-semibold text-sm cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange hover:bg-orange-500 text-white py-2 rounded-full text-sm font-semibold mt-2 transition cursor-pointer"
                  >
                    Create Account
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Side (Image) */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/Auth_image.jpg')" }}
      />
    </div>
  );
}

export default Signup;
