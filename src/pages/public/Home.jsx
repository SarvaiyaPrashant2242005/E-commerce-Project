import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../../components/ProductCard";

const categories = [
  { icon: "👕", name: "Fashion" },
  { icon: "📱", name: "Electronics" },
  { icon: "🏠", name: "Home" },
  { icon: "💄", name: "Beauty" },
  { icon: "⚽", name: "Sports" },
  { icon: "📚", name: "Books" },
];

const stats = [
  { value: "100+", label: "Active Vendors" },
  { value: "5,000+", label: "Products" },
  { value: "50K+", label: "Customers" },
  { value: "4.8★", label: "Avg Rating" },
];

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products?limit=8")
      .then(({ data }) => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
          <span className="badge bg-white/10 text-indigo-300 border border-white/10 backdrop-blur animate-fade-up">
            🚀 Multi-Vendor Marketplace
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            One Platform,
            <br />
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Multiple Stores
            </span>
          </h1>
          <p className="text-gray-400 text-lg mt-6 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Shop from independent vendors — ya apna store minutes me kholo. Zero technical overhead.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/products" className="btn-primary btn-lg">🛒 Shop Now</Link>
            <Link to="/register" className="btn-ghost btn-lg">🏪 Become a Seller</Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {stats.map((s) => (
            <div key={s.label} className="py-8 text-center">
              <p className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-extrabold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link key={c.name} to={`/products?search=${c.name}`}
              className="card card-hover p-0 flex flex-col items-center py-6 gap-2 group">
              <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{c.icon}</span>
              <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold">Featured Products</h2>
            <p className="text-sm text-gray-400 mt-1">Fresh picks from our vendors</p>
          </div>
          <Link to="/products" className="text-indigo-600 font-semibold text-sm hover:underline">View all →</Link>
        </div>

        {products.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4 animate-float">📦</div>
            <p className="text-gray-500 font-medium">No products yet — pehla vendor bano aur listing shuru karo!</p>
            <Link to="/register" className="btn-primary mt-6">Start Selling</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ===== SELLER CTA ===== */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-10 md:p-16 text-center">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"></div>
          <div className="relative">
            <h2 className="text-3xl font-extrabold">Apna Online Store Kholo 🚀</h2>
            <p className="text-gray-400 mt-3 max-w-md mx-auto">
              Registration free hai. Products list karo, orders manage karo, analytics dekho — sab ek platform par.
            </p>
            <Link to="/register" className="btn-primary btn-lg mt-8">Become a Seller →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;