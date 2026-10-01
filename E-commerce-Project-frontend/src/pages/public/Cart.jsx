// VEYRA Multi-Vendor Shopping Bag
// Aligned with Google Stitch: veyra_multi_vendor_shopping_bag
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../../features/cart/cartSlice";

const Cart = () => {
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  // Group items by vendor / store
  const vendorGroups = useMemo(() => {
    const groups = {};
    items.forEach((item) => {
      const storeKey = item.storeName || "Independent Store";
      if (!groups[storeKey]) {
        groups[storeKey] = {
          storeName: storeKey,
          storeId: item.storeId || "",
          location: "Verified Store",
          items: [],
          subtotal: 0,
        };
      }
      groups[storeKey].items.push(item);
      groups[storeKey].subtotal += (item.price || 0) * (item.quantity || 1);
    });
    return Object.values(groups);
  }, [items]);

  const rawSubtotal = items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const shippingFee = rawSubtotal > 5000 || rawSubtotal === 0 ? 0 : 250;
  const taxAmount = Math.round((rawSubtotal - discountAmount) * 0.05); // 5% GST
  const finalTotal = rawSubtotal - discountAmount + shippingFee + taxAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === "VEYRA10" || clean === "PATRON10") {
      setDiscountPercent(10);
      setCouponMessage({ type: "success", text: "10% discount applied!" });
    } else if (clean === "HERITAGE" || clean === "SALE25") {
      setDiscountPercent(15);
      setCouponMessage({ type: "success", text: "15% discount applied!" });
    } else {
      setCouponMessage({ type: "error", text: "Invalid code. Try 'VEYRA10' or 'HERITAGE'." });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-surface-container flex items-center justify-center text-primary mb-6 shadow-xs">
          <span className="material-symbols-outlined text-4xl">shopping_bag</span>
        </div>
        <h1 className="font-serif-caslon font-bold text-3xl sm:text-4xl text-primary-container mb-3">
          Your Cart is Empty
        </h1>
        <p className="font-sans text-sm sm:text-base text-outline max-w-md mx-auto mb-8 leading-relaxed">
          Discover quality products from verified independent stores across India.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-container text-white text-sm font-semibold tracking-wide hover:bg-primary transition-all shadow-sm"
        >
          <span>Explore Products</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-surface-container-high">
        <div>
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
            Cart
          </span>
          <h1 className="font-serif-caslon font-bold text-2xl sm:text-3xl text-primary-container mt-1">
            Order Items ({items.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-secondary bg-surface-container px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span>Payment Protected Checkout</span>
        </div>
      </div>

      {/* Free Delivery Bar */}
      <div className="mt-6 bg-surface-container-low p-4 rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_shipping
          </span>
          <p className="font-sans text-xs sm:text-sm text-on-surface">
            {rawSubtotal >= 5000 ? (
              <span className="font-semibold text-emerald-800">
                You have qualified for free express delivery!
              </span>
            ) : (
              <span>
                Add{" "}
                <span className="font-bold text-primary">₹{(5000 - rawSubtotal).toLocaleString("en-IN")}</span> more to
                receive free delivery.
              </span>
            )}
          </p>
        </div>
        <div className="w-full sm:w-48 h-2 bg-surface-container rounded-full overflow-hidden shrink-0">
          <div
            className="h-full bg-secondary transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, (rawSubtotal / 5000) * 100)}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Multi-Vendor Items & Sticky Summary */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Vendor Grouped Items */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {vendorGroups.map((group, gIdx) => (
            <section
              key={group.storeName}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container-high overflow-hidden shadow-xs"
            >
              {/* Vendor Banner Header */}
              <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-serif-caslon font-bold text-base shrink-0">
                    {group.storeName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-serif-caslon font-bold text-base text-primary-container">
                        {group.storeName}
                      </h2>
                      <span
                        className="material-symbols-outlined text-secondary text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                        title="Verified Store"
                      >
                        verified
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-outline">{group.location}</p>
                  </div>
                </div>
                <span className="font-sans text-[11px] font-semibold text-secondary-fixed-dim bg-secondary/10 px-2.5 py-0.5 rounded-full">
                  Direct Store Delivery
                </span>
              </div>

              {/* Items in this Vendor Group */}
              <div className="divide-y divide-surface-container">
                {group.items.map((item) => (
                  <div key={item.productId} className="p-4 sm:p-5 flex gap-4">
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${item.productId}`}
                      className="relative w-20 sm:w-24 aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shrink-0 shadow-2xs group"
                    >
                      <img
                        src={item.image || "https://placehold.co/200x250/eaefed/173b35?text=VEYRA"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${item.productId}`}
                            className="font-serif-caslon font-bold text-sm sm:text-base text-primary-container hover:text-secondary transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => dispatch(removeFromCart(item.productId))}
                            aria-label={`Remove ${item.name}`}
                            className="text-outline hover:text-error transition-colors p-1"
                          >
                            <span className="material-symbols-outlined text-lg">delete_outline</span>
                          </button>
                        </div>
                        <p className="font-sans text-xs text-outline mt-0.5">Verified Stock</p>
                      </div>

                      {/* Pricing & Stepper */}
                      <div className="flex items-end justify-between mt-3 pt-2 border-t border-surface-container/60">
                        <div>
                          <p className="font-sans font-bold text-base sm:text-lg text-primary">
                            ₹{Number(item.price).toLocaleString("en-IN")}
                          </p>
                          <p className="font-sans text-[11px] text-outline">
                            Total: ₹{Number(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center bg-surface-container-low rounded-lg border border-surface-container p-0.5">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: Math.max(1, item.quantity - 1),
                                })
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-7 text-center font-sans font-semibold text-xs sm:text-sm text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: Math.min(item.stock || 99, item.quantity + 1),
                                })
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vendor Subtotal Footer */}
              <div className="p-3 bg-surface-container-low/60 border-t border-surface-container flex items-center justify-between text-xs text-outline">
                <span>{group.storeName} Subtotal</span>
                <span className="font-sans font-bold text-sm text-primary">
                  ₹{group.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </section>
          ))}
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-5">
            <h2 className="font-serif-caslon font-bold text-xl text-primary-container">
              Order Summary
            </h2>

            {/* Price Breakdown */}
            <div className="space-y-3 text-xs sm:text-sm text-on-surface border-b border-surface-container pb-4">
              <div className="flex justify-between">
                <span className="text-outline">Items Subtotal</span>
                <span className="font-medium">₹{rawSubtotal.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Discount Savings ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-outline">Delivery Fee</span>
                <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Estimated Taxes &amp; GST (5%)</span>
                <span>₹{taxAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-serif-caslon font-bold text-lg text-primary-container">
                Total Payable
              </span>
              <span className="font-sans font-extrabold text-2xl text-primary">
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <label htmlFor="couponInput" className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1.5">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  id="couponInput"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. VEYRA10"
                  className="flex-1 px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs focus:outline-hidden focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] mt-1.5 ${couponMessage.type === "success" ? "text-emerald-700" : "text-error"}`}>
                  {couponMessage.text}
                </p>
              )}
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-4 rounded-xl bg-primary-container text-white font-sans font-bold text-sm tracking-wide hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-lg">lock</span>
            </button>

            {/* Payment Protection */}
            <div className="p-3 bg-surface-container-low rounded-xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
              <p className="text-[11px] text-outline leading-relaxed">
                <strong className="text-on-surface">Payment Protection:</strong> Funds are held securely until you receive and verify your products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
