import React, { forwardRef } from "react";

/**
 * FormSelect Component
 * Reusable select dropdown with consistent styling and label.
 * Supports React Hook Form via forwardRef.
 */
const FormSelect = forwardRef(({
  label,
  id,
  name,
  error,
  children,
  className = "",
  ...props
}, ref) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        ref={ref}
        id={id}
        name={name}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white ${
          error ? "border-red-500 focus:ring-red-500 bg-red-50" : "border-gray-300"
        }`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

FormSelect.displayName = "FormSelect";
export default FormSelect;
