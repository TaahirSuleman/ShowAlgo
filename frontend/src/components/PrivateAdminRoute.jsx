/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a PrivateAdminRoute component that restricts access to admin users only
 */

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ element: Element, ...rest }) => {
  let user = localStorage.getItem("user");
  user = user ? JSON.parse(user) : null;

  // Check if the user is an admin user before rendering the component
  return user && user.role === "admin" ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/" replace/>
  );
};

export default PrivateAdminRoute;
