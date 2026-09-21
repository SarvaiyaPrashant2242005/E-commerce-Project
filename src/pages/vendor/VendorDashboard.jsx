import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

// ===== YE HAI STATCARD — design wala part (upar wala change) =====
const StatCard = ({ icon, label, value, gradient }) => (
  <div className="card card-hover flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center text-xl shadow-lg shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

const VendorDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/vendor/stats").then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats) return <p className="text-gray-500">Loading stats...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

      {/* ===== YE HAI USAGE — 4 boxes wala part (neeche wala change) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📦" label="Total Products" value={stats.totalProducts} gradient="from-indigo-500 to-blue-500" />
        <StatCard icon="🧾" label="Total Orders" value={stats.totalOrders} gradient="from-purple-500 to-pink-500" />
        <StatCard icon="💰" label="Revenue" value={`₹${stats.revenue}`} gradient="from-emerald-500 to-teal-500" />
        <StatCard icon="⏳" label="Pending Orders" value={stats.pendingOrders} gradient="from-amber-500 to-orange-500" />
      </div>

      <Link to="/vendor/products/new" className="btn-primary">+ Add New Product</Link>
    </div>
  );
};

export default VendorDashboard;