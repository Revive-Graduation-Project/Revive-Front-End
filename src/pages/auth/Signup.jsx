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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

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
        healthConditions: formData.healthConditions,
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
