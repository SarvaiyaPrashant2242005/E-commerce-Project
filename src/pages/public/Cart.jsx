import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../../features/cart/cartSlice";

const Cart = () => {
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);

  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-xl mb-4">Your cart is empty 🛒</p>
        <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="card flex items-center gap-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.storeName}</p>
              <p className="text-indigo-600 font-bold">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-qty"
                onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))}>-</button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button className="btn-qty"
                onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.min(item.stock, item.quantity + 1) }))}>+</button>
            </div>
            <button onClick={() => dispatch(removeFromCart(item.productId))} className="text-red-500 text-xl">🗑</button>
          </div>
        ))}
      </div>

      <div className="card h-fit">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between mb-2"><span>Shipping</span><span className="text-green-600">Free</span></div>
        <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>₹{subtotal}</span></div>
        <button onClick={() => navigate("/checkout")} className="btn-primary w-full mt-4">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
