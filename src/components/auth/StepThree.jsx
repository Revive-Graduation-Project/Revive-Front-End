import AllergiesDropdown from "../ui/AllergiesDropdown";

function StepThree({
  formData,
  onHealthChange,
  onBack,
  onSubmit,
  loading,
  error,
}) {
  return (
    <>
      <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
        Health Conditions
      </h2>
      <form className="w-full space-y-4">
        <AllergiesDropdown
          selected={formData.healthConditions}
          onChange={onHealthChange}
        />

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-orange font-semibold text-sm cursor-pointer"
          >
            Back
          </button>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-(--color-orange) hover:bg-orange-500 text-white py-2 rounded-full text-sm font-semibold mt-2 transition cursor-pointer disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </>
  );
}

export default StepThree;
