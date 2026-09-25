import React from "react";

/**
 * StatusBadge — Standardized Status & Moderation Pills
 *
 * Implements the color system and badge hierarchy defined in Stitch designs:
 * - verified, pending, flagged, escrow, active, dispatched, delivered, out-of-stock
 *
 * @param {Object} props
 * @param {"verified" | "pending" | "flagged" | "error" | "escrow" | "active" | "live" | "shipped" | "delivered" | "low-stock" | "out-of-stock" | "neutral"} [props.status="neutral"]
 * @param {string | React.ReactNode} [props.icon]
 * @param {boolean} [props.dot=false]
 * @param {"sm" | "md"} [props.size="md"]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const StatusBadge = ({
  status = "neutral",
  icon,
  dot = false,
  size = "md",
  children,
  className = "",
}) => {
  const normalized = (status || "neutral").toLowerCase();

  const configMap = {
    verified: {
      classes: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      dotColor: "bg-emerald-600",
      defaultIcon: "verified",
      defaultLabel: "Verified",
    },
    active: {
      classes: "bg-primary-container text-on-primary border-primary",
      dotColor: "bg-primary-fixed",
      defaultIcon: "check_circle",
      defaultLabel: "Active",
    },
    live: {
      classes: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      dotColor: "bg-emerald-600",
      defaultIcon: "store",
      defaultLabel: "Live",
    },
    pending: {
      classes: "bg-secondary-fixed/50 text-on-secondary-fixed-variant border-secondary-fixed",
      dotColor: "bg-amber-500",
      defaultIcon: "schedule",
      defaultLabel: "Pending Review",
    },
    flagged: {
      classes: "bg-error-container/40 text-on-error-container border-error-container",
      dotColor: "bg-error",
      defaultIcon: "flag",
      defaultLabel: "Flagged",
    },
    error: {
      classes: "bg-error-container/40 text-on-error-container border-error-container",
      dotColor: "bg-error",
      defaultIcon: "error",
      defaultLabel: "Failed",
    },
    escrow: {
      classes: "bg-secondary-fixed text-on-secondary-fixed border-secondary-container/60",
      dotColor: "bg-secondary",
      defaultIcon: "lock_clock",
      defaultLabel: "In Escrow",
    },
    shipped: {
      classes: "bg-surface-container-high text-primary border-outline-variant/60",
      dotColor: "bg-primary",
      defaultIcon: "local_shipping",
      defaultLabel: "Shipped",
    },
    delivered: {
      classes: "bg-emerald-100 text-emerald-900 border-emerald-300",
      dotColor: "bg-emerald-700",
      defaultIcon: "task_alt",
      defaultLabel: "Delivered",
    },
    "low-stock": {
      classes: "bg-amber-50 text-amber-900 border-amber-200",
      dotColor: "bg-amber-600",
      defaultIcon: "warning",
      defaultLabel: "Low Stock",
    },
    "out-of-stock": {
      classes: "bg-surface-container-low text-outline border-outline-variant/50",
      dotColor: "bg-outline",
      defaultIcon: "block",
      defaultLabel: "Out of Stock",
    },
    neutral: {
      classes: "bg-surface-container text-on-surface-variant border-outline-variant/40",
      dotColor: "bg-outline",
      defaultIcon: null,
      defaultLabel: "Standard",
    },
  };

  const current = configMap[normalized] || configMap.neutral;
  const label = children || current.defaultLabel;

  const sizeClasses = {
    sm: "text-[11px] py-0.5 px-2 gap-1 font-semibold",
    md: "text-xs py-1 px-2.5 gap-1.5 font-semibold",
  }[size] || "text-xs py-1 px-2.5 gap-1.5 font-semibold";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-sans select-none leading-none tracking-wide ${current.classes} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dotColor}`}
          aria-hidden="true"
        />
      )}

      {icon ? (
        typeof icon === "string" ? (
          <span className="material-symbols-outlined text-[13px] leading-none shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : (
          icon
        )
      ) : current.defaultIcon && !dot ? (
        <span className="material-symbols-outlined text-[13px] leading-none shrink-0" aria-hidden="true">
          {current.defaultIcon}
        </span>
      ) : null}

      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
