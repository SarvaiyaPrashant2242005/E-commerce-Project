import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const menus = {
  vendor: [
    { to: "/vendor", label: "Dashboard", icon: "📊", end: true },
    { to: "/vendor/products", label: "Products", icon: "📦" },
    { to: "/vendor/orders", label: "Orders", icon: "🧾" },
    { to: "/vendor/analytics", label: "Analytics", icon: "📈" },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: "📊", end: true },
    { to: "/admin/vendors", label: "Vendors", icon: "🏪" },
  ],
};

const DashboardLayout = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-slate-950 text-white hidden md:flex flex-col p-5">
        <Link to="/" className="flex items-center gap-2.5 px-2 mb-10">
          <span className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center">🛍️</span>
          <span className="font-extrabold text-lg bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">MultiShop</span>
        </Link>

        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-3 mb-3">{role} Menu</p>
        <nav className="flex flex-col gap-1.5 flex-1">
          {menus[role].map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}>
              <span className="text-base">{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={() => { dispatch(logout()); navigate("/"); }}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          🚪 Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h2 className="font-bold text-gray-900 capitalize">{role} Panel</h2>
            <p className="text-xs text-gray-400">Welcome back, {user?.name} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge bg-indigo-50 text-indigo-600 capitalize">{role}</span>
            <span className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
        </header>
        <main className="p-6 flex-1"><Outlet /></main>
      </div>
    </div>
  );
};

export default DashboardLayout;