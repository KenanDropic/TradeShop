import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../customHooks/useCurrentUser";
import Loader from "./Loader";

const PrivateRoute = () => {
  const { logged, checkingStatus } = useCurrentUser();

  if (checkingStatus) {
    return <Loader />;
  }

  return logged === true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
