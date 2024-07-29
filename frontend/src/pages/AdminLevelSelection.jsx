import {
  Box,
  Button,
  ButtonGroup,
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
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowBackIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
  MinusIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { IoMdHome } from "react-icons/io";

function AdminLevelSelection() {
  const { sectionHeading } = useParams();
  const sectionRoute = sectionHeading.toLowerCase().replace(/\s/g, "-");
  const [levels, setLevels] = React.useState([]);
  const navigate = useNavigate();
  const [section, setSection] = React.useState({
    heading: "",
    subheading: "",
    levels: [],
    route: "",
  });

  useEffect(() => {
    // Fetch levels for the selected section
    const fetchLevels = async () => {
      try {
        const response = await axios.get(`/sections/${sectionRoute}/levels`);
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
        const response = await axios.get(`/sections/${sectionRoute}`);
        setSection(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (sectionHeading) {
      fetchSection();
    }
  }, [sectionHeading]);

  const handleOnHomeClick = () => {
    navigate("/admin-dashboard");
  };

  const onViewClick = () => {
    console.log("View clicked");
  }

  const onEditClick = () => {
    console.log("Edit clicked");
  }

  const onDeleteClick = () => {
    console.log("Delete clicked");
  }


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

      <TableContainer bg="blackAlpha.800" borderRadius={10} width="85%" mt={10}>
        <Table variant="simple" size="lg">
          <Thead>
            <Tr>
              <Th>Level</Th>
              <Th>Title</Th>
              <Th>Difficulty</Th>
              <Th>Actions</Th>
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
                  <ButtonGroup width="100%">
                    <IconButton
                      icon={<ViewIcon />}
                      colorScheme="green"
                      onClick={onViewClick}
                      width="67%"
                    />
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={onEditClick}
                      width="17%"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={onDeleteClick}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminLevelSelection;
