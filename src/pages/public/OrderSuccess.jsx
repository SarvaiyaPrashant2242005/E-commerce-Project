// VEYRA Order Confirmation
// Aligned with Google Stitch: veyra_order_confirmed
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ordersApi } from "../../api";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      ordersApi
        .getOrderById(orderId)
        .then((data) => setOrder(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  // Group items by vendor / store
  const vendorPackages = useMemo(() => {
    if (!order?.items) return [];
    const map = {};
    order.items.forEach((item) => {
      const storeName = item.storeName || "Independent Store";
      if (!map[storeName]) {
        map[storeName] = {
          storeName,
          items: [],
          subtotal: 0,
        };
      }
      map[storeName].items.push(item);
      map[storeName].subtotal += (item.price || 0) * (item.quantity || 1);
    });
    return Object.values(map);
  }, [order]);

  const customerName = order?.customer?.name || "Customer";
  const customerEmail = order?.customer?.email || "customer@veyra.com";
  const displayOrderNum = order?.orderNumber || (orderId ? `#${orderId.substring(0, 8)}` : "#VYR-884219");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Celebration Top Hero */}
      <div className="flex flex-col items-center text-center">
        {/* Animated Seal Badge */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-secondary-fixed/50 animate-ping opacity-30" />
          <div className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-secondary-fixed text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
        </div>

        <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
          Order Confirmed
        </span>
        <h1 className="font-serif-caslon font-bold text-3xl sm:text-4xl text-primary-container mt-1">
          Thank you for your order, {customerName}!
        </h1>
        <p className="font-sans text-xs sm:text-sm text-outline mt-2 max-w-md leading-relaxed">
          Order <span className="font-semibold text-on-surface">{displayOrderNum}</span> has been confirmed. Tracking updates and order receipts have been sent to{" "}
          <span className="text-on-surface font-medium">{customerEmail}</span>.
        </p>
      </div>

      {/* Consolidated Dispatch Overview Banner */}
      <div className="mt-10 bg-surface-container-low p-5 rounded-2xl border border-surface-container flex items-start gap-4 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-secondary-fixed/40 flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-secondary text-xl">local_shipping</span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-sans text-[11px] text-secondary font-bold uppercase tracking-wider block">
            Direct Store Delivery
          </span>
          <p className="font-serif-caslon font-bold text-base sm:text-lg text-primary-container mt-0.5">
            Estimated Delivery: 4–6 Business Days
          </p>
          <p className="font-sans text-xs text-outline mt-0.5">
            Shipped via standard delivery in 4–6 business days.
          </p>
        </div>
      </div>

      {/* Grouped Shipments by Store */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-caslon font-bold text-xl text-primary-container">
            Store Packages ({vendorPackages.length > 0 ? vendorPackages.length : 1})
          </h2>
          <span className="font-sans text-xs text-secondary font-semibold">Payment Protected</span>
        </div>

        {vendorPackages.length > 0 ? (
          vendorPackages.map((pkg, idx) => (
            <div
              key={pkg.storeName}
              className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-sans text-[11px] text-outline block">
                    Package {idx + 1} of {vendorPackages.length}
                  </span>
                  <h3 className="font-serif-caslon font-bold text-base text-primary-container">
                    {pkg.storeName}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-secondary-fixed-dim bg-secondary/10 px-2.5 py-0.5 rounded-full">
                  Processing
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-surface-container">
                {pkg.items.map((item) => (
                  <div key={item.productId} className="py-2.5 flex items-center gap-3.5">
                    <img
                      src={item.image || "https://placehold.co/100x120/eaefed/173b35?text=VEYRA"}
                      alt={item.title}
                      className="w-12 h-14 object-cover rounded-lg bg-surface-container shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-semibold text-xs sm:text-sm text-primary-container truncate">
                        {item.title}
                      </p>
                      <p className="font-sans text-[11px] text-outline">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-sans font-bold text-xs sm:text-sm text-primary">
                      ₹{Number(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs">
            <p className="text-xs text-outline">Your order details have been securely recorded.</p>
          </div>
        )}
      </div>

      {/* Direct Seller Support Note */}
      <div className="mt-8 bg-primary-container text-white p-5 rounded-2xl flex items-center gap-4 shadow-xs">
        <span className="material-symbols-outlined text-secondary-fixed text-3xl shrink-0">verified</span>
        <div className="text-xs">
          <strong className="block font-semibold text-secondary-fixed uppercase tracking-wider text-[10px]">
            Direct Seller Support
          </strong>
          <p className="text-white/85 mt-0.5 leading-relaxed">
            Your purchase directly supports independent verified sellers and creators.
          </p>
        </div>
      </div>

      {/* Navigation CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/account/orders"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-all text-center shadow-xs"
        >
          Track Order in My Account
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container transition-all text-center"
        >
          Explore More Products
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;