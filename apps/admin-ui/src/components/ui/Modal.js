"use client";

import React, { useEffect } from "react";

/* Neo-Brutalist Modal Component */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  className = "",
}) {
  /* Handle Escape key to close modal */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Body */}
      <div
        className={`relative z-10 w-full ${maxWidth} neo-card-lg p-6 md:p-8 bg-yale-blue-900 animate-in fade-in zoom-in-95 duration-150 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
          <h3 className="font-mono font-bold text-lg md:text-xl text-lime-cream-100 uppercase tracking-wide">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center neo-button neo-button-secondary text-sm font-mono font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
