// VEYRA Seller Workspace — Orders & Shipments
// Aligned with Google Stitch: veyra_seller_orders_dispatches & veyra_seller_order_details_fulfillment
import { useEffect, useState, useMemo } from "react";
import { vendorApi } from "../../api/vendor.api";

const COURIER_OPTIONS = [
  "Blue Dart Apex Heritage",
  "Delhivery Air Express",
  "DTDC Handloom Logistics",
  "India Post Speed Post",
];

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search state
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer / Modal for order details and fulfillment
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fulfillmentStatus, setFulfillmentStatus] = useState("confirmed");
  const [carrier, setCarrier] = useState(COURIER_OPTIONS[0]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorApi.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setFulfillmentStatus(order.status || "confirmed");
    setCarrier(order.carrier || COURIER_OPTIONS[0]);
    setTrackingNumber(order.trackingNumber || `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`);
    setSuccessMessage(null);
  };

  const handleUpdateFulfillment = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    setSuccessMessage(null);

    try {
      const res = await vendorApi.updateOrderStatus(selectedOrder._id, {
        status: fulfillmentStatus,
        carrier,
        trackingNumber,
      });

      // Update in local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id
            ? { ...o, status: fulfillmentStatus, carrier, trackingNumber }
            : o
        )
      );

      setSelectedOrder((prev) => ({
        ...prev,
        status: fulfillmentStatus,
        carrier,
        trackingNumber,
      }));

      setSuccessMessage("Shipment tracking and fulfillment status updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      alert(err.message || "Unable to update shipment status.");
    } finally {
      setUpdating(false);
    }
  };

  // Filter orders by tab and search
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items?.some((i) => (i.title || i.name || "").toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesTab = true;
      if (activeTab === "pending") matchesTab = o.status === "confirmed" || o.status === "pending";
      else if (activeTab === "processing") matchesTab = o.status === "processing";
      else if (activeTab === "dispatched") matchesTab = o.status === "dispatched";
      else if (activeTab === "delivered") matchesTab = o.status === "delivered";

      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-caslon font-bold text-2xl text-primary tracking-tight">
              Orders &amp; Shipments
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface">
              {orders.length} Orders Total
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Process package shipments, add courier tracking numbers, and update delivery status.
          </p>
        </div>

        {/* Payment protection summary badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface">
          <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
          <span>48-Hour Payment Protection Active</span>
        </div>
      </div>

      {/* Control Bar: Search & Status Tabs */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high shadow-xs space-y-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number (e.g. VYR-884219), customer name, or item..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-surface-container">
          {[
            { id: "all", label: "All Orders" },
            { id: "pending", label: "Pending Fulfillment" },
            { id: "processing", label: "Processing" },
            { id: "dispatched", label: "Shipped" },
            { id: "delivered", label: "Delivered" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary-container text-white shadow-xs"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-surface-container rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-outline">
            <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant block">
              local_shipping
            </span>
            <h3 className="font-serif-caslon font-bold text-base text-on-surface mb-1">
              No orders in this status
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              Incoming orders containing your products will appear here for fulfillment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-outline uppercase font-semibold text-[10px] tracking-wider border-b border-surface-container">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer &amp; Address</th>
                  <th className="py-3 px-4">Ordered Items</th>
                  <th className="py-3 px-4">Subtotal</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4">Courier Partner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredOrders.map((o) => {
                  const isDispatched = o.status === "dispatched";
                  const isDelivered = o.status === "delivered";
                  const isProcessing = o.status === "processing";

                  return (
                    <tr
                      key={o._id}
                      onClick={() => openOrderModal(o)}
                      className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">
                        {o.orderNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-on-surface">{o.customer?.name || "Customer"}</p>
                        <p className="text-[11px] text-outline">
                          {o.shippingAddress?.city}, {o.shippingAddress?.state}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {o.items?.map((item, idx) => (
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

                      <td className="py-3.5 px-4 font-bold text-primary">
                        ₹{o.totalAmount?.toLocaleString("en-IN")}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isDelivered
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : isDispatched
                              ? "bg-secondary-fixed text-on-secondary-fixed"
                              : isProcessing
                              ? "bg-surface-container-high text-on-surface"
                              : "bg-surface-container text-outline"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{o.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-outline">
                        <span className="block text-[11px] font-medium text-on-surface truncate">
                          {o.carrier || "Blue Dart"}
                        </span>
                        <span className="font-mono text-[10px] block truncate">
                          {o.trackingNumber || "BD-PENDING"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderModal(o);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-white text-primary text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Manage Shipment
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== INTERACTIVE DISPATCH & FULFILLMENT MODAL ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-2xl w-full border border-surface-container-high shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-surface-container pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-caslon font-bold text-xl text-primary">
                    Order Shipment #{selectedOrder.orderNumber}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-container uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-outline mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {successMessage && (
              <div className="p-3 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Delivery Address Card */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                Delivery Address:
              </span>
              <p className="font-bold text-on-surface text-xs">{selectedOrder.customer?.name || "Customer"}</p>
              <p className="text-xs text-on-surface-variant">
                {selectedOrder.shippingAddress?.addressLine1},{" "}
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} —{" "}
                {selectedOrder.shippingAddress?.pincode}
              </p>
              <p className="text-[11px] text-outline">
                Contact: {selectedOrder.customer?.phone || selectedOrder.shippingAddress?.phone || "N/A"}
              </p>
            </div>

            {/* Items Summary */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-2">
                Items in this Package:
              </span>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-surface-container"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-surface-container"
                        />
                      )}
                      <div>
                        <p className="font-bold text-xs text-on-surface">{item.title || item.name}</p>
                        <p className="text-[11px] text-outline">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-primary">
                      ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fulfillment Status & Courier Form */}
            <form onSubmit={handleUpdateFulfillment} className="space-y-4 pt-2 border-t border-surface-container">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                Update Shipment Details:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none cursor-pointer"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="dispatched">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none cursor-pointer"
                  >
                    {COURIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD992841920IN"
                  className="w-full h-10 px-4 text-xs font-mono font-bold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-container text-white transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {updating ? (
                    <span>Updating Shipment...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      <span>Update Shipment Status</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
