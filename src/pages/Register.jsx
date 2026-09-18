
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-[#f5f8f5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl grid md:grid-cols-2">

        {/* Left Side */}
        <div className="bg-gradient-to-br from-[#173f2e] to-[#287653] text-white p-8 md:p-12">
          <Link to="/" className="text-2xl font-extrabold">
           Mutli<br></br>Ecommerce-<span className="text-[#91d3a9]">Platform</span>
          </Link>

          <div className="mt-12">
            <p className="text-[#9edab1] text-xs font-bold tracking-[2px]">
              JOIN OUR COMMUNITY
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-4">
              Your next
              <br />
              great find
              <br />
              starts here.
            </h1>

            <p className="text-[#d4e5da] text-sm leading-7 mt-5 max-w-sm">
              Create your account and discover a simpler, more enjoyable
              shopping experience.
            </p>
          </div>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                🛍️
              </div>
              <div>
                <h3 className="text-sm font-bold">Discover More</h3>
                <p className="text-xs text-[#bcd3c4] mt-1">
                  Explore products for every day
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                ❤️
              </div>
              <div>
                <h3 className="text-sm font-bold">Save Your Favorites</h3>
                <p className="text-xs text-[#bcd3c4] mt-1">
                  Keep the things you love close
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                📦
              </div>
              <div>
                <h3 className="text-sm font-bold">Manage Your Orders</h3>
                <p className="text-xs text-[#bcd3c4] mt-1">
                  View and manage your purchases
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12 flex items-center">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-[#17211d]">
              Create account
            </h2>

            <p className="text-sm text-gray-500 mt-2 mb-7">
              Fill in your details to get started.
            </p>

            <form className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-bold text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/10"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="registerEmail"
                  className="block text-xs font-bold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="registerEmail"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="registerPassword"
                  className="block text-xs font-bold text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="registerPassword"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/10"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/10"
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-xs text-gray-500 leading-5">
                <input
                  type="checkbox"
                  className="mt-1 accent-[#176b4d]"
                />
                <span>
                  I agree to the{" "}
                  <a href="#terms" className="text-[#176b4d] font-semibold">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" className="text-[#176b4d] font-semibold">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-[#176b4d] text-white text-sm font-bold hover:bg-[#10543b] transition"
              >
                Create Account →
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              Already have an account?
              <Link
                to="/login"
                className="text-[#176b4d] font-bold ml-1"
              >
                Sign in
              </Link>
            </p>

            <Link
              to="/"
              className="block text-center text-xs text-gray-400 mt-4 hover:text-[#176b4d]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;