import React from "react";
import { Link } from "react-router-dom";

/**
 * BrandLogo — Official VEYRA Monogram & Wordmark
 *
 * Implements the vector geometry defined in Google Stitch veyra_brand_logo:
 * - Architectural arch & intertwined V lettermark in Deep Spruce (#173B35) & Warm Gold (#C99B56)
 * - Refined typographic wordmark VEYRA and subtext INDEPENDENT MARKETPLACE
 *
 * @param {Object} props
 * @param {"full" | "monogram" | "compact"} [props.variant="full"]
 * @param {"dark" | "light" | "auto"} [props.theme="auto"]
 * @param {"sm" | "md" | "lg"} [props.size="md"]
 * @param {string} [props.linkTo="/"] Set to null/false for static rendering
 * @param {string} [props.className]
 */
export const BrandLogo = ({
  variant = "full",
  theme = "auto",
  size = "md",
  linkTo = "/",
  className = "",
}) => {
  // Size dimensions for monogram
  const dimensions = {
    sm: { icon: 32, text: "text-lg", subtext: "text-[7.5px]" },
    md: { icon: 40, text: "text-xl", subtext: "text-[9px]" },
    lg: { icon: 52, text: "text-2xl", subtext: "text-[10px]" },
  }[size] || { icon: 40, text: "text-xl", subtext: "text-[9px]" };

  const isLight = theme === "light";

  const Monogram = (
    <svg
      viewBox="0 0 48 48"
      width={dimensions.icon}
      height={dimensions.icon}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform group-hover:scale-105 duration-200"
      aria-label="VEYRA Monogram"
    >
      {/* Container Tile */}
      <rect
        width="48"
        height="48"
        rx="10"
        fill={isLight ? "#ffffff" : "#173B35"}
        className="shadow-xs"
      />
      {/* Stylized Architectural Canopy/Arch */}
      <path
        d="M12 36 V24 C12 17.37 17.37 12 24 12 C30.63 12 36 17.37 36 24 V36"
        stroke="#C99B56"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Intertwined V Lettermark */}
      <path
        d="M15 18 L24 34 L33 18"
        stroke={isLight ? "#173B35" : "#F6F3ED"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Merchant Canopy Emblem Accent Dot */}
      <circle cx="24" cy="18" r="2.2" fill="#C99B56" />
    </svg>
  );

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {Monogram}

      {variant !== "monogram" && (
        <div className="flex flex-col text-left leading-none">
          <span
            className={`font-serif-caslon font-bold tracking-wider ${dimensions.text} ${
              isLight ? "text-white" : "text-primary-container"
            }`}
          >
            VEYRA
          </span>
          {variant === "full" && (
            <span
              className={`font-sans uppercase font-semibold tracking-widest mt-0.5 ${dimensions.subtext} ${
                isLight ? "text-white/70" : "text-outline"
              }`}
            >
              Independent Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
