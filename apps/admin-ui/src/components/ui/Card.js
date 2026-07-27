"use client";

import React from "react";

const SIZE_CLASSES = {
  sm: "p-4 neo-card",
  md: "p-6 neo-card",
  lg: "p-8 neo-card-lg",
};

const VARIANT_CLASSES = {
  default: "",
  accent: "border-lime-cream-400",
  highlight: "bg-yale-blue-800",
  danger: "border-rose-500",
};

/* Neo-Brutalist Container Card */
export default function Card({
  children,
  className = "",
  size = "md",
  variant = "default",
  interactive = false,
  ...props
}) {
  const baseClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const variantClass = VARIANT_CLASSES[variant] || "";
  const interactiveClass = interactive ? "messenger-card" : "";

  return (
    <div
      className={`${baseClass} ${variantClass} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return <div className={`border-b-2 border-black pb-4 mb-4 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return <h3 className={`font-mono font-bold text-lg text-lime-cream-100 ${className}`}>{children}</h3>;
}

function CardContent({ children, className = "" }) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = "" }) {
  return <div className={`border-t-2 border-black pt-4 mt-6 flex items-center justify-between ${className}`}>{children}</div>;
}
