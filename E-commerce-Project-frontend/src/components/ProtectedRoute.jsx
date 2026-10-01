
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ roles }) => {
  const { user, token } = useSelector((s) => s.auth);
  const isAdminRoute = roles && roles.includes("admin") && !roles.includes("customer");

  if (!token) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
