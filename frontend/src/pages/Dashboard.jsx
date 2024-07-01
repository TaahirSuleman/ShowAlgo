import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Center, Heading, Stack } from "@chakra-ui/react";

function Dashboard() {
  // access the user state from the UserContext
  // const {user} = useContext(UserContext)

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      {/* <h1>Dashboard</h1>
      {!!user && <h2>Hi {user.username}!</h2>} */}
      <Center
        h="100vh"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        <Stack boxShadow="md" bg="blackAlpha.900" p="20" rounded="md">
        <Heading>Welcome back</Heading>
        {user && <Heading as="h3">Hi {user.username}!</Heading>}
        </Stack>

      </Center>
    </div>
  );
}

export default Dashboard;
