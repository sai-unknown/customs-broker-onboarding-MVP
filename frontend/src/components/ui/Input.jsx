import { useEffect, useId } from "react";

export default function Input({
  label,
  error,
  className = "",
  id: idProp,
  ...props
}) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium">
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
