import {
  Box,
  Center,
  Heading,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import ProgressChart from "../components/ProgressChart";


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

  const courses = [
    {
      title: "Data Structures and Algorithms",
      chapters: 13,
      items: 149,
      progress: 0,
      color: "purple",
    },
    {
      title: "System Design for Interviews",
      chapters: 16,
      items: 81,
      progress: 0,
      color: "green",
    },
    {
      title: "The LeetCode Beginner's Guide",
      chapters: 4,
      items: 17,
      progress: 0,
      color: "orange",
    },
  ];

  return (
    <div>
      <NavBar />
      <Center
        h="100vh"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        {/* <Stack boxShadow="md" bg="blackAlpha.900" p="20" rounded="md">
          <Heading>Welcome back</Heading>
          {user && <Heading as="h3">Hi {user.username}!</Heading>}
        </Stack> */}

        {/* <Stack spacing={4} maxW="600px" w="full" align="center">
          <Card boxShadow="md" p="6" rounded="md" bg="blackAlpha.900">
            <Heading size="md">Your Progress</Heading>
            <Text>75% completed</Text>
              <Progress value={75} size="sm" colorScheme="green" mt="4" />
          </Card>

          <Card boxShadow="md" p="6" rounded="md" bg="blackAlpha.900">
            <Heading size="md">Levels Completed</Heading>
            <Text>5 out of 10</Text>
          </Card>

          <Card boxShadow="md" p="6" rounded="md" bg="blackAlpha.900">
            <Heading size="md">Select Level</Heading>
            <Select placeholder="Select level" mt="4">
              <option value="level1">Level 1</option>
              <option value="level2">Level 2</option>
              <option value="level3">Level 3</option>
            </Select>
          </Card>
        </Stack> */}
          <Heading mb={6}>Main Dashboard</Heading>
          <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={10} mb={6}>
            {courses.map((course, index) => (
              <Card key={index} course={course} />
            ))}
          </SimpleGrid>
          <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
            <ProgressChart />
          </Box>
      </Center>
    </div>
  );
}

export default LearningMode;
