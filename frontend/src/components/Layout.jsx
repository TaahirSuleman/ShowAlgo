/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a Layout component that wraps the application
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { Box, Button, IconButton } from "@chakra-ui/react";
import GuestNavBar from "./GuestNavBar";
import { FaArrowUp } from "react-icons/fa";

const Layout = ({ navBar = "normal" }) => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Show "back to menu" button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const navBarHeight = document.querySelector("nav")?.offsetHeight || 0;
      if (window.scrollY > navBarHeight) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {navBar === "normal" && <NavBar />}
      {navBar === "guest" && <GuestNavBar />}
      {navBar === "none" && null}
      <Box
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        minHeight="100dvh"
        pb={4}
        position="relative"
      >
        <Outlet />
        {showScrollButton && (
          <Button
            leftIcon={<FaArrowUp />}
            onClick={scrollToTop}
            position="fixed"
            top="20px"
            right="20px"
            textColor="whiteAlpha.900"
            bg="blackAlpha.500"
            aria-label="Scroll to top"
            size="sm"
          >
            Menu
          </Button>
        )}
      </Box>
    </>
  );
};

Layout.propTypes = {
  navBar: PropTypes.oneOf(["normal", "guest", "none"]),
};

export default Layout;
