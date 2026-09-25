// VEYRA Customer Account Overview
// Aligned with Google Stitch: veyra_account_overview
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { ordersApi, authApi } from "../../api";

const AccountOverview = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ordersApi.getOrders().catch(() => []),
      authApi.getAddresses().catch(() => []),
    ]).then(([ordersData, addrsData]) => {
      setOrders(ordersData);
      setAddresses(addrsData);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const activeOrder = orders.find((o) => o.status !== "delivered") || orders[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      {/* Profile Banner Card */}
      <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-surface-container relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Monogram Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-container text-white flex items-center justify-center font-serif-caslon font-bold text-2xl shadow-md border-2 border-surface-container-lowest">
                {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
              </div>
              <span
                className="absolute -bottom-1 -right-1 bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-xs text-xs"
                title="Verified Customer"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </span>
            </div>

            {/* Member Details */}
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif-caslon font-bold text-2xl text-primary-container">
                  {user?.name || "Demo Customer"}
                </h1>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-sans text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span>Customer</span>
                </span>
              </div>
              <p className="font-sans text-xs text-outline mt-1">
                Verified Member • Member since 2026
              </p>
              <p className="font-sans text-xs text-on-surface-variant mt-1 flex items-center justify-center sm:justify-start gap-1">
                <span className="material-symbols-outlined text-xs">mail</span>
                <span>{user?.email || "customer@veyra.com"}</span>
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-outline hover:text-error hover:border-error transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* Quick Stats Bento */}
      <section className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link
          to="/account/orders"
          className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high text-center shadow-2xs hover:shadow-xs transition-all"
        >
          <span className="font-sans font-extrabold text-xl text-primary block">{orders.length}</span>
          <span className="font-sans text-xs text-outline mt-0.5 block">Orders</span>
        </Link>
        <Link
          to="/account/addresses"
          className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high text-center shadow-2xs hover:shadow-xs transition-all"
        >
          <span className="font-sans font-extrabold text-xl text-primary block">{addresses.length || 2}</span>
          <span className="font-sans text-xs text-outline mt-0.5 block">Saved Addresses</span>
        </Link>
        <Link
          to="/stores"
          className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high text-center shadow-2xs hover:shadow-xs transition-all"
        >
          <span className="font-sans font-extrabold text-xl text-primary block">4</span>
          <span className="font-sans text-xs text-outline mt-0.5 block">Stores</span>
        </Link>
        <div className="bg-secondary-fixed/20 p-4 rounded-xl border border-secondary/20 text-center shadow-2xs">
          <span className="font-sans font-extrabold text-xl text-secondary block">₹850</span>
          <span className="font-sans text-xs text-secondary font-semibold mt-0.5 block">Store Credits</span>
        </div>
      </section>

      {/* Active Order Highlight */}
      {activeOrder && (
        <section className="mt-8 bg-surface-container-lowest rounded-2xl border border-surface-container-high p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">local_shipping</span>
              <h2 className="font-serif-caslon font-bold text-lg text-primary-container">
                Active Order
              </h2>
            </div>
            <Link to="/account/orders" className="text-xs font-semibold text-secondary hover:underline">
              View Order History →
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-xl">
            <div className="flex items-center gap-3.5">
              <img
                src={activeOrder.items?.[0]?.image || "https://placehold.co/100x120/eaefed/173b35?text=VEYRA"}
                alt={activeOrder.items?.[0]?.title}
                className="w-14 h-16 object-cover rounded-lg bg-surface-container shrink-0"
              />
              <div>
                <span className="text-[11px] font-semibold text-outline block">
                  Order {activeOrder.orderNumber} • {activeOrder.items?.[0]?.storeName}
                </span>
                <h3 className="font-serif-caslon font-bold text-sm text-primary-container line-clamp-1">
                  {activeOrder.items?.[0]?.title}
                </h3>
                <span className="text-xs font-bold text-primary">
                  ₹{Number(activeOrder.pricing?.total || 18500).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold uppercase tracking-wider">
              {activeOrder.status}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-outline px-2">
              <span className="font-semibold text-primary">Order Placed</span>
              <span className="font-semibold text-primary">Inspected &amp; Packed</span>
              <span className="font-semibold text-primary">In Transit</span>
              <span>Delivered</span>
            </div>
          </div>
        </section>
      )}

      {/* Account Navigation Hub Links */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/account/orders"
          className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs hover:border-primary transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">receipt_long</span>
          </div>
          <div>
            <h3 className="font-serif-caslon font-bold text-sm text-primary-container">
              My Orders
            </h3>
            <p className="text-[11px] text-outline mt-0.5">Track shipments and receipts</p>
          </div>
        </Link>

        <Link
          to="/account/addresses"
          className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs hover:border-primary transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">location_on</span>
          </div>
          <div>
            <h3 className="font-serif-caslon font-bold text-sm text-primary-container">
              Saved Addresses
            </h3>
            <p className="text-[11px] text-outline mt-0.5">Delivery addresses</p>
          </div>
        </Link>

        <Link
          to="/stores"
          className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs hover:border-primary transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">storefront</span>
          </div>
          <div>
            <h3 className="font-serif-caslon font-bold text-sm text-primary-container">
              Stores
            </h3>
            <p className="text-[11px] text-outline mt-0.5">Explore followed stores</p>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default AccountOverview;
