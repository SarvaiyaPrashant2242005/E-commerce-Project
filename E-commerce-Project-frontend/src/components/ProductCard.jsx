import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { StatusBadge } from "./common/StatusBadge";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        storeId: product.storeId?._id || product.storeId,
        storeName: product.storeId?.name || product.storeName || "",
        quantity: 1,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="card card-hover p-0 overflow-hidden group flex flex-col justify-between border border-surface-container-high hover:border-outline-variant/60"
    >
      <div className="relative overflow-hidden bg-surface-container-low aspect-4/3">
        <img
          src={product.image || "https://placehold.co/400x400/eaefed/173b35?text=VEYRA"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.category && (
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-primary-container backdrop-blur-xs shadow-xs border border-surface-container-high/60">
              {product.category}
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-2xs flex items-center justify-center">
            <StatusBadge status="out-of-stock" size="sm">Out of Stock</StatusBadge>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary flex items-center gap-1 mb-1 truncate">
            <span className="material-symbols-outlined text-[13px]">storefront</span>
            <span>{product.storeId?.name || product.storeName || "Store"}</span>
          </p>
          <h3 className="font-serif-caslon font-semibold text-base text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-surface-container">
          <p className="font-sans font-bold text-lg text-primary">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-150 cursor-pointer
              ${
                product.stock === 0
                  ? "bg-surface-container text-outline/50 cursor-not-allowed"
                  : added
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-surface-container text-primary hover:bg-primary-container hover:text-white active:scale-95"
              }`}
          >
            {added ? (
              <span className="material-symbols-outlined text-[18px]">check</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">add</span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;