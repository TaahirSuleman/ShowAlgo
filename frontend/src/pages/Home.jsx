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
<iframe src="https://scribehow.com/embed/Course_Convener_User_Manual__c2FEnihoQtOBS1B-WefBEA" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
export default Home;
