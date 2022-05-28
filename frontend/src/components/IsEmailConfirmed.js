import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";

const IsEmailConfirmed = () => {
  const { user, loading } = useSelector((state) => state.users);

  if (loading) {
    return <Loader />;
  }
  if (!loading) {
    return user && user?.isEmailConfirmed ? (
      <Outlet />
    ) : (
      <>
        {toast.info("Molimo Vas podvrdite vaš email!")}
        <Navigate to="/" />
      </>
    );
  }
};

export default IsEmailConfirmed;
