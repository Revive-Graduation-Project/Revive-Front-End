function StepTwo({ formData, onChange, onNext, onBack, error }) {
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
            className="w-full border border-orange rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            name="height"
            placeholder="Enter your height"
            value={formData.height}
            onChange={onChange}
            className="w-full border border-orange rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={onChange}
            className="w-full border border-orange rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Gender</label>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={onChange}
              />{" "}
              Male
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={onChange}
              />{" "}
              Female
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
            {[
              "Lose Weight",
              "Gain Weight",
              "Build Muscle",
              "Maintain Current Shape",
            ].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="goal"
                  value={g}
                  checked={formData.goal === g}
                  onChange={onChange}
                />{" "}
                {g}
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
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
            className="cursor-pointer bg-(--color-orange) text-white px-6 py-2 rounded-full text-sm font-semibold"
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );
}

export default StepTwo;
