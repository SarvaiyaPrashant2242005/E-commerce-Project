import React from "react";
import { Link } from "react-router-dom";

/**
 * Card — Flexible Surface Container for VEYRA Architecture
 *
 * @param {Object} props
 * @param {"lowest" | "low" | "flat" | "raised"} [props.elevation="lowest"]
 * @param {boolean} [props.hoverable=false]
 * @param {boolean} [props.padded=true]
 * @param {string} [props.to] If provided, renders as router Link
 * @param {string} [props.href] If provided, renders as external link
 * @param {React.ReactNode} [props.header] Optional card header
 * @param {React.ReactNode} [props.footer] Optional card footer
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export const Card = ({
  elevation = "lowest",
  hoverable = false,
  padded = true,
  to,
  href,
  header,
  footer,
  children,
  className = "",
  ...rest
}) => {
  const elevationClasses = {
    lowest: "bg-surface-container-lowest border border-surface-container-high shadow-xs",
    low: "bg-surface-container-low border border-surface-container",
    flat: "bg-surface-container-lowest border border-outline-variant/30",
    raised: "bg-surface-container-lowest border border-surface-container-high shadow-sm",
  }[elevation] || "bg-surface-container-lowest border border-surface-container-high";

  const hoverClass = hoverable
    ? "hover:shadow-md hover:border-outline-variant/70 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    : "transition-all duration-150";

  const baseClasses = `rounded-xl overflow-hidden ${elevationClasses} ${hoverClass} ${className}`;

  const content = (
    <>
      {header && (
        <div className="px-5 py-3.5 border-b border-surface-container bg-surface-container-low/60 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-surface-container bg-surface-container-low/40 flex items-center justify-between">
          {footer}
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`block ${baseClasses}`} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`block ${baseClasses}`} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <div className={baseClasses} {...rest}>
      {content}
    </div>
  );
};

export default Card;
