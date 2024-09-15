/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a PrivateRoute component that restricts access to authenticated users only
 */

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("user");

  // Check if the user is authenticated before rendering the component
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
