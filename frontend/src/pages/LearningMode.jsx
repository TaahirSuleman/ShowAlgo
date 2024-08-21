import {
  Box,
  Divider,
  Heading,
  ScaleFade,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-multi-carousel/lib/styles.css";
import {
  Bar,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Pie,
  PieChart,
} from "recharts";
import ModuleCard from "../components/ModuleCard";

function LearningMode() {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [user, setUser] = useState({
    username: "",
    _id: "",
  });
  const [sections, setSections] = useState([]);
  const [chartKey, setChartKey] = useState(0); // key to force re-render
  const [loading, setLoading] = useState(true); // state to manage loading
  const [userProgress, setUserProgress] = useState({
    user_id: "",
    sections: [
      {
        section_id: "",
        completed: false,
        levels: [
          {
            level_id: "",
            completed: false,
            difficulty: "",
          },
        ],
      },
    ],
  });
  const [totalLevels, setTotalLevels] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(0);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Fetch user's daily streak
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get(`/streak/${user._id}`);
        setStreak(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user._id) {
      fetchStreak();
    }
  }, [user._id]);

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

  // get user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user._id) {
        console.log("User ID is not defined");
        return;
      }
      try {
        const response = await axios.get(`/get-progress/${user._id}`); //  /get-progress/:userId
        setUserProgress(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user._id) {
      fetchUserProgress();
    }
  }, [user._id]);

  // function that counts the number of levels completed in a section
  const countCompletedLevels = (section) => {
    if (!section || !section.levels) {
      return 0;
    }
    let completedLevels = 0;
    section.levels.forEach((level) => {
      if (level.completed) {
        completedLevels += 1;
      }
    });
    return completedLevels;
  };

  // function that calculates the percentage of levels completed in a section
  const calculateSectionCompletion = (section) => {
    if (!section || !section.levels) {
      return 0;
    }
    const totalLevels = section.levels.length;
    const completedLevels = countCompletedLevels(section);
    return Math.floor((completedLevels / totalLevels) * 100);
  };

  useEffect(() => {
    if (userProgress.sections.length > 0) {
      calculateOverallCompletion();
    }
  }, [userProgress]);

  // function that counts total amount of levels and completed levels
  const calculateOverallCompletion = () => {
    let totalLvls = 0;
    let completedLvls = 0;
    userProgress.sections.forEach((section) => {
      totalLvls += section.levels.length;
      completedLvls += countCompletedLevels(section);
    });
    setTotalLevels(totalLvls);
    setCompletedLevels(completedLvls);
  };

  const handleSectionSelect = (sectionHeading) => {
    navigate(`/learning-mode/${sectionHeading}`);
  };

  const gradients = [
    "linear(to-br, #ec0958, #f573b2)", // pink
    "linear(to-br, #1203fa, #00e1fd)", // blue
    "linear(to-br, #ffe33f, #ff9933, #f22920)", // orange
    "linear(to-br, #fbe240, #8ff090, #0a8b75)", // green
    "linear(to-br, #f92edc, #811fee, #001af5)", // purple
    "linear(to-br, #3c4487, #8935ca, #d5359e)", // purple
    "linear(to-br, #afe35b, #31b68b, #1ba797)", // green
    "linear(to-br, #1ba797, #8ff090, #fbe240)", // green
    "linear(to-br, #0de7fa, #079ba5, #1203fa)", // cyan
    "linear(to-br, #ecb315, #ff9933, #f22920)", // orange
    "linear(to-br, #5a136e, #a90b84, #ff009c)", // pink
  ];

  // Data for Pie Chart
  const pieChartData = [
    { name: "Completed Levels", value: completedLevels, fill: "#FFBB28" },
    {
      name: "Remaining Levels",
      value: totalLevels - completedLevels,
      fill: "#8884d8",
    },
  ];

  // Generate data for charts based on userProgress
  const generateChartData = () => {
    return userProgress.sections.map((section, index) => {
      const completed = countCompletedLevels(section);
      const total = section.levels.length;
      return {
        name: `Section ${index + 1}`,
        Completed: completed,
        Remaining: total - completed,
      };
    });
  };

  const barChartData = generateChartData();

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={2} borderRadius={4} boxShadow="md">
          <Text fontSize="md" color="black">
            {payload[0].name}: {payload[0].value}
          </Text>
        </Box>
      );
    }

    return null;
  };

  // Get the current date
  const now = new Date();
  const options = {
    day: "numeric",
    month: "short",
  };
  const formattedDate = now.toLocaleDateString("en-GB", options);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Heading
        mb={10}
        fontSize={["4xl", "5xl", "6xl"]}
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

      <Divider width="80%" />

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={4}
        p={4}
        width="90%"
        height="auto"
        mb={4}
      >
        <Box
          bg="blackAlpha.800"
          borderRadius={8}
          p={4}
          display="flex"
          flexDirection="row"
          width="100%"
          height="35dvh"
        >
          <Box>
            <Text fontSize="lg" color="whiteAlpha.700">
              Daily Streak
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">
              {formattedDate}
            </Text>
          </Box>

          <Box
            ml={2}
            width="50dvh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <svg
              viewBox="0 10 511.92 511.92"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 0,
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m266.91 500.44c-168.738 0-213.822-175.898-193.443-291.147.887-5.016 7.462-6.461 10.327-2.249 8.872 13.04 16.767 31.875 29.848 30.24 19.661-2.458 33.282-175.946 149.807-224.761 3.698-1.549 7.567 1.39 7.161 5.378-5.762 56.533 28.181 137.468 88.316 137.468 34.472 0 58.058-27.512 69.844-55.142 3.58-8.393 15.843-7.335 17.896 1.556 21.031 91.082 77.25 398.657-179.756 398.657z"
                fill="#ff8f1f"
              />
              <path
                d="m207.756 330.827c3.968-3.334 9.992-1.046 10.893 4.058 2.108 11.943 9.04 32.468 31.778 32.468 27.352 0 45.914-75.264 50.782-97.399.801-3.642 4.35-6.115 8.004-5.372 68.355 13.898 101.59 235.858-48.703 235.858-109.412 0-84.625-142.839-52.754-169.613zm186.781-240.373c2.409-18.842-31.987 32.693-31.987 32.693s26.223 12.386 31.987-32.693zm-346.574 281.002c.725-8.021-9.594-29.497-11.421-20.994-4.373 20.344 10.696 29.016 11.421 20.994z"
                fill="#ffb636"
              />
              <path
                d="m323.176 348.596c-2.563-10.69-11.755 14.14-10.6 24.254 1.155 10.113 16.731 1.322 10.6-24.254z"
                fill="#ffd469"
              />
            </svg>
            <Heading
              fontSize="8xl"
              color="white"
              textAlign="center"
              letterSpacing="0.01em"
              sx={{
                zIndex: 1,
              }}
            >
              {streak}
            </Heading>
          </Box>
        </Box>

        <Box
          bg="blackAlpha.800"
          borderRadius={8}
          p={4}
          display="flex"
          flexDirection="row"
          width="100%"
          height="35dvh"
        >
          <Box>
            <Text fontSize="lg" color="whiteAlpha.700">
              Progress
            </Text>
            {!loading && (
              <Text fontSize="4xl" fontWeight="bold" color="whiteAlpha.800">
                {Math.round((completedLevels / totalLevels) * 100)}%
              </Text>
            )}
            <Text fontSize="lg" color="green.400"></Text>
          </Box>
          <Box ml={2} width="70dvh">
            {!loading && (
              <ResponsiveContainer
                key={`pie-${chartKey}`}
                width="100%"
                height="100%"
              >
                <PieChart width="100%" height="100%">
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  />
                  <Tooltip content={<CustomTooltip />} />
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
          height="35dvh"
        >
          <Box>
            <Text fontSize="lg" color="whiteAlpha.700">
              Levels Completed
            </Text>
            {!loading && (
              <Text fontSize="4xl" fontWeight="bold" color="whiteAlpha.800">
                {completedLevels}
              </Text>
            )}
          </Box>
          <Box ml={2} width="70dvh" height="100%">
            {!loading && (
              <ResponsiveContainer
                key={`bar-${chartKey}`}
                width="100%"
                height="100%"
              >
                <BarChart width="100%" height="100%" data={barChartData}>
                  <Tooltip />
                  <Bar
                    dataKey="Completed"
                    stackId="a"
                    fill="#ffc658"
                    radius={1}
                  />
                  <Bar
                    dataKey="Remaining"
                    stackId="a"
                    fill="#8884d8"
                    radius={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Box>
      </SimpleGrid>

      <Divider width="80%" />

      <Heading fontSize="5xl" mb={10} mt={10} color="whiteAlpha.800">
        Modules
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={10}>
        {sections.map((section, index) => (
          <ModuleCard
            key={section._id}
            color={gradients[index % gradients.length]}
            heading={section.heading}
            subheading={section.subheading}
            totalLevels={section.levels.length}
            completedLevels={countCompletedLevels(userProgress.sections[index])}
            completedPercentage={calculateSectionCompletion(
              userProgress.sections[index]
            )}
            onGoClick={() => handleSectionSelect(section.route)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default LearningMode;
