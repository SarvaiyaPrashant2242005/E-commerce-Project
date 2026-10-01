import React from "react";
import { Link } from "react-router-dom";

/**
 * Button — Universal VEYRA Action Button
 *
 * @param {Object} props
 * @param {"primary" | "secondary" | "outline" | "ghost" | "danger"} [props.variant="primary"]
 * @param {"sm" | "md" | "lg"} [props.size="md"]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {string | React.ReactNode} [props.iconLeading]
 * @param {string | React.ReactNode} [props.iconTrailing]
 * @param {"button" | "a" | typeof Link} [props.as="button"]
 * @param {string} [props.to] For router links
 * @param {string} [props.href] For external links
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeading,
  iconTrailing,
  as: Component = "button",
  to,
  href,
  children,
  className = "",
  ...rest
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-sans font-medium transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
    md: "px-4.5 py-2 text-sm rounded-lg gap-2",
    lg: "px-6 py-2.5 text-base rounded-xl gap-2.5 font-semibold",
  }[size] || "px-4 py-2 text-sm rounded-lg gap-2";

  const variantClasses = {
    primary:
      "bg-primary-container text-white shadow-xs hover:bg-primary hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-primary/40 focus-visible:ring-offset-surface",
    secondary:
      "bg-secondary-fixed text-on-secondary-fixed shadow-xs hover:bg-secondary-container hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-secondary/40",
    outline:
      "border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary hover:bg-surface-container-low focus-visible:ring-primary/40",
    ghost:
      "text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus-visible:ring-primary/40",
    danger:
      "bg-error text-white shadow-xs hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-error/40",
  }[variant] || "";

  const widthClass = fullWidth ? "w-full" : "";

  // Render Icon helper
  const renderIcon = (icon) => {
    if (!icon) return null;
    if (typeof icon === "string") {
      return (
        <span className="material-symbols-outlined text-[18px] leading-none shrink-0" aria-hidden="true">
          {icon}
        </span>
      );
    }
    return icon;
  };

  const content = (
    <>
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        renderIcon(iconLeading)
      )}
      <span>{children}</span>
      {!loading && renderIcon(iconTrailing)}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Component
      type={Component === "button" ? rest.type || "button" : undefined}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      {...rest}
    >
      {content}
    </Component>
  );
};

export default Button;
