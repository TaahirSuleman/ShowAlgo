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
import SectionCard from "../components/SectionCard";
import axios from "axios";

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
    "gray.500"
  ]

  return (
    <div>
      <NavBar />
      <Center
        h="100vh"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        {user ? (
          <Heading mb={6}>Welcome back {user.username}! </Heading>
        ) : (
          <Heading mb={6}> Welcome Guest!</Heading>
        )}

        <SimpleGrid columns={sections.length} spacing={2}>
          {sections.map((section, index) => (
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
              completedPercentage={76}
              onClick={() => setSelectedSectionId(section._id)}
            />
          ))}
        </SimpleGrid>
      </Center>
    </div>
  );
}

export default LearningMode;
