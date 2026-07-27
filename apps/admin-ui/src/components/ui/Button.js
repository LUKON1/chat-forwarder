"use client";

import React from "react";

const VARIANT_CLASSES = {
  primary: "neo-button neo-button-primary",
  secondary: "neo-button neo-button-secondary",
  accent: "neo-button neo-button-accent",
  danger: "neo-button neo-button-danger",
};

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

/* Neo-Brutalist Button Component */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  disabled = false,
  isLoading = false,
  icon = null,
  fullWidth = false,
  onClick,
  ...props
}) {
  const selectedVariant = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const selectedSize = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const widthClass = fullWidth ? "w-full flex justify-center" : "inline-flex";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`items-center justify-center space-x-2 font-mono font-bold transition-all focus:outline-none ${selectedVariant} ${selectedSize} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent animate-spin rounded-full inline-block" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex items-center">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
