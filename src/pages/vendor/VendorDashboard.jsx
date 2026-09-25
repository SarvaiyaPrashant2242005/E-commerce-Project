// VEYRA Seller Dashboard Overview
// Aligned with Google Stitch: veyra_seller_merchant_dashboard_overview
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { vendorApi } from "../../api/vendor.api";

const VendorDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQueueTab, setActiveQueueTab] = useState("all");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metricData, orderData] = await Promise.all([
          vendorApi.getMetrics(),
          vendorApi.getOrders(),
        ]);
        setMetrics(metricData);
        setOrders(orderData);
      } catch (err) {
        setError(err.message || "Failed to load seller dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-surface-container rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-surface-container rounded-2xl" />
          ))}
        </div>
        <div className="h-72 bg-surface-container rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-error-container/20 border border-error/30 text-center max-w-lg mx-auto">
        <span className="material-symbols-outlined text-4xl text-error mb-2">warning</span>
        <h3 className="font-serif-caslon font-bold text-lg text-on-surface">Store Service Notice</h3>
        <p className="text-xs text-outline mt-1 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (activeQueueTab === "pending") return o.status === "confirmed" || o.status === "pending";
    if (activeQueueTab === "processing") return o.status === "processing";
    if (activeQueueTab === "dispatched") return o.status === "dispatched";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ===== TOP CONTEXT BAR & STORE HEALTH ===== */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container-high shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif-caslon font-bold text-xl sm:text-2xl text-primary tracking-tight">
              My Store
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              Store Active
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-xs text-on-surface-variant font-medium">
              Store ID #KVR-8821
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-on-surface-variant text-xs">
            <p>Welcome back, <span className="font-bold text-on-surface">Seller</span>. Ready for order shipments.</p>
            <span className="hidden sm:inline text-outline-variant">|</span>
            <div className="flex items-center gap-1.5 text-secondary font-semibold">
              <span className="material-symbols-outlined text-[15px]">account_balance_wallet</span>
              <span>Next Payout: <strong className="text-on-surface">₹48,250</strong> (Scheduled Tomorrow, 10:00 AM)</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 bg-surface-container-low px-3 py-2 rounded-xl text-xs font-semibold text-on-surface border border-surface-container">
            <span className="material-symbols-outlined text-[16px] text-outline">calendar_month</span>
            <span>Current Sales Period</span>
            <span className="text-tertiary font-bold ml-1">+{metrics?.growthRate || 18.4}%</span>
          </div>

          <Link
            to="/stores/66f44d5c9e2b1a3d4f8e9b01"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface border border-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">storefront</span>
            <span>View Store ↗</span>
          </Link>

          <Link
            to="/vendor/products/new"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>Add Product</span>
          </Link>
        </div>
      </section>

      {/* ===== 4 KEY OPERATIONAL METRICS ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Gross Sales */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                Total Gross Sales
              </span>
              <span className="font-serif-caslon font-bold text-2xl text-primary tracking-tight mt-1 block">
                ₹{metrics?.grossMerchandiseVolume?.toLocaleString("en-IN") || "1,42,890"}
              </span>
            </div>
            <span className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1 text-tertiary text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                <span>+{metrics?.growthRate || 18.4}%</span>
                <span className="text-outline font-normal text-[11px]">vs prior cycle</span>
              </div>
              <span className="text-[10px] text-outline">Simulated payment records</span>
            </div>
            {/* Sparkline SVG */}
            <svg className="w-16 h-6 text-tertiary" fill="none" viewBox="0 0 80 28">
              <path d="M1 22L12 18L24 23L36 14L48 16L60 7L79 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M1 22L12 18L24 23L36 14L48 16L60 7L79 2V28H1V22Z" fill="currentColor" fillOpacity="0.12" />
            </svg>
          </div>
        </div>

        {/* Metric 2: Orders Placed & AOV */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                Orders Placed
              </span>
              <span className="font-serif-caslon font-bold text-2xl text-primary tracking-tight mt-1 block">
                {metrics?.totalOrders || 38} Orders
              </span>
            </div>
            <span className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-outline block">Avg Order Value</span>
              <span className="font-bold text-on-surface">₹{metrics?.averageOrderValue?.toLocaleString("en-IN") || "3,760"}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-outline block">Customer Conversion</span>
              <span className="font-bold text-on-surface">{metrics?.conversionRate || 4.82}%</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Catalog & Inventory */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                Active Catalog
              </span>
              <span className="font-serif-caslon font-bold text-2xl text-primary tracking-tight mt-1 block">
                {metrics?.activeCatalogCount || 8} Products
              </span>
            </div>
            <span className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-medium text-on-surface">{metrics?.kilnLoomCount || 3} in production</span>
            </div>
            <span className="text-outline text-[11px]">{metrics?.draftListingCount || 2} draft products</span>
          </div>
        </div>

        {/* Metric 4: Pending Fulfillment (Urgent Accent) */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-secondary/40 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-secondary" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                Action Needed
              </span>
              <span className="font-serif-caslon font-bold text-2xl text-primary tracking-tight mt-1 block">
                {metrics?.pendingFulfillmentCount || 5} to Ship
              </span>
            </div>
            <span className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-fixed/50 text-on-secondary-container text-[11px] font-bold w-fit">
              <span className="material-symbols-outlined text-[13px]">timer</span>
              <span>{metrics?.urgentDispatchCount || 2} orders require shipping today</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMMEDIATE FULFILLMENT QUEUE TABLE ===== */}
      <section className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs overflow-hidden">
        {/* Table Header & Status Pills */}
        <div className="p-5 border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-primary-container rounded-full" />
              <h2 className="font-serif-caslon font-bold text-lg text-primary">
                Orders Requiring Fulfillment
              </h2>
            </div>
            <p className="text-xs text-outline mt-0.5">
              Review orders awaiting processing and shipment.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Orders" },
              { id: "pending", label: "Pending" },
              { id: "processing", label: "Processing" },
              { id: "dispatched", label: "Shipped" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveQueueTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeQueueTab === tab.id
                    ? "bg-primary-container text-white shadow-xs"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-outline uppercase font-semibold text-[10px] tracking-wider border-b border-surface-container">
              <tr>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Delivery Address</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Order Subtotal</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Shipment Status</th>
                <th className="py-3 px-4 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-3xl mb-1 block">inventory_2</span>
                    <span>No orders pending in this queue segment.</span>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPending = order.status === "confirmed" || order.status === "pending";
                  const isProcessing = order.status === "processing";
                  const isDispatched = order.status === "dispatched";

                  return (
                    <tr key={order._id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-on-surface">{order.customer?.name || "Customer"}</p>
                        <p className="text-[11px] text-outline">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-7 h-7 rounded object-cover border border-surface-container shrink-0"
                                />
                              )}
                              <span className="truncate text-on-surface">
                                {item.title || item.name} × {item.quantity || 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-on-surface">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-semibold">
                          <span className="material-symbols-outlined text-[13px]">lock</span>
                          <span>Payment Hold</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isDispatched
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : isProcessing
                              ? "bg-secondary-fixed text-on-secondary-fixed"
                              : "bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{order.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to="/vendor/orders"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-white text-primary text-[11px] font-semibold transition-colors"
                        >
                          <span>Process</span>
                          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== STOCK HEALTH & PROVENANCE NOTICE ===== */}
      <section className="bg-surface-container-low rounded-2xl p-5 border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-tertiary text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface">Payment Protection Active</h4>
            <p className="text-outline text-[11px] mt-0.5">
              Customer payments are held securely and released upon delivery confirmation.
            </p>
          </div>
        </div>

        <Link
          to="/vendor/products"
          className="text-secondary font-bold hover:underline shrink-0"
        >
          View Inventory ({metrics?.activeCatalogCount || 8} Products) →
        </Link>
      </section>
    </div>
  );
};

export default VendorDashboard;