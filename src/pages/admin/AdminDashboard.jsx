import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

// ===== STATCARD — same design component =====
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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats) return <p className="text-gray-500">Loading platform stats...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>

      {/* ===== USAGE — admin ke hisaab se 4 boxes ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🏪" label="Total Vendors" value={stats.totalVendors} gradient="from-indigo-500 to-blue-500" />
        <StatCard icon="👥" label="Total Customers" value={stats.totalCustomers} gradient="from-purple-500 to-pink-500" />
        <StatCard icon="📦" label="Total Products" value={stats.totalProducts} gradient="from-emerald-500 to-teal-500" />
        <StatCard icon="💰" label="Platform Revenue" value={`₹${stats.platformRevenue}`} gradient="from-amber-500 to-orange-500" />
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">Vendor Management</h2>
        <p className="text-gray-500 text-sm mb-4">Naye vendors ko approve/reject karo, stores monitor karo.</p>
        <Link to="/admin/vendors" className="btn-primary inline-block">Manage Vendors →</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;