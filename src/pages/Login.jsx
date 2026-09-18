import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen bg-[#f5f8f5] flex items-center justify-center px-4 py-10">
      
      <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl grid md:grid-cols-2">
        
        {/* Left Side */}
        <div className="bg-gradient-to-br from-[#173f2e] to-[#287653] text-white p-8 md:p-12">
          
          <Link to="/" className="text-2xl font-extrabold">
            Mutli<br></br>Ecommerce-<span className="text-[#91d3a9]">Platform</span>
          </Link>

          <div className="mt-16">
            <p className="text-[#9edab1] text-xs font-bold tracking-[2px]">
              WELCOME BACK
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-4">
              Login to your
              <br />
              account.
            </h1>

            <p className="text-[#d4e5da] text-sm leading-7 mt-5 max-w-sm">
              Access your account and continue your shopping journey.
            </p>
          </div>

          {/* Features */}
          <div className="mt-10 space-y-5">
            
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                🛍️
              </div>
              <div>
                <h3 className="text-sm font-bold">Explore Products</h3>
                <p className="text-xs text-[#bcd3c4] mt-1">
                  Discover products you'll love
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <h3 className="text-sm font-bold">Secure Shopping</h3>
                <p className="text-xs text-[#bcd3c4] mt-1">
                  Your account stays protected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                🚚
              </div>
              <div>
                <h3 className="text-sm font-bold">Track Orders</h3>
                <p className="text-xs text-[#bcd3c4] mt-1">
                  Keep an eye on your purchases
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12 flex items-center">
          <div className="w-full max-w-sm mx-auto">
            
            <h2 className="text-3xl font-bold text-[#17211d]">
              Sign in
            </h2>

            <p className="text-sm text-gray-500 mt-2 mb-8">
              Enter your details to continue.
            </p>

            <form className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-[#176b4d] font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/10"
                />
              </div>

              {/* Remember */}
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  className="accent-[#176b4d]"
                />
                Remember me
              </label>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-[#176b4d] text-white text-sm font-bold hover:bg-[#10543b] transition"
              >
                Sign In →
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full py-3 border border-gray-200 rounded-lg flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="font-bold text-base">G</span>
              Continue with Google
            </button>

            {/* Register */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Don't have an account?
              <Link
                to="/register"
                className="text-[#176b4d] font-bold ml-1"
              >
                Create an account
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

export default Login;