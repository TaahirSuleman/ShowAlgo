import { Button, Center, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <Center
        h="100vh"
        p="10"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        <Heading>Welcome to ShowAlgo.</Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae
          praesentium eius pariatur.
        </Text>
        <Stack direction="row">
          <Button colorScheme="purple" onClick={() => navigate("/login")}>Log In</Button>
          <Button colorScheme="purple" onClick={() => navigate("/register")}>Create Account</Button>
        </Stack>
      </Center>
    </div>
  );
}

export default Home;
