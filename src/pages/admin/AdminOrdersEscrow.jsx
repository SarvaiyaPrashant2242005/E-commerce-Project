import React, { useState, useEffect } from "react";
import adminApi from "../../api/admin.api";

export default function AdminOrdersEscrow() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    grossVolume: "3,412 Orders",
    grossGmv: "₹1.48 Cr GMV",
    escrowPool: "₹24,80,450",
    escrowBank: "Axis Nodal #0912",
    multiVendorRate: "44.2%",
    multiVendorCount: "1,508",
    activeDisputes: 3,
    disputeAmount: "₹12,480",
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [dispatchFilter, setDispatchFilter] = useState("all");
  const [railFilter, setRailFilter] = useState("all");
  const [escrowFilter, setEscrowFilter] = useState("all");

  // Selection & Accordion
  const [selectedOrderId, setSelectedOrderId] = useState("VY-90482");
  const [expandedOrders, setExpandedOrders] = useState({
    "VY-90482": true,
    "VY-90479": false,
    "VY-90461": false,
    "VY-90432": true,
  });

  // Feedback Toast
  const [toast, setToast] = useState(null);

  // Override Modal / Dialog
  const [overrideModal, setOverrideModal] = useState(null); // { type: 'force_release' | 'freeze' | 'refund', order: Object }
  const [overrideJustification, setOverrideJustification] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrdersAndEscrow();
      if (Array.isArray(res) && res.length > 0) {
        setOrders(res);
        if (!selectedOrderId) setSelectedOrderId(res[0].id);
      } else if (res && res.orders) {
        setOrders(res.orders);
        if (res.metrics) setMetrics(res.metrics);
        if (res.orders.length > 0 && !selectedOrderId) setSelectedOrderId(res.orders[0].id);
      } else {
        setOrders(defaultOrders);
      }
    } catch (err) {
      console.error("Failed to load orders & escrow data:", err);
      setOrders(defaultOrders);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0] || defaultOrders[0];

  const handleOpenOverride = (type) => {
    setOverrideModal({ type, order: selectedOrder });
    setOverrideJustification("");
  };

  const handleExecuteOverride = async () => {
    if (!overrideJustification.trim()) {
      showToast("Mandatory supervisory justification required.", "error");
      return;
    }

    try {
      setProcessingAction(true);
      const statusMap = {
        force_release: "released",
        freeze: "held_dispute",
        refund: "refunded",
      };
      const newStatus = statusMap[overrideModal.type];

      await adminApi.updateEscrowStatus(
        selectedOrder.id,
        newStatus,
        overrideJustification
      );

      // Update local orders
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                escrowStatus: newStatus,
                statusText:
                  newStatus === "released"
                    ? "Released to Seller"
                    : newStatus === "held_dispute"
                    ? "Frozen on Dispute"
                    : "Refunded to Customer",
              }
            : o
        )
      );

      showToast(
        overrideModal.type === "force_release"
          ? `Payment for #${selectedOrder.id} released to seller accounts.`
          : overrideModal.type === "freeze"
          ? `Payment for #${selectedOrder.id} held in dispute reserve.`
          : `Partial/Full refund of ${selectedOrder.totalAmount} issued to ${selectedOrder.customerName}.`
      );
      setOverrideModal(null);
    } catch (err) {
      showToast(err.message || "Action failed.", "error");
    } finally {
      setProcessingAction(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchCon = o.consignments?.some(
        (c) =>
          c.storeName.toLowerCase().includes(q) ||
          c.itemSummary.toLowerCase().includes(q) ||
          c.awb?.toLowerCase().includes(q)
      );
      if (!matchId && !matchCustomer && !matchCon) return false;
    }
    if (dispatchFilter !== "all") {
      if (o.dispatchStatus !== dispatchFilter) return false;
    }
    if (railFilter !== "all") {
      if (o.paymentRail !== railFilter) return false;
    }
    if (escrowFilter !== "all") {
      if (o.escrowStatus !== escrowFilter) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto w-full font-sans text-stone-800 antialiased">
      {/* Interactive Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white transition-all transform animate-bounce ${
            toast.type === "error" ? "bg-red-800" : "bg-emerald-900"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-amber-300">
            {toast.type === "error" ? "warning" : "check_circle"}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Development Simulation Disclaimer */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
            <span className="material-symbols-outlined text-[22px]">account_balance</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                Development Financial Simulation Mode
              </span>
              <span className="text-xs text-amber-700 font-medium">Axis Nodal Sandbox AP-1</span>
            </div>
            <p className="text-xs text-amber-800 mt-1">
              All marketplace order values, payment hold metrics (₹24.8L), 12.5% commission rates, and reserves are strictly simulated for frontend verification. No real money, payment gateway rails, or live bank payouts are executed.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Simulated Ledger Operational
          </span>
        </div>
      </div>

      {/* Section 1: Header Bar & Operational Overrides */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-2 border-b border-stone-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 font-semibold">
            <span>Home</span>
            <span className="material-symbols-outlined text-[13px] text-stone-400">chevron_right</span>
            <span>Governance & Commerce</span>
            <span className="material-symbols-outlined text-[13px] text-stone-400">chevron_right</span>
            <span className="text-emerald-950 font-bold">Orders & Payments</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-emerald-950 tracking-tight">
              Platform Marketplace Orders & Payments
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider">
              Live Ledger AP-1
            </span>
          </div>
          <p className="text-sm text-stone-600 max-w-3xl">
            Track multi-store customer orders, package dispatches, carrier tracking, and payment releases across all stores.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => showToast("Order records exported to CSV.")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-700">file_download</span>
            <span>Export Orders (CSV)</span>
          </button>
          <button
            onClick={() => showToast("Carrier SLA health audit: 99.4% on-time handover.")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-stone-400">verified</span>
            <span>Batch Carrier SLA Audit</span>
          </button>
          <button
            onClick={() => showToast("Payment reserve controls updated.")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-900 text-white text-xs font-medium hover:bg-emerald-950 shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-300">shield_with_heart</span>
            <span>Payment Reserve Controls</span>
          </button>
        </div>
      </div>

      {/* Section 2: KPI Metrics Bar (4 bespoke tiles with rich SVG data graphics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Gross Order Volume (30D)
              </span>
              <div className="text-2xl font-serif font-bold text-emerald-950 mt-1">
                {metrics.grossVolume}
              </div>
              <span className="text-sm font-semibold text-amber-800 mt-0.5">
                {metrics.grossGmv}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+18.4% MoM</span>
            </div>
            <svg className="w-24 h-6 text-emerald-600" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path d="M0 20 L20 16 L40 18 L60 10 L80 12 L100 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Total Payment Holds
              </span>
              <div className="text-2xl font-serif font-bold text-emerald-950 mt-1">
                {metrics.escrowPool}
              </div>
              <span className="text-xs text-stone-500 mt-0.5">
                Held in partner settlement accounts
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-900">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs text-stone-600 font-medium">100% Fully Collateralized</span>
            </div>
            <span className="text-xs text-amber-800 font-mono font-semibold">{metrics.escrowBank}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Multi-Store Orders
              </span>
              <div className="text-2xl font-serif font-bold text-emerald-950 mt-1">
                {metrics.multiVendorRate}
              </div>
              <span className="text-xs text-stone-500 mt-0.5">
                Involving 2+ distinct stores
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-emerald-900">
              <span className="material-symbols-outlined text-[22px]">call_split</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: "44.2%" }}></div>
            </div>
            <span className="font-mono text-xs text-stone-600 font-semibold">{metrics.multiVendorCount}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Active Payment Disputes
              </span>
              <div className="text-2xl font-serif font-bold text-red-700 mt-1">
                {metrics.activeDisputes} Open Cases
              </div>
              <span className="text-xs text-stone-500 mt-0.5">
                0.08% overall dispute rate
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
              <span className="material-symbols-outlined text-[22px]">gavel</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-xs font-semibold">
              Low Risk Zone
            </span>
            <span className="text-xs text-red-700 font-bold font-mono">{metrics.disputeAmount} Frozen</span>
          </div>
        </div>
      </div>

      {/* Section 3: High-Density Filter Bar */}
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-stone-400 text-[18px]">search</span>
            <input
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 shadow-inner"
              placeholder="Search Order #VY, Package #, Customer, AWB, Phone..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter: Dispatch Status */}
          <div className="lg:col-span-2 relative">
            <select
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer pr-8"
              value={dispatchFilter}
              onChange={(e) => setDispatchFilter(e.target.value)}
            >
              <option value="all">Dispatch: All Statuses</option>
              <option value="in_atelier">In Store Workshop</option>
              <option value="carrier_handover">Carrier Handover</option>
              <option value="in_transit">In Transit (Active)</option>
              <option value="delivered">Delivered</option>
              <option value="return_requested">Return Requested</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-stone-400 text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Filter: Payment Rail */}
          <div className="lg:col-span-2 relative">
            <select
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer pr-8"
              value={railFilter}
              onChange={(e) => setRailFilter(e.target.value)}
            >
              <option value="all">Payment: All Rails</option>
              <option value="upi">Instant UPI Payment</option>
              <option value="card">Cards (Visa/Mastercard)</option>
              <option value="netbanking">Net Banking</option>
              <option value="cod">Split COD</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-stone-400 text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Filter: Payment Status */}
          <div className="lg:col-span-2 relative">
            <select
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer pr-8"
              value={escrowFilter}
              onChange={(e) => setEscrowFilter(e.target.value)}
            >
              <option value="all">Payment Status: All</option>
              <option value="secured">Payment Secured</option>
              <option value="dispatched">Dispatched - In Transit</option>
              <option value="released">Released to Seller</option>
              <option value="held_dispute">Held on Dispute</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-stone-400 text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Date Range Simulation */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 cursor-pointer hover:bg-stone-100 transition-colors">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[16px] text-stone-400">calendar_today</span>
                <span className="truncate">Nov 1 – Nov 15, 2024</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-stone-400">arrow_drop_down</span>
            </div>
          </div>
        </div>

        {/* Filter Badges & Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-stone-400">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-red-600">✕</button>
              </span>
            )}
            {dispatchFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                Dispatch: {dispatchFilter}
                <button onClick={() => setDispatchFilter("all")} className="hover:text-red-600">✕</button>
              </span>
            )}
            {railFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                Rail: {railFilter}
                <button onClick={() => setRailFilter("all")} className="hover:text-red-600">✕</button>
              </span>
            )}
            {escrowFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                Payment: {escrowFilter}
                <button onClick={() => setEscrowFilter("all")} className="hover:text-red-600">✕</button>
              </span>
            )}
            {(searchQuery || dispatchFilter !== "all" || railFilter !== "all" || escrowFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDispatchFilter("all");
                  setRailFilter("all");
                  setEscrowFilter("all");
                }}
                className="text-amber-800 font-semibold underline hover:text-emerald-900"
              >
                Reset Filters
              </button>
            )}
          </div>
          <div>
            Showing <strong className="text-emerald-950 font-bold">{filteredOrders.length} orders</strong> (
            {filteredOrders.reduce((acc, curr) => acc + (curr.consignments?.length || 1), 0)} store packages)
          </div>
        </div>
      </div>

      {/* Section 4 & 5 Bento: Main Order Ledger + Sticky Real-Time Escrow Override Drawer */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Master Table / Order Cards (8 Cols) */}
        <div className="2xl:col-span-8 flex flex-col gap-4">
          {loading ? (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-800 border-r-transparent"></div>
              <p className="mt-3 text-sm text-stone-500">Synchronizing order records...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
              <span className="material-symbols-outlined text-[48px] text-stone-400">inbox</span>
              <p className="mt-2 text-sm text-stone-600 font-medium">No marketplace orders matched your query.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDispatchFilter("all");
                  setRailFilter("all");
                  setEscrowFilter("all");
                }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-900 text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrderId === order.id;
              const isExpanded = expandedOrders[order.id];
              const isDispute = order.escrowStatus === "held_dispute";

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                    isSelected
                      ? "border-emerald-800 shadow-md ring-1 ring-emerald-800"
                      : "border-stone-200 shadow-sm hover:border-stone-300"
                  }`}
                >
                  {/* Parent Order Banner Row */}
                  <div
                    className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isDispute ? "bg-red-50/70" : "bg-stone-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(order.id);
                        }}
                        className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-emerald-950 shadow-sm hover:bg-stone-100 transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isExpanded ? "keyboard_arrow_down" : "chevron_right"}
                        </span>
                      </button>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-serif font-bold text-base tracking-tight ${
                              isDispute ? "text-red-700" : "text-emerald-950"
                            }`}
                          >
                            #{order.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              isDispute
                                ? "bg-red-600 text-white uppercase font-bold"
                                : order.isMultiVendor
                                ? "bg-amber-100 text-amber-900"
                                : "bg-stone-200 text-stone-700"
                            }`}
                          >
                            {isDispute
                              ? "Dispute Active"
                              : order.isMultiVendor
                              ? `${order.consignments?.length || 2} Stores (Split Order)`
                              : "Single Store"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                          <span>{order.orderDate}</span>
                          <span>•</span>
                          <span className="font-medium text-stone-800">{order.customerName}</span>
                          <span className="text-stone-400">({order.customerLocation})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-mono font-bold text-base ${
                            isDispute ? "text-red-700" : "text-emerald-950"
                          }`}
                        >
                          {order.totalAmount}
                        </span>
                        <span
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            isDispute
                              ? "text-red-700 font-bold"
                              : order.escrowStatus === "released"
                              ? "text-emerald-700"
                              : "text-amber-800"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDispute
                                ? "bg-red-600"
                                : order.escrowStatus === "released"
                                ? "bg-emerald-600"
                                : "bg-amber-600"
                            }`}
                          ></span>
                          {order.statusText || `${order.paymentRail?.toUpperCase()} • Payment Hold`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.id);
                            showToast(`Audit log opened for order #${order.id}`);
                          }}
                          className="px-2.5 py-1.5 rounded bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-medium shadow-sm transition-colors"
                          type="button"
                        >
                          Audit Trail
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.id);
                          }}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors ${
                            isDispute
                              ? "bg-red-700 text-white hover:bg-red-800"
                              : "bg-emerald-900 text-white hover:bg-emerald-950"
                          }`}
                          type="button"
                        >
                          {isDispute ? "Dispute Room" : "Manage Payment"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Split Consignments Body */}
                  {isExpanded && (
                    <div className="p-4 flex flex-col gap-3 bg-white border-t border-stone-100">
                      <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                        <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">
                          Store Shipments (
                          {order.consignments?.length || 1} Deliveries)
                        </span>
                        <span className="text-xs text-amber-800 font-medium font-mono">
                          Shipment ID: SHP-{order.id.slice(-4)}-A/B
                        </span>
                      </div>

                      {order.consignments &&
                        order.consignments.map((con, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                className="w-14 h-14 rounded object-cover shadow-sm flex-shrink-0 border border-stone-200"
                                src={con.itemImage}
                                alt={con.itemSummary}
                              />
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-emerald-950 truncate">
                                    {con.storeName}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-mono text-[10px]">
                                    {con.storeLocation}
                                  </span>
                                </div>
                                <span className="text-xs text-stone-600 truncate mt-0.5">
                                  {con.itemSummary}
                                </span>
                                <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-1">
                                  <span className="font-semibold text-emerald-900">{con.carrier}</span>
                                  <span className="font-mono text-stone-400">AWB #{con.awb}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-medium">
                                    {con.statusBadge}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-4 flex-shrink-0">
                              <div className="flex flex-col lg:items-end">
                                <span className="font-mono text-sm font-bold text-stone-900">
                                  {con.amount}
                                </span>
                                <span className="text-[11px] text-amber-800 font-medium">
                                  {con.holdNote || "Held (Releases upon Delivery OTP)"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showToast(`Waybill AWB #${con.awb} generated for ${con.storeName}`);
                                  }}
                                  className="p-1.5 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
                                  title="View Waybill"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showToast(`Shipment log downloaded for ${con.storeName}`);
                                  }}
                                  className="p-1.5 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
                                  title="Shipment Log"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[18px]">receipt</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Dispute Details if active */}
                      {isDispute && order.disputeNote && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                          <span className="material-symbols-outlined text-[18px] text-red-700 shrink-0">
                            warning
                          </span>
                          <div className="flex flex-col">
                            <span className="font-bold text-red-900">Active Customer Dispute:</span>
                            <span>{order.disputeNote}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Section 6: Pagination and Master Counter Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm mt-1">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>
                Showing <strong className="text-stone-800 font-semibold">1 to {filteredOrders.length}</strong> of{" "}
                <strong className="text-stone-800 font-semibold">3,412</strong> Marketplace Orders
              </span>
              <span className="hidden md:inline text-stone-300">•</span>
              <span className="hidden md:inline font-mono text-stone-400 text-[11px]">
                Registry Sync: 4.2ms ago
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-400 cursor-not-allowed text-xs flex items-center gap-1"
                disabled
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>Previous</span>
              </button>
              <div className="flex items-center gap-1 text-xs">
                <button className="w-7 h-7 rounded-lg bg-emerald-900 text-white font-semibold flex items-center justify-center">
                  1
                </button>
                <button className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 flex items-center justify-center">
                  2
                </button>
                <button className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 flex items-center justify-center">
                  3
                </button>
                <span className="px-1 text-stone-400">…</span>
                <button className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 flex items-center justify-center">
                  853
                </button>
              </div>
              <button
                onClick={() => showToast("Next page loaded (Simulated)")}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs flex items-center gap-1 shadow-sm transition-colors"
                type="button"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Payment Settlement Override Drawer (4 Cols) */}
        <div className="2xl:col-span-4 flex flex-col gap-4 sticky top-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <h2 className="font-serif font-bold text-lg text-emerald-950">
                  Payment & Settlement Details
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-xs font-semibold text-stone-700">
                #{selectedOrder?.id || "VY-90482"}
              </span>
            </div>

            {/* Total Breakdown Card */}
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Order Total</span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {selectedOrder?.totalAmount || "₹7,090.00"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Platform Commission (8%)</span>
                <span className="text-emerald-700 font-medium font-mono">
                  + {selectedOrder?.platformFee || "₹567.20"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Shipping & Logistics Fee</span>
                <span className="text-stone-400 font-medium font-mono">₹120.00</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200 font-medium">
                <span className="text-emerald-950">
                  Payable to {selectedOrder?.consignments?.length || 2} Stores
                </span>
                <span className="font-mono text-emerald-900 font-bold text-sm">
                  {selectedOrder?.disbursableAmount || "₹6,402.80"}
                </span>
              </div>
            </div>

            {/* Per-Merchant Split Distribution */}
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">
                Store Settlement Breakdown
              </span>
              {selectedOrder?.consignments &&
                selectedOrder.consignments.map((con, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-amber-700">storefront</span>
                      <span className="font-semibold text-stone-800 truncate max-w-[130px]">
                        {con.storeName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-stone-900">{con.amount}</span>
                      <span className="block text-[10px] text-amber-800">{con.statusBadge}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Payment Protection Status */}
            <div className="p-3 rounded-lg bg-stone-100/70 border border-stone-200 flex flex-col gap-1 text-stone-700">
              <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">verified_user</span>
                <span>Payment Protection Policy</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Funds are held in secure escrow. Automatic payout release triggers 48h after authenticated carrier delivery confirmation.
              </p>
            </div>

            {/* Admin Override Controls */}
            <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">
                Admin Override Controls
              </span>

              {/* Release Payment */}
              <button
                onClick={() => handleOpenOverride("force_release")}
                disabled={selectedOrder?.escrowStatus === "released"}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-950 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  <span>Release Payment</span>
                </div>
                <span className="text-[10px] text-amber-300 uppercase tracking-wider font-mono">
                  Direct Release
                </span>
              </button>
              <p className="text-[11px] text-stone-400 px-1">
                Bypasses carrier delivery OTP in cases of courier gateway failure with verified recipient confirmation.
              </p>

              {/* Hold Payment */}
              <button
                onClick={() => handleOpenOverride("freeze")}
                disabled={selectedOrder?.escrowStatus === "held_dispute"}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-800">lock</span>
                  <span>Hold Payment</span>
                </div>
                <span className="text-[10px] text-amber-800 font-mono">Dispute Hold</span>
              </button>

              {/* Initiate Partial Refund */}
              <button
                onClick={() => handleOpenOverride("refund")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold hover:bg-red-100 transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
                  <span>Initiate Partial / Full Refund</span>
                </div>
                <span className="text-[10px] text-red-700 font-mono">
                  To {selectedOrder?.customerName?.split(" ")[0] || "Customer"}
                </span>
              </button>
            </div>

            {/* Operator Audit Watermark */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-stone-400 text-[11px]">
              <span>Admin Session: VR-ROOT-772</span>
              <span>256-Bit Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Override Justification Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 border border-stone-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    overrideModal.type === "force_release"
                      ? "text-emerald-800"
                      : overrideModal.type === "freeze"
                      ? "text-amber-800"
                      : "text-red-700"
                  }`}
                >
                  {overrideModal.type === "force_release"
                    ? "key"
                    : overrideModal.type === "freeze"
                    ? "lock"
                    : "currency_exchange"}
                </span>
                <h3 className="font-serif font-bold text-lg text-emerald-950">
                  {overrideModal.type === "force_release"
                    ? "Authorize Payment Release"
                    : overrideModal.type === "freeze"
                    ? "Hold Payment for Dispute"
                    : "Authorize Customer Refund"}
                </h3>
              </div>
              <button
                onClick={() => setOverrideModal(null)}
                className="text-stone-400 hover:text-stone-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600 flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Target Order:</span>
                <strong className="text-emerald-950 font-mono">#{overrideModal.order.id}</strong>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <strong className="text-stone-800">{overrideModal.order.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Hold Amount:</span>
                <strong className="text-emerald-900 font-mono font-bold">
                  {overrideModal.order.totalAmount}
                </strong>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-bold text-stone-600">
                Written Justification <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 shadow-inner"
                placeholder="Specify reason, customer confirmation details, or carrier exception notes..."
                value={overrideJustification}
                onChange={(e) => setOverrideJustification(e.target.value)}
              />
              <span className="text-[11px] text-stone-400">
                Recorded in audit block #984,219 under operator session VR-ROOT-772.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setOverrideModal(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-medium transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteOverride}
                disabled={processingAction}
                className={`px-4 py-2 rounded-lg text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 ${
                  overrideModal.type === "force_release"
                    ? "bg-emerald-900 hover:bg-emerald-950"
                    : overrideModal.type === "freeze"
                    ? "bg-amber-800 hover:bg-amber-900"
                    : "bg-red-700 hover:bg-red-800"
                }`}
                type="button"
              >
                {processingAction && (
                  <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-r-transparent rounded-full"></span>
                )}
                <span>Confirm & Sign Action</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Default seed fallback matching Stitch reference design
const defaultOrders = [
  {
    id: "VY-90482",
    orderDate: "Nov 14, 2024 • 10:15 AM",
    customerName: "Priya Sharma",
    customerLocation: "Bandra West, Mumbai",
    totalAmount: "₹7,090.00",
    platformFee: "₹567.20",
    disbursableAmount: "₹6,402.80",
    paymentRail: "upi",
    dispatchStatus: "in_transit",
    escrowStatus: "secured",
    statusText: "UPI Verified • In Escrow",
    isMultiVendor: true,
    consignments: [
      {
        storeName: "Origin Specialty Roasters",
        storeLocation: "Coorg, KA",
        itemSummary: "Hand-Hammered Brass Filter Coffee Maker (x2) & Peaberry Coffee",
        itemImage:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=80",
        carrier: "Priority Air",
        awb: "881920",
        statusBadge: "In Transit • Departs BLR Air Hub",
        amount: "₹3,780.00",
        holdNote: "Held (Releases upon Delivery OTP)",
      },
      {
        storeName: "Kaveri Living Studio",
        storeLocation: "Jaipur, RJ",
        itemSummary: "Indigo Kantha Quilted Bed Throw (x1) [Applied Promo: -₹450]",
        itemImage:
          "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=150&auto=format&fit=crop&q=80",
        carrier: "Bluedart Express",
        awb: "748920",
        statusBadge: "Packed & Sealed at Bagru Store",
        amount: "₹3,440.00",
        holdNote: "Held in Nodal Reserve",
      },
    ],
  },
  {
    id: "VY-90479",
    orderDate: "Nov 14, 2024 • 08:30 AM",
    customerName: "Rajesh Mehta",
    customerLocation: "Bengaluru, KA",
    totalAmount: "₹1,780.00",
    platformFee: "₹142.40",
    disbursableAmount: "₹1,637.60",
    paymentRail: "card",
    dispatchStatus: "in_atelier",
    escrowStatus: "secured",
    statusText: "Card Escrow (HDFC Nodal)",
    isMultiVendor: false,
    consignments: [
      {
        storeName: "Kaveri Living Studio",
        storeLocation: "Jaipur, RJ",
        itemSummary: "Bagru Floral Cushion Covers (x2)",
        itemImage:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150&auto=format&fit=crop&q=80",
        carrier: "Delhivery Surface",
        awb: "331902",
        statusBadge: "Packed & Awaiting Carrier Pickup",
        amount: "₹1,780.00",
        holdNote: "Secured in Nodal Pool",
      },
    ],
  },
  {
    id: "VY-90461",
    orderDate: "Nov 13, 2024 • 04:20 PM",
    customerName: "Sunita Rao",
    customerLocation: "New Delhi, DL",
    totalAmount: "₹1,150.00",
    platformFee: "₹92.00",
    disbursableAmount: "₹1,058.00",
    paymentRail: "cod",
    dispatchStatus: "in_transit",
    escrowStatus: "dispatched",
    statusText: "Pending Delivery OTP Handover",
    isMultiVendor: false,
    consignments: [
      {
        storeName: "Kaveri Living Studio",
        storeLocation: "Jaipur, RJ",
        itemSummary: "Dabu Hand-Block Table Runner",
        itemImage:
          "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=150&auto=format&fit=crop&q=80",
        carrier: "Priority Air",
        awb: "492019",
        statusBadge: "Out for Delivery Today in South Extension",
        amount: "₹1,150.00",
        holdNote: "Carrier Deposit Due",
      },
    ],
  },
  {
    id: "VY-90432",
    orderDate: "Nov 12, 2024",
    customerName: "Vikram Malhotra",
    customerLocation: "Civil Lines, Delhi",
    totalAmount: "₹4,999.00",
    platformFee: "₹400.00",
    disbursableAmount: "₹4,599.00",
    paymentRail: "upi",
    dispatchStatus: "return_requested",
    escrowStatus: "held_dispute",
    statusText: "Frozen by Super Admin",
    isMultiVendor: false,
    disputeNote: "Claim #DIS-092: Authenticity challenge (Non-GI woven certification inquiry)",
    consignments: [
      {
        storeName: "Urban Weaves Studio",
        storeLocation: "Srinagar, JK",
        itemSummary: "Pure Pashmina Stole",
        itemImage:
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=150&auto=format&fit=crop&q=80",
        carrier: "BlueDart Express",
        awb: "109283",
        statusBadge: "Disbursal Blocked on Dispute",
        amount: "₹4,999.00",
        holdNote: "Frozen in Statutory Vault",
      },
    ],
  },
];
