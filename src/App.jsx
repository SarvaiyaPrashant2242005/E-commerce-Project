import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/public/NotFound";
import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import ProductDetail from "./pages/public/ProductDetail";
import Stores from "./pages/public/Stores";
import StoreDetail from "./pages/public/StoreDetail";
import Cart from "./pages/public/Cart";
import Checkout from "./pages/public/Checkout";
import OrderSuccess from "./pages/public/OrderSuccess";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer Account Sanctuaries
import AccountOverview from "./pages/customer/AccountOverview";
import OrderHistory from "./pages/customer/OrderHistory";
import SavedAddresses from "./pages/customer/SavedAddresses";

// Vendor Dashboard
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import ProductForm from "./pages/vendor/ProductForm";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorSettings from "./pages/vendor/VendorSettings";

// Admin Dashboard
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendorApplications from "./pages/admin/AdminVendorApplications";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminProductsModeration from "./pages/admin/AdminProductsModeration";
import AdminOrdersEscrow from "./pages/admin/AdminOrdersEscrow";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <Routes>
      {/* ---------- Public & Customer Routes ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:id" element={<StoreDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Account Routes (Protected for customers, sellers, and admins) */}
        <Route element={<ProtectedRoute roles={["customer", "vendor", "admin"]} />}>
          <Route path="/account" element={<AccountOverview />} />
          <Route path="/account/orders" element={<OrderHistory />} />
          <Route path="/account/addresses" element={<SavedAddresses />} />
          <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
          <Route path="/tracking" element={<Navigate to="/account/orders" replace />} />
        </Route>

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
          <Route path="settings" element={<VendorSettings />} />
          <Route path="storefront" element={<VendorSettings />} />
        </Route>
      </Route>

      {/* ---------- Admin Routes (role: admin) ---------- */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="applications" element={<AdminVendorApplications />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="products" element={<AdminProductsModeration />} />
          <Route path="orders" element={<AdminOrdersEscrow />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;