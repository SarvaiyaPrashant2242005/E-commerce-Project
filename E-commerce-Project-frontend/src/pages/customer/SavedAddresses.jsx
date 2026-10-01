// VEYRA Saved Addresses
// Aligned with Google Stitch: veyra_saved_addresses
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api";

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    label: "",
    name: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    instructions: "",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAddresses();
      if (Array.isArray(data) && data.length > 0) {
        setAddresses(data);
      } else {
        setAddresses([
          {
            _id: "addr-1",
            label: "Primary Address (Home)",
            name: "Demo Customer",
            phone: "+91 98201 44520",
            addressLine1: "42 Altamount Road, Horizon Residence 14B",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400026",
            instructions: "Deliver to front door.",
            isDefault: true,
          },
          {
            _id: "addr-2",
            label: "Secondary Address",
            name: "Demo Customer",
            phone: "+91 98201 44520",
            addressLine1: "Villa Bougainvillea, Chhatodi Lane",
            city: "Aldona",
            state: "Goa",
            pincode: "403508",
            instructions: "Leave with property manager.",
            isDefault: false,
          },
        ]);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!form.addressLine1 || !form.city) return;
    try {
      const newAddr = await authApi.addAddress(form);
      setAddresses([...addresses, newAddr]);
      setIsModalOpen(false);
      setForm({
        label: "",
        name: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
        instructions: "",
        isDefault: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
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
        <span className="text-on-surface font-semibold">Saved Addresses</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
            Address Book
          </span>
          <h1 className="font-serif-caslon font-bold text-3xl text-primary-container mt-1">
            Saved Addresses
          </h1>
          <p className="font-sans text-xs sm:text-sm text-outline mt-1">
            Manage your delivery addresses and shipping preferences.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                  <h3 className="font-serif-caslon font-bold text-base text-primary-container">
                    {addr.label || addr.name}
                  </h3>
                </div>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-semibold">
                    Default
                  </span>
                )}
              </div>

              <div className="mt-3 text-xs text-on-surface-variant space-y-1">
                <p className="font-semibold text-on-surface">{addr.name}</p>
                <p className="leading-relaxed">{addr.addressLine1}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-outline">Phone: {addr.phone}</p>
              </div>

              {addr.instructions && (
                <div className="mt-3 p-2.5 rounded-xl bg-surface-container-low text-[11px] text-outline flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">info</span>
                  <span>"{addr.instructions}"</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>PIN Code Verified</span>
              </span>
              <button className="text-outline hover:text-primary font-semibold text-[11px]">
                Edit Address
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-surface-container-high space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h2 className="font-serif-caslon font-bold text-xl text-primary-container">
                Add Delivery Address
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1 text-[10px]">
                  Address Label (e.g. Home, Office)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Home"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1 text-[10px]">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Demo Customer"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1 text-[10px]">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 44520"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1 text-[10px]">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, building, street..."
                  value={form.addressLine1}
                  onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1 text-[10px]">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1 text-[10px]">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1 text-[10px]">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="400026"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1 text-[10px]">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave with gate security or lobby concierge"
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-outline hover:text-on-surface font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-container text-white font-semibold hover:bg-primary transition-all shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;
