
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ roles }) => {
  const { user, token } = useSelector((s) => s.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
