import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-950 text-gray-400">
    <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center">🛍️</span>
          <span className="text-xl font-extrabold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            MultiShop
          </span>
        </div>
        <p className="text-sm leading-relaxed max-w-sm">
          Multi-tenant e-commerce platform — jahan local businesses apna digital storefront
          bana sakte hain, bina kisi technical jhanjhat ke.
        </p>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Shop</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/products" className="hover:text-indigo-400 transition-colors">All Products</Link></li>
          <li><Link to="/stores" className="hover:text-indigo-400 transition-colors">Stores</Link></li>
          <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">Cart</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Sell</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Become a Seller</Link></li>
          <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/5 py-5 text-center text-xs">
      © 2025 MultiShop — Multi-Tenant E-Commerce Platform
    </div>
  </footer>
);

export default Footer;