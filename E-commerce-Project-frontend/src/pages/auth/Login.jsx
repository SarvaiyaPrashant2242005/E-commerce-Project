import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../features/auth/authSlice";

const Login = () => {
  const location = useLocation();
  const isAdminLogin = location.pathname.includes("/admin");

  const [form, setForm] = useState({
    email: isAdminLogin ? "admin@veyra.com" : "customer@veyra.com",
    password: isAdminLogin ? "admin123" : "demo",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminLogin) {
      setForm({ email: "admin@veyra.com", password: "admin123" });
    }
  }, [isAdminLogin]);

  const handleRoleQuickSelect = (email, pass = "demo") => {
    setForm({ email, password: pass });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(res)) {
      const user = res.payload?.user || res.payload?.data?.user || res.payload;
      const role = user?.role || "customer";
      if (role === "admin") navigate("/admin");
      else if (role === "vendor") navigate("/vendor");
      else navigate("/account");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-surface">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Monogram Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary-container text-white flex items-center justify-center font-serif-caslon font-bold text-2xl shadow-sm">
            {isAdminLogin ? (
              <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
            ) : (
              "V"
            )}
          </div>
          <h2 className="font-serif-caslon tracking-widest text-primary text-xl font-bold">
            V E Y R A
          </h2>
          <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-secondary block">
            {isAdminLogin ? "Governance Control Plane" : "Multi-Vendor Marketplace"}
          </span>
          <h1 className="font-serif-caslon font-bold text-2xl sm:text-3xl text-primary-container pt-2">
            {isAdminLogin ? "Administrator Sign In" : "Welcome back to VEYRA"}
          </h1>
          <p className="font-sans text-xs text-outline max-w-xs mx-auto">
            {isAdminLogin
              ? "Enter your super administrator credentials to access the marketplace governance portal."
              : "Sign in to access your orders, saved stores, and account settings."}
          </p>
        </div>

        {/* Role Quick Switcher Pills */}
        {!isAdminLogin ? (
          <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-container space-y-2 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              Quick Sign-In
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect("customer@veyra.com", "password123")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  form.email === "customer@veyra.com"
                    ? "bg-primary-container text-white shadow-2xs"
                    : "bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-surface-container-high"
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickSelect("artisan@kaveri.com", "password123")}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  form.email === "artisan@kaveri.com"
                    ? "bg-primary-container text-white shadow-2xs"
                    : "bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-surface-container-high"
                }`}
              >
                Seller
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-2xl text-center flex items-center justify-center gap-2 text-primary font-semibold text-xs">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Super Administrator Secure Portal</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-surface-container-high shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-error-container/20 text-error text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  alternate_email
                </span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs sm:text-sm focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline">
                  Password
                </label>
                <span className="text-[11px] text-secondary hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs sm:text-sm focus:outline-hidden focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary-container text-white font-sans font-bold text-xs tracking-wider uppercase hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to VEYRA</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-outline border-t border-surface-container pt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary underline hover:text-secondary transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;