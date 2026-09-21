import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    dispatch(addToCart({
      productId: product._id, name: product.name, price: product.price,
      image: product.image, stock: product.stock,
      storeId: product.storeId?._id || product.storeId,
      storeName: product.storeId?.name || product.storeName || "",
      quantity: 1,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link to={`/product/${product._id}`} className="card card-hover p-0 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.image || "https://placehold.co/400x400/eef2ff/6366f1?text=MultiShop"}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.category && (
          <span className="badge absolute top-3 left-3 bg-white/90 text-indigo-700 backdrop-blur">
            {product.category}
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="badge bg-red-500 text-white">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 font-medium mb-1 truncate">
          🏪 {product.storeId?.name || product.storeName || "Store"}
        </p>
        <h3 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ₹{product.price}
          </p>
          <button onClick={handleQuickAdd} disabled={product.stock === 0}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all
              ${product.stock === 0 ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : added ? "bg-green-100 text-green-600"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"}`}>
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;