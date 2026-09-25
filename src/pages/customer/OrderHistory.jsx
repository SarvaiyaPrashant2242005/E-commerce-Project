// VEYRA Order History & Live Tracking
// Aligned with Google Stitch: veyra_order_history_tracking
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'active', 'delivered'
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Unable to retrieve order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items?.some((i) => i.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        o.items?.some((i) => i.storeName?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && o.status !== "delivered") ||
        (activeTab === "delivered" && o.status === "delivered");

      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      {/* Header & Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-outline mb-4">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
        <Link to="/account" className="hover:text-primary transition-colors">
          Account
        </Link>
        <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
        <span className="text-on-surface font-semibold">My Orders</span>
      </nav>

      <div>
        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
          Order History
        </span>
        <h1 className="font-serif-caslon font-bold text-3xl sm:text-4xl text-primary-container mt-1">
          My Orders &amp; Tracking
        </h1>
        <p className="font-sans text-xs sm:text-sm text-outline mt-1.5">
          Track your orders from dispatch to doorstep delivery.
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="mt-8 space-y-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID (e.g. VYR-884219), store name, or product title..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-surface-container rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 px-4 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "text-outline hover:text-on-surface"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 px-4 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-primary text-white shadow-xs"
                : "text-outline hover:text-on-surface"
            }`}
          >
            In Transit ({orders.filter((o) => o.status !== "delivered").length})
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            className={`flex-1 py-2 px-4 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "delivered"
                ? "bg-primary text-white shadow-xs"
                : "text-outline hover:text-on-surface"
            }`}
          >
            Delivered ({orders.filter((o) => o.status === "delivered").length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-surface-container-low rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-error/30 text-center">
            <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
            <p className="text-xs text-error font-medium">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-surface-container">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">receipt_long</span>
            <h3 className="font-serif-caslon font-bold text-lg text-primary-container">
              No Orders Found
            </h3>
            <p className="text-xs text-outline mt-1">
              You have not placed any orders matching this filter.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <article
              key={order._id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container-high overflow-hidden shadow-xs space-y-4"
            >
              {/* Order Header Bar */}
              <div className="p-5 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-container">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif-caslon font-bold text-base text-primary-container">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-sans text-[11px] font-semibold uppercase tracking-wider ${
                        order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-secondary-fixed text-on-secondary-fixed"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      <span>{order.status}</span>
                    </span>
                  </div>
                  <p className="font-sans text-xs text-outline mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="font-sans font-extrabold text-base sm:text-lg text-primary block">
                    ₹{Number(order.pricing?.total || 18500).toLocaleString("en-IN")}
                  </span>
                  <span className="font-sans text-[11px] text-outline">
                    {order.paymentMethod || "Simulated Payment"}
                  </span>
                </div>
              </div>

              {/* Items in this Order */}
              <div className="p-5 divide-y divide-surface-container">
                {order.items?.map((item) => (
                  <div key={item.productId} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                    <img
                      src={item.image || "https://placehold.co/100x120/eaefed/173b35?text=VEYRA"}
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded-xl bg-surface-container shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-serif-caslon font-bold text-sm sm:text-base text-primary-container hover:text-secondary transition-colors truncate block"
                      >
                        {item.title}
                      </Link>
                      <p className="font-sans text-xs text-secondary font-medium mt-0.5">
                        {item.storeName}
                      </p>
                      <p className="font-sans text-[11px] text-outline mt-1">
                        Quantity: {item.quantity} • Price: ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Tracking Journey Drawer */}
              {order.tracking && (
                <div className="mx-5 mb-5 p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-base">
                        local_shipping
                      </span>
                      <span className="font-semibold text-primary">
                        {order.tracking.carrier} • Tracking #{order.tracking.trackingNumber}
                      </span>
                    </div>
                    <span className="text-outline">
                      Estimated: {new Date(order.tracking.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  </div>

                  {/* Stage Steps */}
                  <div className="space-y-3 pl-4 border-l-2 border-primary/30 relative">
                    {order.tracking.stages?.map((stage, sIdx) => (
                      <div key={stage.label} className="relative pl-3">
                        <div
                          className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full ${
                            stage.completed ? "bg-primary" : "bg-outline-variant"
                          }`}
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${stage.completed ? "text-primary" : "text-outline"}`}>
                            {stage.label}
                          </span>
                          <span className="text-[11px] text-outline">{stage.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
