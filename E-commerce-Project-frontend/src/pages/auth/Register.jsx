// VEYRA Customer Registration
// Aligned with Google Stitch: veyra_customer_registration
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../features/auth/authSlice";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
    subscribeNewsletter: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Password criteria calculations
  const criteria = useMemo(() => {
    const pwd = form.password;
    return {
      length: pwd.length >= 8,
      digit: /\d/.test(pwd),
      capital: /[A-Z]/.test(pwd),
      symbol: /[^A-Za-z0-9]/.test(pwd),
    };
  }, [form.password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (criteria.length) score++;
    if (criteria.digit) score++;
    if (criteria.capital) score++;
    if (criteria.symbol) score++;
    return score;
  }, [criteria]);

  const strengthLabel = useMemo(() => {
    if (form.password.length === 0) return "Awaiting input";
    if (strengthScore <= 1) return "Fragile (1 of 4)";
    if (strengthScore === 2) return "Moderate (2 of 4)";
    if (strengthScore === 3) return "Robust Protection (3 of 4)";
    return "Very Strong (4 of 4)";
  }, [strengthScore, form.password]);

  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    if (!form.agreeTerms) return;

    const res = await dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone ? `+91 ${form.phone}` : "",
        password: form.password,
        role: "customer",
      })
    );

    if (registerUser.fulfilled.match(res)) {
      navigate("/account");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Top Heritage Bar */}
        <div className="w-full flex items-center justify-between pb-2">
          <Link
            to="/login"
            aria-label="Go back to login"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div className="flex flex-col items-center">
            <span className="font-serif-caslon font-bold tracking-widest text-primary text-xl">
              VEYRA
            </span>
            <span className="font-sans text-[10px] font-semibold text-secondary uppercase tracking-[0.2em] -mt-1">
              Marketplace
            </span>
          </div>
          <div className="w-10 h-10 flex items-center justify-center text-tertiary">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
        </div>

        {/* Editorial Hero Strip */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 border border-surface-container shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed mb-2.5">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
                <span className="font-sans text-[11px] font-semibold tracking-wider uppercase">
                  Customer Account
                </span>
              </div>
              <h1 className="font-serif-caslon font-bold text-2xl sm:text-3xl text-primary leading-tight">
                Create your VEYRA account
              </h1>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Create an account to discover independent stores, track orders, and checkout seamlessly.
              </p>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container-high shadow-inner border border-surface-container">
              <img
                src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=300&q=80"
                alt="Handcrafted lifestyle products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-surface-container-high shadow-xs">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-error-container/20 text-error text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="fullName"
                  className="font-sans text-xs font-semibold text-on-surface tracking-wider uppercase"
                >
                  Full Name
                </label>
                <span className="font-sans text-[11px] text-outline">As per official identification</span>
              </div>
              <div className="relative flex items-center">
                <input
                  id="fullName"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Ananya Sen"
                  className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container border border-surface-container-high transition-all"
                />
                {form.name.trim().length > 2 && (
                  <span className="absolute right-3.5 text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  </span>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="emailAddress"
                  className="font-sans text-xs font-semibold text-on-surface tracking-wider uppercase"
                >
                  Email Address
                </label>
                {form.email.includes("@") && form.email.includes(".") && (
                  <span className="font-sans text-[11px] text-tertiary flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span> Available
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  id="emailAddress"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="customer@example.com"
                  className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container border border-surface-container-high transition-all"
                />
                {form.email.includes("@") && form.email.includes(".") && (
                  <span className="absolute right-3.5 text-tertiary">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </span>
                )}
              </div>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                Order receipts and delivery tracking will be sent to this email.
              </p>
            </div>

            {/* Mobile Number (+91) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="mobileNumber"
                  className="font-sans text-xs font-semibold text-on-surface tracking-wider uppercase"
                >
                  Mobile Number
                </label>
                <span className="font-sans text-[10px] text-secondary font-bold uppercase tracking-wider">
                  SMS / WhatsApp
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-11 px-3 rounded-xl bg-surface-container text-on-surface font-sans text-xs font-bold border border-surface-container-high">
                  +91
                </div>
                <div className="relative flex-1 flex items-center">
                  <input
                    id="mobileNumber"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="98302 44109"
                    className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container border border-surface-container-high transition-all"
                  />
                  <span className="absolute right-3.5 text-outline">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </span>
                </div>
              </div>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                For delivery notifications and order updates.
              </p>
            </div>

            {/* Password with Dynamic Strength Meter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="passwordField"
                  className="font-sans text-xs font-semibold text-on-surface tracking-wider uppercase"
                >
                  Account Password
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  id="passwordField"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create secure passphrase"
                  className="w-full h-11 pl-4 pr-11 rounded-xl bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container border border-surface-container-high transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Strength Segmented Bar & Micro-Pills */}
              <div className="mt-2.5 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-sans text-[11px] text-on-surface-variant">Security Evaluation</span>
                  <span
                    className={`font-sans text-[11px] font-bold ${
                      strengthScore >= 3 ? "text-tertiary" : strengthScore === 2 ? "text-secondary" : "text-outline"
                    }`}
                  >
                    {strengthLabel}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                  <div
                    className={`rounded-full h-full transition-colors ${
                      strengthScore >= 1 ? "bg-tertiary" : "bg-surface-container-highest"
                    }`}
                  />
                  <div
                    className={`rounded-full h-full transition-colors ${
                      strengthScore >= 2 ? "bg-tertiary" : "bg-surface-container-highest"
                    }`}
                  />
                  <div
                    className={`rounded-full h-full transition-colors ${
                      strengthScore >= 3 ? "bg-tertiary" : "bg-surface-container-highest"
                    }`}
                  />
                  <div
                    className={`rounded-full h-full transition-colors ${
                      strengthScore === 4 ? "bg-tertiary" : "bg-surface-container-highest"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 mt-2.5 pt-1 border-t border-surface-container">
                  <div
                    className={`flex items-center gap-1 font-sans text-[11px] ${
                      criteria.length ? "text-tertiary font-semibold" : "text-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {criteria.length ? "check" : "fiber_manual_record"}
                    </span>
                    <span>8+ Characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-sans text-[11px] ${
                      criteria.digit ? "text-tertiary font-semibold" : "text-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {criteria.digit ? "check" : "fiber_manual_record"}
                    </span>
                    <span>Numeric Digit</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-sans text-[11px] ${
                      criteria.capital ? "text-tertiary font-semibold" : "text-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {criteria.capital ? "check" : "fiber_manual_record"}
                    </span>
                    <span>Capital Letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-sans text-[11px] ${
                      criteria.symbol ? "text-tertiary font-semibold" : "text-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {criteria.symbol ? "check" : "fiber_manual_record"}
                    </span>
                    <span>Special Symbol</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="confirmPasswordField"
                  className="font-sans text-xs font-semibold text-on-surface tracking-wider uppercase"
                >
                  Confirm Password
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  id="confirmPasswordField"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Re-enter your password"
                  className="w-full h-11 pl-4 pr-11 rounded-xl bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container border border-surface-container-high transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {form.confirmPassword.length > 0 && (
                <div
                  className={`font-sans text-[11px] mt-1.5 flex items-center gap-1 ${
                    passwordsMatch ? "text-tertiary font-semibold" : "text-error"
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {passwordsMatch ? "done_all" : "close"}
                  </span>
                  <span>{passwordsMatch ? "Passwords match perfectly" : "Passwords do not match yet"}</span>
                </div>
              )}
            </div>

            {/* Legal & Newsletter Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                  className="mt-0.5 accent-primary-container rounded cursor-pointer"
                  required
                />
                <span className="font-sans text-xs text-on-surface-variant leading-snug">
                  I agree to the VEYRA{" "}
                  <a href="#terms" className="underline text-primary font-medium">
                    Terms of Service
                  </a>
                  ,{" "}
                  <a href="#privacy" className="underline text-primary font-medium">
                    Privacy Policy
                  </a>
                  , and{" "}
                  <a href="#charter" className="underline text-primary font-medium">
                    Customer Policy
                  </a>
                  .
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.subscribeNewsletter}
                  onChange={(e) => setForm({ ...form, subscribeNewsletter: e.target.checked })}
                  className="mt-0.5 accent-primary-container rounded cursor-pointer"
                />
                <span className="font-sans text-xs text-on-surface-variant leading-snug">
                  Receive product updates, exclusive promotions, and seasonal store offers.
                </span>
              </label>
            </div>

            {/* Primary Action CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !passwordsMatch || !form.agreeTerms}
                className="w-full h-12 rounded-xl bg-primary-container text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-primary active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Creating Account..." : "Create Customer Account"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Verification Motif */}
          <div className="my-6 flex items-center justify-center gap-3">
            <span className="h-px bg-surface-container-high flex-1" />
            <div className="flex items-center gap-1.5 text-outline">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider">
                Verified Sellers
              </span>
            </div>
            <span className="h-px bg-surface-container-high flex-1" />
          </div>

          {/* Seller Registration Notice */}
          <div className="rounded-xl bg-surface-container p-4 border border-surface-container-high">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 text-on-secondary-fixed">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  storefront
                </span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-sans text-xs font-bold text-on-surface">
                  Looking to sell on VEYRA?
                </span>
                <p className="font-sans text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Seller accounts require business details and GST/verification. Public registration creates a customer account.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 font-sans text-[11px] font-bold text-secondary hover:text-on-secondary-container mt-2 group"
                >
                  <span>Sign In as Demo Seller</span>
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="font-sans text-xs text-on-surface-variant">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-primary underline underline-offset-4 ml-1 hover:text-primary-container"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;