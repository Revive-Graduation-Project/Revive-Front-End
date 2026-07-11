import { GOAL_OPTIONS } from "../../constants";

function StepTwo({ formData, onChange, onNext, onBack, errors }) {
  return (
    <>
      <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
        Personal Information
      </h2>
      <form className="w-full space-y-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            placeholder="Enter your weight"
            value={formData.weight}
            onChange={onChange}
            className={`w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors?.weight ? 'border-red-500 focus:ring-red-400' : 'border-orange focus:ring-orange-400'
            }`}
          />
          {errors?.weight && <p className="text-red-500 text-xs">{errors.weight}</p>}
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            name="height"
            placeholder="Enter your height"
            value={formData.height}
            onChange={onChange}
            className={`w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors?.height ? 'border-red-500 focus:ring-red-400' : 'border-orange focus:ring-orange-400'
            }`}
          />
          {errors?.height && <p className="text-red-500 text-xs">{errors.height}</p>}
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={onChange}
            className={`w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors?.age ? 'border-red-500 focus:ring-red-400' : 'border-orange focus:ring-orange-400'
            }`}
          />
          {errors?.age && <p className="text-red-500 text-xs">{errors.age}</p>}
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Gender</label>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={formData.gender === "MALE"}
                onChange={onChange}
              />{" "}
              Male
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formData.gender === "FEMALE"}
                onChange={onChange}
              />{" "}
              Female
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="OTHER"
                checked={formData.gender === "OTHER"}
                onChange={onChange}
              />{" "}
              Other
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Do you exercise regularly?
          </label>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="exercisesRegularly"
                value="true"
                checked={formData.exercisesRegularly === "true"}
                onChange={onChange}
              />{" "}
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="exercisesRegularly"
                value="false"
                checked={formData.exercisesRegularly === "false"}
                onChange={onChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            What is your current goal?
          </label>
          <div className="flex flex-col gap-1 text-sm">
            {GOAL_OPTIONS.map(({label , value}) => (
              <label key={value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="goal"
                  value={value}
                  checked={formData.goal === value}
                  onChange={onChange}
                />{" "}
                {label}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer text-orange font-semibold text-sm"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="cursor-pointer bg-orange text-white px-6 py-2 rounded-full text-sm font-semibold"
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );
}

export default StepTwo;
