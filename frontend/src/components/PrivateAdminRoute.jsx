import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ element: Element, ...rest }) => {
  let user = localStorage.getItem("user");
  user = user ? JSON.parse(user) : null;

  return user && user.role === "admin" ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/" replace/>
  );
};

export default PrivateAdminRoute;
