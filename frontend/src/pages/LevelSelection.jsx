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
import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowBackIcon, CheckIcon, MinusIcon } from "@chakra-ui/icons";

function LevelSelection() {
  const { sectionHeading } = useParams();
  const [levels, setLevels] = React.useState([]);
  const [section, setSection] = React.useState({
    _id: '',
    heading: '',
    subheading: '',
    levels: [],
    __v: 0,
    route: ''
  });

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

  console.log(levels);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Heading fontSize="6xl" textAlign="center" pt={10}>
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
              <Tr>
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
                    {/* //TODO: Change this to a checkmark or minus icon based on the user's progress */}
                    {(() => {
                      const randomNum = Math.floor(Math.random() * 2);
                      return randomNum ? (
                        <CheckIcon color="green.400" />
                      ) : (
                        <MinusIcon color="gray.400" />
                      );
                    })()}
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
