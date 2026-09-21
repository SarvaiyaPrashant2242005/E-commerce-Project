import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../../components/ProductCard";

// Skeleton card — loading ke waqt dikhta hai
const ProductSkeleton = () => (
  <div className="card p-0 overflow-hidden">
    <div className="h-52 skeleton rounded-none" />
    <div className="p-4 space-y-2">
      <div className="h-4 skeleton w-3/4" />
      <div className="h-3 skeleton w-1/2" />
      <div className="h-5 skeleton w-1/3 mt-3" />
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("store");

  const fetchProducts = async (q = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.append("search", q);
      if (storeId) params.append("store", storeId);
      const { data } = await api.get(`/products${params.toString() ? `?${params}` : ""}`);
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch {
      // ✅ YE FIX HAI — backend band ho toh bhi crash nahi hoga
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [storeId]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <form onSubmit={(e) => { e.preventDefault(); fetchProducts(search); }} className="flex gap-2 mb-8 max-w-lg">
        <input className="input" placeholder="Search products..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 font-medium">
            {search ? `"${search}" ke liye kuch nahi mila` : "No products yet — backend chalao ya vendor bano!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Products;