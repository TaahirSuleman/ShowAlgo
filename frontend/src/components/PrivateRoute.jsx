import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("user");

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
