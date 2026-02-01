import React from "react";

/**
 * FormSelect Component
 * Reusable select dropdown with consistent styling and label.
 * @param {string} label - Select label text
 * @param {string} id - Select ID
 * @param {string} name - Select name attribute
 * @param {string} value - Controlled select value
 * @param {Function} onChange - Change handler
 * @param {boolean} required - Whether select is required
 * @param {React.ReactNode} children - Option elements
 * @param {string} className - Additional classes
 */
export default function FormSelect({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  children,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
