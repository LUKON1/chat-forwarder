"use client";

import React, { useState } from "react";

/* Neo-Brutalist Input Component */
export default function Input({
  label,
  error,
  helperText,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const actualType = isPasswordType && showPassword ? "text" : type;

  const inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}` : undefined);

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-mono font-bold uppercase tracking-wider text-lime-cream-300 mb-2"
        >
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Field Container */}
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-3 neo-input text-sm ${isPasswordType ? "pr-12" : ""} ${
            error ? "border-rose-500 focus:border-rose-400" : ""
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
          {...props}
        />

        {/* Toggle Password Visibility */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 font-mono text-xs text-lime-cream-300 hover:text-lime-cream-100 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-lime-cream-200/70 font-mono">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-xs text-rose-400 font-mono font-bold">
          {error}
        </p>
      )}
    </div>
  );
}
