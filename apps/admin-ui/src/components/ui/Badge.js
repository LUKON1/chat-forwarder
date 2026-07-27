"use client";

import React from "react";

const VARIANT_CLASSES = {
  default: "bg-yale-blue-800 text-lime-cream-100 border-black",
  tg: "bg-cerulean-600 text-white border-black",
  vk: "bg-yale-blue-700 text-white border-black",
  success: "bg-lime-cream-500 text-black border-black font-extrabold",
  warning: "bg-amber-400 text-black border-black font-extrabold",
  danger: "bg-rose-600 text-white border-black",
};

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

/* Neo-Brutalist Badge Component */
export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  const selectedVariant = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default;
  const selectedSize = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <span
      className={`inline-flex items-center neo-badge ${selectedVariant} ${selectedSize} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
