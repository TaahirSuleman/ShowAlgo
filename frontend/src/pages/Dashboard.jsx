import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Center, Heading, Stack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  // access the user state from the UserContext
  const [user, setUser] = useState(null);

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
    <div>
      <Center
        h="100vh"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        <Stack boxShadow="md" bg="blackAlpha.900" p="20" rounded="md">
          <Heading>Welcome back</Heading>
          {user && <Heading as="h3">Hi {user.username}!</Heading>}
          <Button colorScheme="red" onClick={logout}>
            Logout
          </Button>
        </Stack>
      </Center>
    </div>
  );
}

export default Dashboard;
