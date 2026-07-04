import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepOne from "../../components/auth/StepOne";
import StepTwo from "../../components/auth/StepTwo";
import StepThree from "../../components/auth/StepThree";
import { useAuthStore } from "../../store";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../../utils/authValidation";

function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Stores field-specific frontend errors
  const [submitError, setSubmitError] = useState(null); // Stores backend API errors
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    age: "",
    gender: "",
    exercisesRegularly: null,
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    goal: "",
    healthConditions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleHealthChange = (conditions) => {
    setFormData((prev) => ({ ...prev, healthConditions: conditions }));
  };

  const nextStep = () => {
    const newErrors = {};

    // --- STEP 1 VALIDATION ---
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = "Invalid phone number format";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Invalid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters, contain uppercase, lowercase, number, and special character";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // --- STEP 2 VALIDATION ---
    if (step === 2) {
      if (!formData.age) newErrors.age = "Age is required";
      if (!formData.height) newErrors.height = "Height is required";
      if (!formData.weight) newErrors.weight = "Weight is required";

      if (
        formData.age &&
        (isNaN(Number(formData.age)) || Number(formData.age) <= 0)
      ) {
        newErrors.age = "Age must be a valid number greater than 0";
      }
      if (
        formData.height &&
        (isNaN(Number(formData.height)) || Number(formData.height) <= 0)
      ) {
        newErrors.height = "Height must be a valid number greater than 0";
      }
      if (
        formData.weight &&
        (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0)
      ) {
        newErrors.weight = "Weight must be a valid number greater than 0";
      }
    }

    // If there are any errors in the current step, halt transition
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed to the next step
    setErrors({});
    setSubmitError(null);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrors({});
    setSubmitError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError(null);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        age: Number(formData.age),
        gender: formData.gender,
        exercisesRegularly: formData.exercisesRegularly === "true",
        height: Number(formData.height),
        heightUnit: formData.heightUnit,
        weight: Number(formData.weight),
        weightUnit: formData.weightUnit,
        goal: formData.goal,
        healthConditions: formData.healthConditions.length ? formData.healthConditions : ["NONE"],
      });

      navigate("/auth/login");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ?? "Signup failed, please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-full md:w-1/2 relative">
        <div className="absolute top-8 left-8">
          <img src="/Revive.svg" alt="Revive Logo" className="h-10" />
        </div>

        <div className="flex justify-center items-center">
          <div className="bg-white w-95 rounded-2xl shadow-md p-8 flex flex-col items-center">
            {step === 1 && (
              <StepOne
                formData={formData}
                onChange={handleChange}
                onNext={nextStep}
                errors={errors} // Pass the complete errors object down
              />
            )}
            {step === 2 && (
              <StepTwo
                formData={formData}
                onChange={handleChange}
                onNext={nextStep}
                onBack={prevStep}
                errors={errors}
              />
            )}
            {step === 3 && (
              <StepThree
                formData={formData}
                onHealthChange={handleHealthChange}
                onBack={prevStep}
                onSubmit={handleSubmit}
                loading={loading}
                error={submitError} // Pass backend submission error here
              />
            )}
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/Auth_image.jpg')" }}
      />
    </div>
  );
}

export default Signup;
