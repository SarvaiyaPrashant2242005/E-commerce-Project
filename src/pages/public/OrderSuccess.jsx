
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart } from "../../features/cart/cartSlice";

const OrderSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => { dispatch(clearCart()); }, [dispatch]);

  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8">Order confirmation email aapke inbox me aa gaya hai. Thank you for shopping!</p>
      <Link to="/products" className="btn-primary inline-block">Continue Shopping</Link>
    </div>
  );
};

export default OrderSuccess;