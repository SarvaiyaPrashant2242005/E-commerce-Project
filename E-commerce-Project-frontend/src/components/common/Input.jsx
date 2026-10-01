import React, { forwardRef } from "react";

/**
 * Input — Accessible Form Input for VEYRA Design System
 */
export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      iconLeading,
      iconTrailing,
      required = false,
      disabled = false,
      fullWidth = true,
      className = "",
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const renderIcon = (icon) => {
      if (!icon) return null;
      if (typeof icon === "string") {
        return (
          <span className="material-symbols-outlined text-[18px] text-outline select-none shrink-0" aria-hidden="true">
            {icon}
          </span>
        );
      }
      return icon;
    };

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-error" aria-hidden="true">*</span>}
          </label>
        )}

        <div
          className={`relative flex items-center bg-surface-container-lowest border rounded-lg transition-all duration-150 ${
            error
              ? "border-error focus-within:ring-2 focus-within:ring-error/20 focus-within:border-error"
              : "border-outline-variant hover:border-outline focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
          } ${disabled ? "opacity-60 bg-surface-container-low cursor-not-allowed" : ""}`}
        >
          {iconLeading && (
            <div className="pl-3 pr-1 flex items-center pointer-events-none">
              {renderIcon(iconLeading)}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={`w-full bg-transparent px-3.5 py-2.5 text-sm font-sans text-on-surface placeholder:text-outline/70 focus:outline-none disabled:cursor-not-allowed ${
              iconLeading ? "pl-2" : ""
            } ${iconTrailing ? "pr-2" : ""}`}
            {...rest}
          />

          {iconTrailing && (
            <div className="pr-3 pl-1 flex items-center">
              {renderIcon(iconTrailing)}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error font-medium flex items-center gap-1 mt-0.5" role="alert">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-outline font-normal mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
