import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../features/auth/authSlice";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "customer", storeName: "",
  });
  const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (form.role !== "vendor") delete payload.storeName;
    const res = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(res)) {
      navigate(res.payload.user.role === "vendor" ? "/vendor" : "/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30 mb-5">
            🛍️
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Shop karo ya becho — dono ke liye ek account</p>
        </div>

        <div className="card p-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {error && <div className="alert-error mb-5"><span>⚠️</span> {error}</div>}

          {/* Role Selection */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Main kya karna chahta hoon?</p>
          <div className="flex gap-2 mb-5">
            {["customer", "vendor"].map((r) => (
              <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all cursor-pointer ${
                  form.role === r
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}>
                {r === "vendor" ? "🏪 Bechna hai" : "🛍️ Khareedna hai"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" placeholder="Full Name" required
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" type="email" placeholder="Email address" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" type="password" placeholder="Password (min 6 characters)" required minLength={6}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

            {form.role === "vendor" && (
              <div className="animate-fade-up">
                <input className="input" placeholder="🏪 Store ka naam (e.g. Sharma Electronics)" required
                  value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
                <p className="text-xs text-gray-400 mt-1.5">Ye tumhare dukaan ka naam hoga jo customers ko dikhega</p>
              </div>
            )}

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account..." : form.role === "vendor" ? "🏪 Store Banao →" : "Create Account →"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;