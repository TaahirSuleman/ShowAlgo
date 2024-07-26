// Layout.jsx
import React from "react";
import PropTypes from "prop-types";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import GuestNavBar from "./GuestNavBar";

const Layout = ({ navBar = "normal" }) => {
  return (
    <>
      {navBar === "normal" && <NavBar />}
      {navBar === "guest" && <GuestNavBar />}
      <Box
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        minHeight="100dvh"
        pb={4}
      >
        <Outlet />
      </Box>
    </>
  );
};

Layout.propTypes = {
  navBar: PropTypes.oneOf(["normal", "guest"]),
};

export default Layout;
