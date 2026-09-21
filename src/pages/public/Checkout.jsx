import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import api from "../../api/axios";

const Checkout = () => {
  const { items } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);

  if (!token) return <Navigate to="/login" replace />;
  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-xl mb-4">Cart khali hai! Pehle kuch add karo.</p>
        <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
      </div>
    );

  // Stripe Checkout session banao aur us URL par redirect karo
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/payments/create-checkout-session", {
        items,
        shippingInfo: form,
      });
      window.location.href = data.url; // Stripe hosted checkout page
    } catch (err) {
      setError(err.response?.data?.message || "Payment session failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      <form onSubmit={handlePayment} className="md:col-span-2 card space-y-4">
        <h2 className="font-bold text-lg">Shipping Details</h2>
        {error && <p className="bg-red-100 text-red-600 p-3 rounded text-sm">{error}</p>}
        <input className="input" placeholder="Full Name" required
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Phone Number" required
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea className="input" placeholder="Full Address" rows="2" required
          value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <input className="input" placeholder="City" required
            value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input className="input" placeholder="PIN Code" required
            value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        </div>
        <button className="btn-primary w-full text-lg" disabled={loading}>
          {loading ? "Redirecting to Stripe..." : `Pay ₹${subtotal} Securely 💳`}
        </button>
        <p className="text-xs text-gray-400 text-center">Payments secured by Stripe. Order email confirmation automatically milega.</p>
      </form>

      <div className="card h-fit">
        <h2 className="font-bold text-lg mb-4">Your Items</h2>
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-sm py-1 border-b last:border-0">
            <span className="truncate mr-2">{i.name} × {i.quantity}</span>
            <span className="font-semibold">₹{i.price * i.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
          <span>Total</span><span>₹{subtotal}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;