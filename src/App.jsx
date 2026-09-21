import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/public/NotFound";
import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import ProductDetail from "./pages/public/ProductDetail";
import Stores from "./pages/public/Stores";
import Cart from "./pages/public/Cart";
import Checkout from "./pages/public/Checkout";
import OrderSuccess from "./pages/public/OrderSuccess";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import ProductForm from "./pages/vendor/ProductForm";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendors from "./pages/admin/AdminVendors";

function App() {
  return (
    <Routes>
      {/* ---------- Public Routes ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="*" element={<NotFound />} />
      </Route>

      {/* ---------- Vendor Routes (role: vendor) ---------- */}

      
      <Route element={<ProtectedRoute roles={["vendor"]} />}>
        <Route path="/vendor" element={<DashboardLayout role="vendor" />}>
          <Route index element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="analytics" element={<VendorAnalytics />} />
        </Route>
      </Route>

      {/* ---------- Admin Routes (role: admin) ---------- */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="vendors" element={<AdminVendors />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;