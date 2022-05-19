import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { isLogged, user, loading } = useSelector((state) => state.users);

  if (loading) {
    return <Loader />;
  }

  // console.log(logged, roleS);

  if (!loading && user) {
    return user && allowedRoles.includes(user?.role) ? (
      <Outlet />
    ) : user ? (
      <Navigate to="/" state={{ from: location }} replace />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }
};

export default PrivateRoute;
