// VEYRA Seller Portal & Admin Dashboard Shell
// Aligned with Google Stitch: heritage_retail_merchant_workspaces & veyra_seller_merchant_dashboard_overview
import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const vendorMenus = [
  { section: "Operations" },
  { to: "/vendor", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/vendor/products", label: "Products", icon: "inventory_2" },
  { to: "/vendor/orders", label: "Orders", icon: "local_shipping", badge: "5 to ship" },
  { to: "/vendor/analytics", label: "Analytics", icon: "monitoring" },
  { section: "Store Settings" },
  { to: "/vendor/settings", label: "Store Settings", icon: "settings" },
];

const adminMenus = [
  { section: "Core Operations" },
  { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/admin/applications", label: "Seller Applications", icon: "assignment_ind", badge: "5 pending" },
  { to: "/admin/vendors", label: "Sellers", icon: "verified" },
  { section: "Commerce & Moderation" },
  { to: "/admin/products", label: "Product Moderation", icon: "gavel", badge: "14 flagged" },
  { to: "/admin/orders", label: "Orders & Payments", icon: "receipt_long" },
  { section: "System & Platform" },
  { to: "/admin/settings", label: "Platform Settings", icon: "settings" },
];

const DashboardLayout = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const menus = role === "admin" ? adminMenus : vendorMenus;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-surface font-sans">
      {/* ===== Desktop Sidebar ===== */}
      <aside className="w-64 bg-primary text-on-primary hidden md:flex flex-col justify-between shrink-0 shadow-lg border-r border-primary-container z-40 fixed top-0 bottom-0 left-0">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand & Wordmark */}
          <div className="p-5 flex items-center gap-3 border-b border-primary-container/60">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary font-serif-caslon font-bold text-lg flex items-center justify-center shadow-xs">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-serif-caslon font-bold text-lg tracking-wider text-surface-container-lowest leading-none">
                  VEYRA
                </span>
                <span className="text-[10px] font-semibold text-secondary-fixed uppercase tracking-widest mt-0.5">
                  {role === "admin" ? "Admin Panel" : "Seller Portal"}
                </span>
              </div>
            </Link>
          </div>

          {/* Active Store / Admin Identity Card */}
          <div className="p-4 pb-2">
            <div className="bg-primary-container/70 rounded-xl p-3 border border-white/5 flex items-center justify-between">
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans font-bold text-xs text-white truncate">
                    {role === "admin" ? "Admin" : (user?.storeName || "My Store")}
                  </span>
                  <span
                    className="material-symbols-outlined text-secondary-fixed text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <span className="text-[11px] text-on-primary-container truncate">
                  {role === "admin" ? "All Sellers" : "Verified Store"}
                </span>
              </div>
              {role === "vendor" && (
                <Link
                  to="/stores/66f44d5c9e2b1a3d4f8e9b01"
                  title="View Public Store"
                  className="p-1 rounded-lg hover:bg-primary text-secondary-fixed transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-3 py-2 flex-1">
            {menus.map((item, idx) => {
              if (item.section) {
                return (
                  <div key={idx} className="pt-3 pb-1 px-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-primary-container/70">
                      {item.section}
                    </span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary-container text-white shadow-xs border border-white/10"
                        : "text-on-primary-container hover:text-white hover:bg-primary-container/40"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] opacity-80">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-secondary text-white uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Status & Logout */}
        <div className="p-4 bg-primary-container/40 border-t border-primary-container/60 space-y-3">
          <div className="flex items-center gap-2 bg-tertiary-container/80 text-tertiary-fixed px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-tertiary-fixed-dim/20">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="uppercase tracking-wider text-[10px]">
              {role === "admin" ? "Admin Active" : "Verified Seller"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : (role === "admin" ? "A" : "S")}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{user?.name || (role === "admin" ? "Admin" : "Seller")}</span>
                <span className="text-[10px] text-on-primary-container truncate capitalize">
                  {role === "vendor" ? "Seller" : "Admin"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-on-primary-container hover:text-error transition-colors p-1 rounded-lg hover:bg-primary-container/60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Main Content Area ===== */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-container-high h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-2xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-primary hover:bg-surface-container transition-colors"
              aria-label="Open Navigation"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            {/* Quick Context / Search */}
            <div className="relative flex-1 hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder={role === "admin" ? "Search sellers, orders, applications..." : "Search products, order ID, customer names..."}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-container-low text-on-surface rounded-xl border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Store status badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed/30 text-on-surface text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span>Accepting Orders</span>
              <span className="text-outline">• Express Delivery</span>
            </div>

            {/* Quick action for vendor */}
            {role === "vendor" && (
              <Link
                to="/vendor/products/new"
                className="hidden sm:inline-flex items-center gap-1 bg-primary text-white hover:bg-primary-container px-3 py-1.5 rounded-xl font-sans text-xs font-bold transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Product</span>
              </Link>
            )}

            {/* Public Store shortcut */}
            {role === "vendor" && (
              <Link
                to="/stores/66f44d5c9e2b1a3d4f8e9b01"
                className="inline-flex items-center gap-1 bg-surface-container-low hover:bg-surface-container text-primary px-3 py-1.5 rounded-xl text-xs font-semibold border border-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">storefront</span>
                <span className="hidden sm:inline">Store</span>
                <span className="material-symbols-outlined text-[12px]">north_east</span>
              </Link>
            )}

            {/* User Profile Monogram */}
            <div className="w-8 h-8 rounded-full bg-primary-container text-white font-bold flex items-center justify-center text-xs shadow-xs border border-white/20 select-none">
              {user?.name?.[0]?.toUpperCase() || (role === "admin" ? "A" : "S")}
            </div>
          </div>
        </header>

        {/* Main Content Router Outlet */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>

      {/* ===== Mobile Off-Canvas Drawer ===== */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-64 max-w-[80%] bg-primary text-on-primary flex flex-col justify-between h-full shadow-2xl z-10">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="p-4 flex items-center justify-between border-b border-primary-container/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-surface-container-lowest text-primary font-serif-caslon font-bold flex items-center justify-center">
                    V
                  </div>
                  <span className="font-serif-caslon font-bold text-white tracking-wider">
                    VEYRA {role === "admin" ? "Admin" : "Seller"}
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-on-primary-container hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-3 flex-1">
                {menus.map((item, idx) => {
                  if (item.section) {
                    return (
                      <div key={idx} className="pt-3 pb-1 px-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-primary-container/70">
                          {item.section}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? "bg-primary-container text-white shadow-xs"
                            : "text-on-primary-container hover:text-white hover:bg-primary-container/40"
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-secondary text-white">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}

                <div className="pt-4 border-t border-primary-container/60 mt-2">
                  <Link
                    to="/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-on-primary-container hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">home</span>
                    <span>Marketplace Home</span>
                  </Link>
                </div>
              </nav>
            </div>

            <div className="p-4 bg-primary-container/50 border-t border-primary-container/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                  {user?.name?.[0]?.toUpperCase() || (role === "admin" ? "A" : "S")}
                </div>
                <span className="text-xs font-bold text-white truncate max-w-[120px]">
                  {user?.name || (role === "admin" ? "Admin" : "Seller")}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-on-primary-container hover:text-error text-xs font-semibold flex items-center gap-1"
              >
                <span>Logout</span>
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;