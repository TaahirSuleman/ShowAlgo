// Layout.jsx
import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const Layout = () => {
  return (
    <>
      <NavBar />
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

export default Layout;
