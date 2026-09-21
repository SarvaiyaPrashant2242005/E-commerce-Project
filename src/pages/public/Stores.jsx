import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const Stores = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    api.get("/stores").then(({ data }) => setStores(Array.isArray(data) ? data : data.stores || [])).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Stores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((s) => (
          <Link key={s._id} to={`/products?store=${s._id}`} className="card hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">🏪 {s.name}</h3>
            <p className="text-sm text-gray-500">{s.productsCount || 0} products</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stores;