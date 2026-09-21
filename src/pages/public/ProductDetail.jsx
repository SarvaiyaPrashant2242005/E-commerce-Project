import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../api/axios";
import { addToCart } from "../../features/cart/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data)).catch(() => {});
  }, [id]);

  if (!product) return <p className="p-10 text-center text-gray-500">Loading product...</p>;

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      storeId: product.storeId?._id || product.storeId,
      storeName: product.storeId?.name || product.storeName || "",
      quantity: qty,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <img src={product.image || "https://placehold.co/500x500?text=No+Image"}
        alt={product.name} className="w-full rounded-xl shadow" />

      <div>
        <p className="text-sm text-gray-500 mb-1">Sold by: {product.storeId?.name || product.storeName}</p>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-3xl text-indigo-600 font-bold mb-4">₹{product.price}</p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="mb-4">
          {product.stock > 0
            ? <span className="text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
            : <span className="text-red-500 font-medium">✗ Out of Stock</span>}
        </div>

        {product.stock > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <button className="btn-qty" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button className="btn-qty" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
          </div>
        )}

        <button onClick={handleAddToCart} disabled={product.stock === 0}
          className="btn-primary w-full text-lg">
          {added ? "✓ Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
