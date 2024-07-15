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

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
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
          <Heading mb={10} mt={20} fontSize="6xl">Welcome back {user.username}! </Heading>
        ) : (
          <Heading mb={10} mt={20} fontSize="6xl"> Welcome Guest!</Heading>
        )}

        <HStack>
          <Card maxW="sm">
            <CardBody>
              <Box
                w="40vh"
                h="40vh"
                borderRadius="lg"
              >
                <ProgressChart />
              </Box>
              <Stack mt="6" spacing="3">
                <Heading size="md">Points</Heading>
                </Stack>
            </CardBody>
          </Card>

          <Card maxW="sm">
            <CardBody>
              <Box
                w="40vh"
                h="40vh"
                borderRadius="lg"
              >
                <ProgressChart />
              </Box>
              <Stack mt="6" spacing="3">
                <Heading size="md">Points</Heading>
                </Stack>
            </CardBody>
          </Card>

          <Card maxW="sm">
            <CardBody>
              <Box
                w="40vh"
                h="40vh"
                borderRadius="lg"
              >
                <ProgressChart />
              </Box>
              <Stack mt="6" spacing="3">
                <Heading size="md">Points</Heading>
                </Stack>
            </CardBody>
          </Card>

          <Card maxW="sm">
            <CardBody>
              <Box
                w="40vh"
                h="40vh"
                borderRadius="lg"
              >
                <ProgressChart />
              </Box>
              <Stack mt="6" spacing="3">
                <Heading size="md">Points</Heading>
                </Stack>
            </CardBody>
          </Card>
          
        </HStack>

        <Heading mb={10} mt={20}>Select a section to start learning</Heading>

        <Box
          height="60vh"
          width="80%"
          alignContent="center"
          justifyContent="center"
          borderRadius={10}
          p={4}
        >
          <Carousel
            responsive={responsive}
            showDots
            containerClass="container-with-dots"
          >
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
