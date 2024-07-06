import { Center, Heading, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom';

function LearningMode() {
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

  return (
    <div>
      <NavBar/>
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

export default LearningMode