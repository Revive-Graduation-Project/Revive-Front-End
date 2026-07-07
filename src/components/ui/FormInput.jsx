import React, { forwardRef } from "react";

/**
 * FormInput Component
 * 
 * A standardized, accessible input field used across the application.
 * 
 * Features:
 * - Label Association: Automatically links `label` to `input` via `id`.
 * - Icon Support: Renders a leading icon if provided.
 * - Error States: Displays localized error messages in red with a focus ring adjustment.
 * - Ref Forwarding: Fully compatible with `react-hook-form`.
 */
const FormInput = forwardRef(({
  label,
  id,
  name,
  type = "text",
  error,
  icon: Icon,
  className = "",
  ...props
}, ref) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
            error ? "border-red-500 focus:ring-red-500 bg-red-50" : "border-gray-300"
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";
export default FormInput;
