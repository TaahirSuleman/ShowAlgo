import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  Image,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import ProgressChart from "../components/ProgressChart";
import SectionCard from "../components/SectionCard";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  LineChart,
  Line,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  PieChart,
} from "recharts";

function LearningMode() {
  const navigate = useNavigate();
  // access the user state from the UserContext
  const [user, setUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [levels, setLevels] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Fetch all sections
    const fetchSections = async () => {
      try {
        const response = await axios.get("/sections");
        setSections(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSections();
  }, []);

  //TODO: Fix get user progress and logic behind it
  // useEffect(() => {
  //   // Fetch user progress
  //   const fetchProgress = async () => {
  //     try {
  //       const response = await axios.get(`/users/${user._id}/progress`);
  //       setProgress(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   if (user) {
  //     fetchProgress();
  //   }
  // }, [user]);

  useEffect(() => {
    // Fetch levels for the selected section
    const fetchLevels = async () => {
      try {
        const response = await axios.get(
          `/sections/${selectedSectionId}/levels`
        );
        setLevels(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedSectionId) {
      fetchLevels();
    }
  }, [selectedSectionId]);

  // update progress
  useEffect(() => {
    const updateProgress = async () => {
      try {
        await axios.put("/progress", {
          userId: user._id,
          sectionId: selectedSectionId,
          levelId: selectedLevelId,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedSectionId && selectedLevelId) {
      updateProgress();
    }
  }, [selectedSectionId, selectedLevelId]);

  const colors = [
    "red.500",
    "orange.400",
    "blue.400",
    "teal.500",
    "green.500",
    "cyan.500",
    "purple.500",
    "pink.500",
    "yellow.500",
    "gray.500",
  ];

  const pieColors = ['#82ca9d', '#8884d8', '#a4de6c', '#d0ed57'];

  const data = [
    {
      name: "1",
      levelsCompleted: 2400,
      totalLevels: 2400,
    },
    {
      name: "2",
      levelsCompleted: 1398,
      totalLevels: 2210,
    },
    {
      name: "3",
      levelsCompleted: 9800,
      totalLevels: 2290,
    },
    {
      name: "4",
      levelsCompleted: 3908,
      totalLevels: 2000,
    },
    {
      name: "5",
      levelsCompleted: 4800,
      totalLevels: 2181,
    },
    {
      name: "6",
      levelsCompleted: 3800,
      totalLevels: 2500,
    },
    {
      name: "7",
      levelsCompleted: 4300,
      totalLevels: 2100,
    },
  ];

  const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 278 },
    { name: "Group F", value: 189 },
  ];

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 1024, min: 0 },
      items: 1,
    },
  };

  return (
    <div>
      <NavBar />
      <Center
        h="100%"
        w="100%"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        {user ? (
          <Heading mb={10} mt={20} fontSize="6xl" p={2}>
            Welcome back {user.username}!{" "}
          </Heading>
        ) : (
          <Heading mb={10} mt={20} fontSize="6xl">
            {" "}
            Welcome Guest!
          </Heading>
        )}

        {/* <HStack>
            <Card maxW="sm">
              <CardBody>
                <Box w="40vh" h="40vh" borderRadius="lg">
                  <ProgressChart />
                </Box>
                <Stack mt="6" spacing="3">
                  <Heading size="md">Points</Heading>
                </Stack>
              </CardBody>
            </Card>

            <Card maxW="sm">
              <CardBody>
                <Box w="40vh" h="40vh" borderRadius="lg">
                  <ProgressChart />
                </Box>
                <Stack mt="6" spacing="3">
                  <Heading size="md">Points</Heading>
                </Stack>
              </CardBody>
            </Card>

            <Card maxW="sm">
              <CardBody>
                <Box w="40vh" h="40vh" borderRadius="lg">
                  <ProgressChart />
                </Box>
                <Stack mt="6" spacing="3">
                  <Heading size="md">Points</Heading>
                </Stack>
              </CardBody>
            </Card>

            <Card maxW="sm">
              <CardBody>
                <Box w="40vh" h="40vh" borderRadius="lg">
                  <ProgressChart />
                </Box>
                <Stack mt="6" spacing="3">
                  <Heading size="md">Points</Heading>
                </Stack>
              </CardBody>
            </Card>
          </HStack> */}

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={4}
          p={4}
          width="90%"
          height="40vh"
        >
          <Box
            bg="blackAlpha.800"
            borderRadius={8}
            p={4}
            display="flex"
            flexDirection="row"
            width="100%"
          >
            <Box>
              <Text fontSize="lg" color="whiteAlpha.700">
                Points
              </Text>
              <Text fontSize="4xl" fontWeight="bold" color="whiteAlpha.800">
                200
              </Text>
              <Text fontSize="lg" color="green.400">
                +50%
              </Text>
            </Box>
            <Box ml={2} width="70dvh">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart width={300} height={100} data={data}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="0.9">
                      <stop offset="0%" stopColor="#8884d8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="levelsCompleted"
                    stroke="#8884d8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box
            bg="blackAlpha.800"
            borderRadius={8}
            p={4}
            display="flex"
            flexDirection="row"
            width="100%"
          >
            <Box>
              <Text fontSize="lg" color="whiteAlpha.700">
                Progress
              </Text>
              <Text fontSize="4xl" fontWeight="bold" color="whiteAlpha.800">
                76%
              </Text>
              <Text fontSize="lg" color="green.400">
              </Text>
            </Box>
            <Box ml={2} width="70dvh">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width="100%" height="100%">
                  <Pie
                    dataKey="value"
                    data={data01}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="100%"
                    fill="#ffc658"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box
            bg="blackAlpha.800"
            borderRadius={8}
            p={4}
            display="flex"
            flexDirection="row"
            width="100%"
          >
            <Box>
              <Text fontSize="lg" color="whiteAlpha.700">
                Levels Completed
              </Text>
              <Text fontSize="4xl" fontWeight="bold" color="whiteAlpha.800">
                10
              </Text>
            </Box>
            <Box ml={2} width="70dvh" height="100%">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width="100%" height="100%" data={data}>
                  <Tooltip />
                  <Bar
                    dataKey="levelsCompleted"
                    stackId="a"
                    fill="#ffc658"
                    radius={1}
                  />
                  <Bar
                    dataKey="totalLevels"
                    stackId="a"
                    fill="#8884d8"
                    radius={1}
                  />
                  <Bar dataKey="uv" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </SimpleGrid>

        <Heading mb={10} mt={20}>
          Select a section to start learning
        </Heading>

        <Box
          height="60vh"
          width="79%"
          alignContent="center"
          justifyContent="center"
          borderRadius={10}
          p={4}
          mb={10}
          bg="blackAlpha.800"
        >
          <Carousel responsive={responsive} showDots>
            {/* {sections.map((section, index) => (
              <SectionCard
                key={section._id}
                bgColor={colors[index % colors.length]}
                heading={section.heading}
                subheading={section.subheading}
                totalLevels={section.levels.length}
                // completedLevels={
                //   progress.filter((p) => p.section_id === section._id).length
                // }
                // completedPercentage={
                //   (
                //     (progress.filter((p) => p.section_id === section._id).length /
                //       section.levels.length) *
                //     100
                //   ).toFixed(0)
                // }
                completedLevels={1}
                completedPercentage={25}
                onClick={() => setSelectedSectionId(section._id)}
              />
            ))} */}

            <SectionCard
              heading="Introduction to Control Structures"
              subheading="Programming Language"
              totalLevels={10}
              completedLevels={10}
              completedPercentage={100}
              bgColor="red.500"
            />
            <SectionCard
              heading="Introduction to Control Structures"
              subheading="Programming Language"
              totalLevels={5}
              completedLevels={3}
              completedPercentage={60}
              bgColor="blue.500"
            />
            <SectionCard
              heading="Introduction to Control Structures"
              subheading="Programming Language"
              totalLevels={12}
              completedLevels={4}
              completedPercentage={24}
              bgColor="green.500"
            />
            <SectionCard
              heading="Introduction to Control Structures"
              subheading="Programming Language"
              totalLevels={5}
              completedLevels={3}
              completedPercentage={60}
              bgColor="blue.500"
            />
            <SectionCard
              heading="Introduction to Control Structures"
              subheading="Programming Language"
              totalLevels={12}
              completedLevels={4}
              completedPercentage={24}
              bgColor="green.500"
            />
          </Carousel>
        </Box>
      </Center>
    </div>
  );
}

export default LearningMode;
