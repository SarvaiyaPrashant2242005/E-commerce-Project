import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * MobileTabBar — Fixed Bottom Navigation Bar for Mobile Viewports
 *
 * Implements the bottom navigation bar specified in Google Stitch veyra_marketplace_home:
 * - Home (storefront)
 * - Categories (grid_view)
 * - Stores (domain)
 * - Wishlist (favorite_border)
 * - Account (person_outline)
 */
export const MobileTabBar = () => {
  const { user } = useSelector((s) => s.auth);

  const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center w-14 h-14 transition-colors select-none ${
      isActive
        ? "text-primary-container font-semibold"
        : "text-on-surface-variant hover:text-primary-container"
    }`;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex justify-around items-center h-16 px-2">
        <NavLink to="/" className={navClass} end>
          <span className="material-symbols-outlined text-[22px]">storefront</span>
          <span className="text-[10px] font-sans mt-0.5">Home</span>
        </NavLink>

        <NavLink to="/products" className={navClass}>
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="text-[10px] font-sans mt-0.5">Products</span>
        </NavLink>

        <NavLink to="/stores" className={navClass}>
          <span className="material-symbols-outlined text-[22px]">domain</span>
          <span className="text-[10px] font-sans mt-0.5">Stores</span>
        </NavLink>

        <NavLink to="/cart" className={navClass}>
          <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
          <span className="text-[10px] font-sans mt-0.5">Cart</span>
        </NavLink>

        <NavLink
          to={user ? (user.role === "vendor" ? "/vendor" : user.role === "admin" ? "/admin" : "/account") : "/login"}
          className={navClass}
        >
          <span className="material-symbols-outlined text-[22px]">person_outline</span>
          <span className="text-[10px] font-sans mt-0.5">
            {user ? "Account" : "Sign In"}
          </span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileTabBar;
