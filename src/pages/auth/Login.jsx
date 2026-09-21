import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authSlice";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(res)) {
      const { role } = res.payload.user;
      navigate(role === "admin" ? "/admin" : role === "vendor" ? "/vendor" : "/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30 mb-5">
            🛍️
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome back 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Apne MultiShop account me login karo</p>
        </div>

        <div className="card p-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {error && <div className="alert-error mb-5"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@example.com" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <input className="input" type="password" placeholder="••••••••" required
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-500">
            New here? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;