import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
      isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            🛍️
          </span>
          <span className="text-xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MultiShop
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/stores" className={linkClass}>Stores</NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition-all">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role !== "customer" && (
                <Link to={user.role === "vendor" ? "/vendor" : "/admin"} className="btn-primary btn-sm">
                  {user.role === "vendor" ? "🏪 Vendor Panel" : "⚡ Admin Panel"}
                </Link>
              )}
              <span className="hidden sm:block w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm">
                {user.name?.[0]?.toUpperCase()}
              </span>
              <button onClick={() => { dispatch(logout()); navigate("/"); }}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn-primary btn-sm">Become a Seller</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;