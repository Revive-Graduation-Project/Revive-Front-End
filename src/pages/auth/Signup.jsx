import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepOne from "../../components/auth/StepOne";
import StepTwo from "../../components/auth/StepTwo";
import StepThree from "../../components/auth/StepThree";
import { register } from "../../services/auth.service";

function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
  };

  const handleHealthChange = (conditions) => {
    setFormData((prev) => ({ ...prev, healthConditions: conditions }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.phoneNumber) {
        setError("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }

    if (step === 2) {
      if (!formData.age || !formData.height || !formData.weight) {
        setError("Please fill in all fields");
        return;
      }
      if (
        isNaN(Number(formData.age)) ||
        isNaN(Number(formData.height)) ||
        isNaN(Number(formData.weight))
      ) {
        setError("Age, height, and weight must be valid numbers");
        return;
      }
      if (
        Number(formData.age) <= 0 ||
        Number(formData.height) <= 0 ||
        Number(formData.weight) <= 0
      ) {
        setError("Age, height, and weight must be greater than 0");
        return;
      }
    }

    setError(null);
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await register({
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        email: formData.email?.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber?.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        exercisesRegularly:
          formData.exercisesRegularly === "true" ||
          formData.exercisesRegularly === true,
        height: Number(formData.height),
        heightUnit: formData.heightUnit || "cm",
        weight: Number(formData.weight),
        weightUnit: formData.weightUnit || "kg",
        goal: formData.goal,
        healthConditions: Array.isArray(formData.healthConditions)
          ? formData.healthConditions
          : [],
      });

      navigate("/auth/login");
    } catch (err) {
      setError(
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
                error={error}
              />
            )}
            {step === 2 && (
              <StepTwo
                formData={formData}
                onChange={handleChange}
                onNext={nextStep}
                onBack={prevStep}
                error={error}
              />
            )}
            {step === 3 && (
              <StepThree
                formData={formData}
                onHealthChange={handleHealthChange}
                onBack={prevStep}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
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
