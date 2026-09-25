import React, { forwardRef } from "react";

/**
 * Select — Accessible Dropdown Select for VEYRA Design System
 */
export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      required = false,
      disabled = false,
      fullWidth = true,
      className = "",
      id,
      children,
      ...rest
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            className="w-full bg-transparent px-3.5 py-2.5 text-sm font-sans text-on-surface appearance-none focus:outline-none pr-9 cursor-pointer disabled:cursor-not-allowed"
            {...rest}
          >
            {options.length > 0
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Chevron Indicator */}
          <div className="absolute right-3 pointer-events-none flex items-center text-outline">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              expand_more
            </span>
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="text-xs text-error font-medium flex items-center gap-1 mt-0.5" role="alert">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={`${selectId}-helper`} className="text-xs text-outline font-normal mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
