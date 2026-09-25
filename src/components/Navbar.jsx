import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { BrandLogo } from "./common/BrandLogo";

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((a, i) => a + (i.quantity || 1), 0)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pincode, setPincode] = useState("Mumbai 400001");
  const [pincodeOpen, setPincodeOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-colors ${
      isActive
        ? "text-primary-container bg-surface-container font-semibold"
        : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md border-b border-surface-container-high transition-all">
      {/* ===== TIER 1: Upper Express Delivery & Location Bar ===== */}
      <div className="h-8 bg-primary-container text-on-primary text-xs font-sans px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="material-symbols-outlined text-[15px] text-secondary-container">
            local_shipping
          </span>
          <span className="truncate">
            Free express delivery on orders over ₹1,499
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setPincodeOpen(!pincodeOpen)}
            className="flex items-center gap-1 text-secondary-container hover:text-white transition-colors cursor-pointer select-none font-medium"
            aria-label="Select delivery pincode"
          >
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span className="whitespace-nowrap">{pincode}</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {pincodeOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest rounded-lg shadow-lg border border-surface-container-high p-2 z-50 text-on-surface">
              <p className="text-[11px] font-semibold text-outline uppercase px-2 py-1">
                Select Destination
              </p>
              {["Mumbai 400001", "Bengaluru 560001", "New Delhi 110001", "Jaipur 302001"].map(
                (pin) => (
                  <button
                    key={pin}
                    onClick={() => {
                      setPincode(pin);
                      setPincodeOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-surface-container flex items-center justify-between ${
                      pincode === pin ? "font-semibold text-primary" : "text-on-surface"
                    }`}
                  >
                    <span>{pin}</span>
                    {pincode === pin && (
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        check
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== TIER 2: Main Marketplace Navigation ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 md:h-20 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <BrandLogo variant="full" size="md" />
        </div>

        {/* Center Desktop Navigation & Search */}
        <div className="hidden md:flex items-center gap-6 flex-1 max-w-xl mx-4">
          {/* Global Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative flex items-center bg-surface-container-low border border-surface-container-high rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-150">
              <span className="material-symbols-outlined text-[18px] text-outline ml-3 pointer-events-none">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products across verified stores..."
                className="w-full h-10 pl-2 pr-10 text-xs font-sans text-on-surface bg-transparent placeholder:text-outline outline-none"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-2.5 text-outline hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </form>

          {/* Core Route Links */}
          <nav className="flex items-center gap-1 shrink-0">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/products" className={linkClass}>Products</NavLink>
            <NavLink to="/stores" className={linkClass}>Stores</NavLink>
          </nav>
        </div>

        {/* Right Actions: Wishlist, Cart, User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Wishlist Link */}
          <Link
            to="/products"
            aria-label="Wishlist"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
            title="Wishlist"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-white font-sans text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
              3
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative w-10 h-10 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-center text-primary-container hover:bg-surface-container hover:border-primary/40 transition-all"
            title="Cart"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-container text-white font-sans text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Auth Actions */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-surface-container-high">
              {user.role !== "customer" && (
                <Link
                  to={user.role === "vendor" ? "/vendor" : "/admin"}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-primary-container text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {user.role === "vendor" ? "storefront" : "admin_panel_settings"}
                  </span>
                  <span>{user.role === "vendor" ? "Seller Portal" : "Admin Panel"}</span>
                </Link>
              )}

              <Link
                to="/account"
                className="w-9 h-9 rounded-full bg-primary-container text-white font-bold flex items-center justify-center text-sm shadow-xs border border-white/20 select-none hover:ring-2 hover:ring-secondary transition-all cursor-pointer"
                title={user.name ? `${user.name} - My Account` : "My Account"}
              >
                {user.name?.[0]?.toUpperCase() || "C"}
              </Link>

              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
                className="text-xs font-medium text-outline hover:text-error transition-colors px-1 cursor-pointer"
                title="Sign out of VEYRA"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary-container text-white hover:bg-primary transition-all shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Dropdown when Hamburger Toggled */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-container bg-surface-container-lowest px-4 py-4 space-y-3 animate-fade-up">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or stores..."
              className="w-full h-10 pl-3 pr-9 text-sm bg-surface-container-low border border-surface-container-high rounded-lg outline-none"
            />
            <button type="submit" className="absolute right-2.5 top-2.5 text-outline">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
          </form>

          <nav className="flex flex-col gap-1 pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-primary hover:bg-surface-container"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-primary hover:bg-surface-container"
            >
              Products
            </Link>
            <Link
              to="/stores"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-primary hover:bg-surface-container"
            >
              Stores
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-primary hover:bg-surface-container flex items-center justify-between"
            >
              <span>Cart</span>
              <span className="px-2 py-0.5 text-xs bg-primary-container text-white rounded-full">
                {cartCount}
              </span>
            </Link>
            <Link
              to={user ? "/account" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-secondary hover:bg-surface-container flex items-center gap-2 border-t border-surface-container mt-1 pt-2"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>{user ? "My Account" : "Sign In to Account"}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;