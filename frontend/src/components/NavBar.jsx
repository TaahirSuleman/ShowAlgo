import {
  Button,
  Tab,
  TabList,
  Tabs,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import { useEffect, useRef, useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // access the user state from the UserContext
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const cancelRef = useRef();

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Logout function
  const logout = async () => {
    try {
      // Send a POST request to the logout endpoint
      await axios.post("/logout").then(() => {
        // Clear user data from localStorage
        localStorage.removeItem("user");
        // Reset user state
        setUser(null);
        // Redirect to home page
        navigate("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutDialogOpen(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <nav>
      <Link to="/" className="title">
        ShowAlgo
      </Link>
      <IconButton
        aria-label="Menu"
        icon={<HamburgerIcon />}
        onClick={handleMenu}
        className="menu"
      />

      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/ide">IDE</NavLink>
        </li>
        <li>
          <NavLink to="/learning-mode">Learning Mode</NavLink>
        </li>
        <li>
          <NavLink to="/documentation">Documentation</NavLink>
        </li>
      </ul>
      <Button
        className={menuOpen ? "" : "logout"}
        onClick={handleLogoutClick}
        bg="gray.800"
        sx={{
          _hover: {
            bg: "red.400",
          },
        }}
      >
        Logout
      </Button>

      <AlertDialog
        isOpen={isLogoutDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleLogoutCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to logout?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleLogoutCancel}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogoutConfirm} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </nav>
  );
}
