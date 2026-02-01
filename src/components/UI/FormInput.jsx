import React from "react";

/**
 * FormInput Component
 * Reusable input field with consistent styling and label.
 * @param {string} label - Input label text
 * @param {string} id - Input ID
 * @param {string} name - Input name attribute
 * @param {string} type - Input type (text, email, tel, etc.)
 * @param {string} value - Controlled input value
 * @param {Function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether input is required
 * @param {string} className - Additional classes
 */
export default function FormInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
        {...props}
      />
    </div>
  );
}
