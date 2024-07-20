import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Tooltip,
  Pie,
  PieChart,
} from "recharts";

function LearningMode() {
  const navigate = useNavigate();
  // access the user state from the UserContext
  const [user, setUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [chartKey, setChartKey] = useState(0); // key to force re-render
  const [loading, setLoading] = useState(true); // state to manage loading

  //TODO: const [progress, setProgress] = useState([]);

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

  // Force re-render of charts on component mount
  useEffect(() => {
    if (sections.length > 0) {
      setLoading(true);
      setTimeout(() => {
        setChartKey((prevKey) => prevKey + 1);
        setLoading(false);
      }, 100); // Delay to ensure charts are rendered with animation
    }
  }, [sections]);

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

  // TODO
  // update progress
  // useEffect(() => {
  //   const updateProgress = async () => {
  //     try {
  //       await axios.put("/progress", {
  //         userId: user._id,
  //         sectionId: selectedSection._id,
  //         levelId: selectedLevelId,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   if (selectedSection._id && selectedLevelId) {
  //     updateProgress();
  //   }
  // }, [selectedSection._id, selectedLevelId]);

  const handleSectionSelect = (sectionHeading) => {
    navigate(`/learning-mode/${sectionHeading}`);
  };

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

  const data = [
    {
      name: "1",
      Completed: 3,
      Total: 3,
    },
    {
      name: "2",
      Completed: 4,
      Total: 5,
    },
    {
      name: "3",
      Completed: 1,
      Total: 3,
    },
    {
      name: "4",
      Completed: 6,
      Total: 7,
    },
    {
      name: "5",
      Completed: 3,
      Total: 4,
    },
    {
      name: "6",
      Completed: 4,
      Total: 8,
    },
    {
      name: "7",
      Completed: 2,
      Total: 8,
    },
  ];

  const data01 = [
    { name: "Group A", value: 400, fill: "#8884d8" },
    { name: "Group B", value: 300, fill: "#FFBB28" },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 1024, min: 0 },
      items: 1,
    },
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {user ? (
        <Heading
          mb={10}
          fontSize="6xl"
          mt={10}
          p={2}
          textAlign="center"
          color="whiteAlpha.700"
        >
          Welcome back,{" "}
          <Text as="span" color="whiteAlpha.900">
            {user.username}!
          </Text>
        </Heading>
      ) : (
        <Heading mb={10} fontSize="6xl" textAlign="center">
          Welcome Guest!
        </Heading>
      )}

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={4}
        p={4}
        width="90%"
        height="40vh"
        mb={4}
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
          {!loading && (
            <ResponsiveContainer key={`area-${chartKey}`} width="100%" height="100%">
              <AreaChart width={300} height={100} data={data}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="0.9">
                    <stop offset="0%" stopColor="#8884d8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="Completed"
                  stroke="#8884d8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart> 
            </ResponsiveContainer>
            )}
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
            <Text fontSize="lg" color="green.400"></Text>
          </Box>
          <Box ml={2} width="70dvh">
            {!loading && (
            <ResponsiveContainer key={`pie-${chartKey}`} width="100%" height="100%">
              <PieChart width="100%" height="100%">
                <Pie
                  dataKey="value"
                  data={data01}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  stroke="none"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            )}
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
            {!loading && (
            <ResponsiveContainer key={`bar-${chartKey}`} width="100%" height="100%">
              <BarChart width="100%" height="100%" data={data}>
                <Tooltip />
                <Bar
                  dataKey="Completed"
                  stackId="a"
                  fill="#ffc658"
                  radius={1}
                />
                <Bar dataKey="Total" stackId="a" fill="#8884d8" radius={1} />
                <Bar dataKey="uv" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
            )}
          </Box>
        </Box>
      </SimpleGrid>

      {/* <Heading mb={10} mt={20}> */}
      <Heading
        mb={{ base: "20px", md: "40px" }}
        mt={{ base: "200px", md: "40px" }}
      >
        Select a Module
      </Heading>

      <Box
        height="60vh"
        width={{ md: "79%", base: "90%" }}
        alignContent="center"
        justifyContent="center"
        borderRadius={10}
        pb={5}
        pt={5}
        pl={5}
        bg="blackAlpha.800"
      >
        <Carousel responsive={responsive} showDots>
          {sections.map((section, index) => (
            <SectionCard
              key={section._id}
              bgColor={colors[index % colors.length]}
              heading={section.heading}
              subheading={section.subheading}
              Total={section.levels.length}
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
              onClick={() => handleSectionSelect(section.route)}
            />
          ))}
        </Carousel>
      </Box>
    </Box>
  );
}

export default LearningMode;
