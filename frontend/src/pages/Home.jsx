/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the Home page which is the initial page for the user to interact with the application
 */

import { Box, Button, Center, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <Center p="10" flexDirection="column" height="95dvh">
      <Heading mb="6">Welcome to ShowAlgo.</Heading>
      <Stack direction="row">
        <Button colorScheme="purple" onClick={() => navigate("/login")}>
          Log In
        </Button>
        <Button colorScheme="purple" onClick={() => navigate("/register")}>
          Create Account
        </Button>
        <Button colorScheme="purple" onClick={() => navigate("/guest-ide")}>
          Guest
        </Button>
      </Stack>
    </Center>
  );
}

export default Home;
