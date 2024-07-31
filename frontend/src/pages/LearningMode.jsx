import { Box, Divider, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import ModuleCard from "../components/ModuleCard";

function LearningMode() {
  const navigate = useNavigate();
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
        completion_time: "",
        levelsCompleted: 0,
        levels: [
          {
            level_id: "",
            completed: false,
            completion_time: "",
            points: 0,
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
    console.log("Total levels: ", totalLvls);
    console.log("Completed levels: ", completedLvls);
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

  // dummy data for charts
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

  // dummy data for pie chart
  const data01 = [
    { name: "Group A", value: { totalLevels }, fill: "#8884d8" },
    { name: "Group B", value: { completedLevels }, fill: "#FFBB28" },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
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

      <Divider width="80%" />

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
              <ResponsiveContainer
                key={`area-${chartKey}`}
                width="100%"
                height="100%"
              >
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
              <ResponsiveContainer
                key={`pie-${chartKey}`}
                width="100%"
                height="100%"
              >
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
              <ResponsiveContainer
                key={`bar-${chartKey}`}
                width="100%"
                height="100%"
              >
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

      <Divider width="80%" />

      <Heading fontSize="5xl" mb={10} mt={10} color="whiteAlpha.800">
        Modules
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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
