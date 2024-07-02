import { Button, Tab, TabList, Tabs, IconButton } from "@chakra-ui/react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  // access the user state from the UserContext
  const [user, setUser] = useState(null);


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
          <NavLink to="/dashboard">Dashboard</NavLink>
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
      <Button className={menuOpen ? "" : "logout"} onClick={logout} colorScheme="red">Logout</Button>
    </nav>
  );
}
