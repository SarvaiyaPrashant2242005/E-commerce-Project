// VEYRA Multi-Vendor Checkout
// Aligned with Google Stitch: veyra_checkout_address_delivery & veyra_checkout_payment_review
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../features/cart/cartSlice";
import { ordersApi, authApi } from "../../api";

const Checkout = () => {
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Stepper: 1 = Address & Delivery, 2 = Payment & Confirm
  const [step, setStep] = useState(1);

  // Contact Info
  const [contact, setContact] = useState({
    name: user?.name || "Demo Customer",
    email: user?.email || "customer@veyra.com",
    phone: user?.phone || "+91 98201 44520",
  });

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");
  const [customAddress, setCustomAddress] = useState({
    name: "Demo Customer",
    addressLine1: "42 Altamount Road, Horizon Residence 14B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400026",
    instructions: "Leave with security concierge if unavailable.",
  });
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  // Delivery options & Payment Method
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    authApi
      .getAddresses()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSavedAddresses(data);
          setSelectedAddressId(data[0]._id);
        } else {
          // Fallback demo address
          const fallback = [
            {
              _id: "addr-1",
              label: "Primary Address (Home)",
              isDefault: true,
              name: contact.name,
              phone: contact.phone,
              addressLine1: "42 Altamount Road, Horizon Residence 14B",
              city: "Mumbai",
              state: "Maharashtra",
              pincode: "400026",
              instructions: "Deliver to front foyer.",
            },
            {
              _id: "addr-2",
              label: "Secondary Address",
              isDefault: false,
              name: contact.name,
              phone: contact.phone,
              addressLine1: "Villa Bougainvillea, Chhatodi Lane",
              city: "Aldona",
              state: "Goa",
              pincode: "403508",
              instructions: "Leave with property manager.",
            },
          ];
          setSavedAddresses(fallback);
          setSelectedAddressId("addr-1");
        }
      })
      .catch(() => {});
  }, [contact.name, contact.phone]);

  // Group items by vendor to produce realistic multi-vendor packages
  const vendorPackages = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      const storeName = item.storeName || "Independent Store";
      if (!map[storeName]) {
        map[storeName] = {
          storeName,
          storeId: item.storeId || "",
          items: [],
          subtotal: 0,
        };
      }
      map[storeName].items.push(item);
      map[storeName].subtotal += (item.price || 0) * (item.quantity || 1);
    });
    return Object.values(map);
  }, [items]);

  const rawSubtotal = items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);
  const shippingFee = deliverySpeed === "express" ? 450 : rawSubtotal > 5000 || rawSubtotal === 0 ? 0 : 250;
  const taxAmount = Math.round(rawSubtotal * 0.05); // 5% GST
  const finalTotal = rawSubtotal + shippingFee + taxAmount;

  const activeShippingAddress = useMemo(() => {
    if (useCustomAddress) return customAddress;
    return savedAddresses.find((a) => a._id === selectedAddressId) || customAddress;
  }, [useCustomAddress, customAddress, savedAddresses, selectedAddressId]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        customer: {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
        },
        shippingAddress: activeShippingAddress,
        items: items.map((i) => ({
          productId: i.productId,
          title: i.name || i.title,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          storeName: i.storeName || "Store",
          storeId: i.storeId || "",
        })),
        pricing: {
          subtotal: rawSubtotal,
          shipping: shippingFee,
          tax: taxAmount,
          total: finalTotal,
        },
        paymentMethod: paymentMethod === "upi" ? "Simulated UPI" : "Simulated Card",
        status: "confirmed",
        paymentStatus: "paid",
      };

      const createdOrder = await ordersApi.createOrder(orderPayload);
      dispatch(clearCart());
      navigate(`/order-success?orderId=${createdOrder._id || createdOrder.orderNumber}`);
    } catch (err) {
      setError(err.message || "Failed to place order. Please verify details.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
          <span className="material-symbols-outlined text-3xl">shopping_cart</span>
        </div>
        <h2 className="font-serif-caslon font-bold text-2xl text-primary-container mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-outline mb-6">
          Please add products from the catalog before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex px-6 py-2.5 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-all"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Stepper Header */}
      <div className="max-w-md mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[2px] bg-surface-container z-0">
            <div
              className={`h-full bg-primary transition-all duration-300 ${
                step === 1 ? "w-1/2" : "w-full"
              }`}
            />
          </div>

          {/* Step 1 Pill */}
          <button
            onClick={() => setStep(1)}
            className="flex flex-col items-center gap-1.5 relative z-10 cursor-pointer"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 1
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-container text-outline"
              }`}
            >
              {step > 1 ? (
                <span className="material-symbols-outlined text-base">check</span>
              ) : (
                "1"
              )}
            </div>
            <span className="font-sans text-xs font-semibold text-primary">Delivery Address</span>
          </button>

          {/* Step 2 Pill */}
          <button
            onClick={() => setStep(2)}
            className="flex flex-col items-center gap-1.5 relative z-10 cursor-pointer"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 2
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-container text-outline"
              }`}
            >
              2
            </div>
            <span
              className={`font-sans text-xs font-semibold ${
                step === 2 ? "text-primary" : "text-outline"
              }`}
            >
              Payment &amp; Review
            </span>
          </button>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {step === 1 ? (
            /* =======================================================
               STAGE 1: ADDRESS & CONTACT INFORMATION
               ======================================================= */
            <div className="space-y-6">
              {/* Contact Information */}
              <section className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-surface-container pb-3">
                  <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
                  <h2 className="font-serif-caslon font-bold text-lg text-primary-container">
                    Customer Contact Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs sm:text-sm bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs sm:text-sm bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1">
                      Email Address (Order Confirmation)
                    </label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs sm:text-sm bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery Address Selection */}
              <section className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-surface-container pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                    <h2 className="font-serif-caslon font-bold text-lg text-primary-container">
                      Delivery Address
                    </h2>
                  </div>
                  <button
                    onClick={() => setUseCustomAddress(!useCustomAddress)}
                    className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
                  >
                    {useCustomAddress ? "Use Saved Address" : "+ Enter New Address"}
                  </button>
                </div>

                {!useCustomAddress ? (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedAddressId === addr._id
                            ? "border-primary bg-surface-container-low/40 shadow-xs"
                            : "border-surface-container bg-surface-container-lowest hover:border-outline-variant"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address_choice"
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="mt-1 accent-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-serif-caslon font-bold text-sm text-primary-container">
                                {addr.label || addr.name}
                              </span>
                              {addr.isDefault && (
                                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-on-surface mt-1 leading-relaxed">
                              {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            {addr.instructions && (
                              <p className="text-[11px] text-outline italic mt-1">
                                "{addr.instructions}"
                              </p>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={customAddress.addressLine1}
                        onChange={(e) =>
                          setCustomAddress({ ...customAddress, addressLine1: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs sm:text-sm bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={customAddress.city}
                        onChange={(e) =>
                          setCustomAddress({ ...customAddress, city: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs sm:text-sm bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={customAddress.pincode}
                        onChange={(e) =>
                          setCustomAddress({ ...customAddress, pincode: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs sm:text-sm bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Delivery Speed / Courier Selection */}
              <section className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-surface-container pb-3">
                  <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                  <h2 className="font-serif-caslon font-bold text-lg text-primary-container">
                    Shipping Method
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      deliverySpeed === "standard"
                        ? "border-primary bg-surface-container-low/40 shadow-xs"
                        : "border-surface-container bg-surface-container-lowest"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_speed"
                      checked={deliverySpeed === "standard"}
                      onChange={() => setDeliverySpeed("standard")}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <span className="font-sans font-bold text-xs sm:text-sm text-primary block">
                        Standard Delivery
                      </span>
                      <p className="text-[11px] text-outline mt-0.5">
                        Delivered in 4–6 business days.
                      </p>
                      <span className="text-xs font-semibold text-secondary mt-1 inline-block">
                        {rawSubtotal > 5000 ? "Complimentary" : "₹250"}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      deliverySpeed === "express"
                        ? "border-primary bg-surface-container-low/40 shadow-xs"
                        : "border-surface-container bg-surface-container-lowest"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_speed"
                      checked={deliverySpeed === "express"}
                      onChange={() => setDeliverySpeed("express")}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <span className="font-sans font-bold text-xs sm:text-sm text-primary block">
                        Express Delivery
                      </span>
                      <p className="text-[11px] text-outline mt-0.5">
                        Delivered in 2–3 business days.
                      </p>
                      <span className="text-xs font-semibold text-secondary mt-1 inline-block">
                        ₹450
                      </span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Continue to Step 2 Button */}
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl bg-primary-container text-white font-sans font-bold text-sm tracking-wide hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment &amp; Review</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          ) : (
            /* =======================================================
               STAGE 2: PAYMENT METHOD & REVIEW
               ======================================================= */
            <div className="space-y-6">
              {/* Back to Step 1 */}
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-outline hover:text-primary flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Edit Address &amp; Delivery</span>
              </button>

              {/* Multi-Vendor Packages Breakdown */}
              <section className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-surface-container pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
                    <h2 className="font-serif-caslon font-bold text-lg text-primary-container">
                      Store Packages ({vendorPackages.length})
                    </h2>
                  </div>
                  <span className="text-xs text-secondary font-semibold">Separate Store Shipments</span>
                </div>

                <div className="space-y-4">
                  {vendorPackages.map((pkg, idx) => (
                    <div
                      key={pkg.storeName}
                      className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary-container text-white text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-serif-caslon font-bold text-sm text-primary-container">
                            Package {idx + 1}: {pkg.storeName}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-outline">
                          Subtotal: ₹{pkg.subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="divide-y divide-surface-container/60">
                        {pkg.items.map((i) => (
                          <div key={i.productId} className="py-2 flex items-center justify-between text-xs">
                            <span className="text-on-surface truncate max-w-xs">
                              {i.name} × {i.quantity}
                            </span>
                            <span className="font-semibold text-primary">
                              ₹{Number(i.price * i.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Method Selection */}
              <section className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-surface-container pb-3">
                  <span className="material-symbols-outlined text-primary text-xl">payments</span>
                  <h2 className="font-serif-caslon font-bold text-lg text-primary-container">
                    Select Payment Method
                  </h2>
                </div>

                {/* Demonstration Alert Banner */}
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
                    info
                  </span>
                  <div>
                    <strong className="block font-semibold">Development Demonstration Mode:</strong>
                    Payment processing and payment holds are simulated by MSW. No actual financial transactions or card charges will take place.
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === "upi"
                        ? "border-primary bg-surface-container-low/40 shadow-xs"
                        : "border-surface-container bg-surface-container-lowest"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <span className="font-sans font-bold text-xs sm:text-sm text-primary block">
                        Instant UPI Transfer (Simulated)
                      </span>
                      <p className="text-[11px] text-outline mt-0.5">
                        Google Pay, PhonePe, BHIM, or any VPA handle.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-surface-container-low/40 shadow-xs"
                        : "border-surface-container bg-surface-container-lowest"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <span className="font-sans font-bold text-xs sm:text-sm text-primary block">
                        Credit / Debit Card (Simulated)
                      </span>
                      <p className="text-[11px] text-outline mt-0.5">
                        Visa, Mastercard, RuPay. Payment held safely until delivery confirmation.
                      </p>
                    </div>
                  </label>
                </div>
              </section>

              {/* Confirm Order Button */}
              {error && (
                <p className="text-xs text-error font-medium p-3 bg-error-container/20 rounded-xl">
                  {error}
                </p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-primary-container text-white font-sans font-bold text-sm tracking-wide hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{finalTotal.toLocaleString("en-IN")})</span>
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Sticky Summary Column */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
            <h2 className="font-serif-caslon font-bold text-lg text-primary-container">
              Order Breakdown
            </h2>

            <div className="space-y-2.5 text-xs text-on-surface border-b border-surface-container pb-4">
              <div className="flex justify-between">
                <span className="text-outline">Items Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
                <span className="font-medium">₹{rawSubtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">
                  Delivery Fee ({vendorPackages.length} package{vendorPackages.length > 1 ? "s" : ""})
                </span>
                <span>{shippingFee === 0 ? "Complimentary" : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Taxes &amp; GST (5%)</span>
                <span>₹{taxAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-serif-caslon font-bold text-base text-primary-container">
                Total Payable
              </span>
              <span className="font-sans font-extrabold text-2xl text-primary">
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Delivery Destination Preview */}
            <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1">
              <span className="font-semibold text-primary block">Delivering to:</span>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                {activeShippingAddress.name} — {activeShippingAddress.addressLine1}, {activeShippingAddress.city} ({activeShippingAddress.pincode})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;