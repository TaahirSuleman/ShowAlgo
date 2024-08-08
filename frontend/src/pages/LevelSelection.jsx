import {
  Box,
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowBackIcon, CheckIcon, MinusIcon } from "@chakra-ui/icons";
import { IoMdHome } from "react-icons/io";

function LevelSelection() {
  const navigate = useNavigate();
  const { sectionHeading } = useParams();
  const [levels, setLevels] = useState([]);
  const [user, setUser] = useState({
    username: "",
    _id: "",
  });
  const [section, setSection] = useState({
    _id: "",
    heading: "",
    subheading: "",
    levels: [],
    __v: 0,
    route: "",
  });
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
  const [sectionProgress, setSectionProgress] = useState({
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
  });
  const [levelProgress, setLevelProgress] = useState({
    level_id: "",
    completed: false,
    completion_time: "",
    points: 0,
    difficulty: "",
  });

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Fetch levels for the selected section
    const fetchLevels = async () => {
      try {
        const response = await axios.get(`/sections/${sectionHeading}/levels`);
        setLevels(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (sectionHeading) {
      fetchLevels();
    }
  }, [sectionHeading]);

  useEffect(() => {
    // Fetch section details
    const fetchSection = async () => {
      try {
        const response = await axios.get(`/sections/${sectionHeading}`);
        setSection(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (sectionHeading) {
      fetchSection();
    }
  }, [sectionHeading]);

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

  // get section progress
  useEffect(() => {
    if (!userProgress || !userProgress.sections.length) {
      console.log("User progress is not defined");
      return;
    }
    const getSectionProgress = userProgress.sections.find(
      (sections) => sections.section_id === section._id
    );
    if (getSectionProgress) {
      setSectionProgress(getSectionProgress);
    }
  }, [userProgress, section._id]);

  // get all the levels progress for the section
  useEffect(() => {
    if (!sectionProgress || !sectionProgress.levels.length) {
      console.log("Section progress is not defined");
      return;
    }
    const getLevelProgress = sectionProgress.levels;
    if (getLevelProgress) {
      setLevelProgress(getLevelProgress);
    }
  }, [sectionProgress]);

  const handleOnHomeClick = () => {
    navigate("/learning-mode");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <IconButton
        icon={<IoMdHome />}
        mt={10}
        color="white"
        bg="black"
        onClick={handleOnHomeClick}
      />

      <Heading fontSize="6xl" textAlign="center">
        {section.heading}
      </Heading>
      <Heading fontSize="2xl" color="whiteAlpha.700" textAlign="center" pt={3}>
        {section.subheading}
      </Heading>

      <TableContainer bg="blackAlpha.800" borderRadius={10} width="75%" mt={10}>
        <Table variant="simple" size="lg">
          <Thead>
            <Tr>
              <Th>Level</Th>
              <Th>Title</Th>
              <Th>Difficulty</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {levels.map((level) => (
              <Tr key={level._id}>
                <Td>{level.order}</Td>
                <Td>
                  <NavLink
                    to={`/learning-mode/${sectionHeading}/${level.route}`}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#9F7AEA")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                  >
                    {level.title}
                  </NavLink>
                </Td>
                <Td
                  color={
                    level.difficulty === "easy"
                      ? "green.400"
                      : level.difficulty === "medium"
                      ? "yellow.400"
                      : level.difficulty === "hard"
                      ? "red.400"
                      : "gray.400"
                  }
                >
                  {level.difficulty}
                </Td>
                <Td>
                  {levelProgress.map((progress) => {
                    if (progress.level_id === level._id) {
                      return progress.completed ? (
                        <CheckIcon color="green.400" key={progress.level_id} />
                      ) : (
                        <MinusIcon color="gray.400" key={progress.level_id} />
                      );
                    }
                  })}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default LevelSelection;
