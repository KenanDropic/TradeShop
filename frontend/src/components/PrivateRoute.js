import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.users);

  if (loading) {
    return <Loader />;
  }

  if (!loading) {
    return user && allowedRoles.includes(user?.role) ? (
      <Outlet />
    ) : user ? (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }
};

export default PrivateRoute;
