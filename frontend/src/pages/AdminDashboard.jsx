/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the AdminDashboard page which contains the modules, user progress and documentation
 */

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Divider,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  PieChart,
  Pie,
} from "recharts";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { all } from "axios";
import "react-multi-carousel/lib/styles.css";
import ModuleCard from "../components/ModuleCard";
import { AddIcon } from "@chakra-ui/icons";
import EditModuleModal from "../components/EditModuleModal";
import DocumentationComponent from "../components/DocumentationComponent";

function AdminDashboard() {
  const navigate = useNavigate();
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const btnRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [newModule, setNewModule] = useState({
    heading: "",
    subheading: "",
    route: "",
  });
  const [user, setUser] = useState({
    username: "",
  });
  const [allUserProgress, setAllUserProgress] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [moduleBeingEdited, setModuleBeingEdited] = useState(null);

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
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSections();
  }, []);

  // get all user progress
  useEffect(() => {
    const fetchAllUserProgress = async () => {
      try {
        const response = await axios.get("/get-progress");
        const userProgressWithDetails = response.data.map((user) => {
          const userSections = user.progress.sections || [];
          const { overallProgress, totalLvls, completedLvls } =
            calculateOverallCompletion(userSections, sections);

          // Map section_id from user progress to the correct section in the state
          const progressObject = userSections.map((userSection) => {
            const matchingSection = sections.find(
              (section) => section._id === userSection.section_id
            );

            return {
              moduleName: matchingSection ? matchingSection.heading : "Unknown",
              completedLevels: countCompletedLevels(userSection),
              totalLevels: userSection.levels.length,
            };
          });

          // Create data for the bar chart
          const barChartData = progressObject.map((module) => ({
            name: module.moduleName,
            Completed: module.completedLevels,
            Remaining: module.totalLevels - module.completedLevels,
          }));

          return {
            ...user,
            overallProgress: Math.floor((completedLvls / totalLvls) * 100),
            progressObject,
            barChartData,
          };
        });

        setAllUserProgress(userProgressWithDetails);
        console.log(userProgressWithDetails);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUserProgress();
  }, [sections]);

  // function to handle the selection of a section
  const handleSectionSelect = (sectionHeading) => {
    navigate(`/admin-dashboard/${sectionHeading}`);
  };

  // function to handle the submission of a new section
  const handleNewSectionSubmit = async () => {
    if (!newModule.heading || !newModule.subheading) {
      toast({
        title: "Error",
        description: "Heading and Subheading cannot be empty.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const moduleToSubmit = {
          heading: newModule.heading,
          subheading: newModule.subheading,
          route: newModule.heading.toLowerCase().replace(/\s/g, "-"),
        };
        const response = await axios.post("/create-section", moduleToSubmit);

        if (response.data.error) {
          toast({
            title: "Error",
            description: response.data.error,
            status: "error",
            duration: 2500,
            isClosable: true,
          });
        } else {
          setSections([...sections, response.data]);
          toast({
            title: "Success",
            description: "New section created successfully.",
            status: "success",
            duration: 2500,
            isClosable: true,
          });
          onAddModalClose();
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to create new section.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setNewModule({
          heading: "",
          subheading: "",
          route: "",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  // function to handle the deletion of a section
  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await axios.delete(`/delete-section/${sectionId}`);
      if (response.data.error) {
        toast({
          title: "Error",
          description: response.data.error,
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      } else {
        setSections(sections.filter((section) => section._id !== sectionId));
        toast({
          title: "Success",
          description: "Module deleted successfully.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to delete module.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (section) => {
    setModuleBeingEdited(section);
    setIsEditing(true);
    onEditModalOpen(); // Open the modal for editing
  };

  // function to handle the saving of an edited section
  const handleEditSave = async (updatedModule) => {
    try {
      const response = await axios.put(
        `/update-section/${moduleBeingEdited._id}`,
        updatedModule
      );
      if (response.data.error) {
        toast({
          title: "Error",
          description: response.data.error,
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      } else {
        setSections(
          sections.map((section) =>
            section._id === moduleBeingEdited._id ? updatedModule : section
          )
        );
        toast({
          title: "Success",
          description: "Module updated successfully.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        onEditModalClose();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update module.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsEditing(false);
      setModuleBeingEdited(null);
      const fetchSections = async () => {
        try {
          const response = await axios.get("/sections");
          setSections(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSections();
    }
  };

  // function to handle the cancellation of editing a section
  const handleEditCancel = () => {
    setIsEditing(false);
    setModuleBeingEdited(null);
    onEditModalClose();
  };

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

  // function that calculates the overall completion of a section
  const calculateOverallCompletion = (sections = [], allSections = []) => {
    let totalLvls = 0;
    let completedLvls = 0;
    const progressObject = sections.map((section) => {
      const completedLevels = countCompletedLevels(section);
      totalLvls += section.levels.length;
      completedLvls += completedLevels;

      return {
        // moduleName: matchingSection ? matchingSection.heading : "Unknown",
        completedLevels,
        totalLevels: section.levels.length,
      };
    });
    const overallProgress =
      totalLvls > 0 ? Math.floor((completedLvls / totalLvls) * 100) : 0;
    return { overallProgress, progressObject, totalLvls, completedLvls };
  };

  // function to handle the showing of more information for a user
  const handleShowMore = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Calculate average progress
  const averageProgress = allUserProgress.length
    ? allUserProgress.reduce((acc, user) => acc + user.overallProgress, 0) /
      allUserProgress.length
    : 0;

  // Pie chart data
  const pieChartData = [
    { name: "Completed", value: Math.round(averageProgress), fill: "#FFBB28" },
    {
      name: "Remaining",
      value: Math.round(100 - averageProgress),
      fill: "#8884d8",
    },
  ];

  // Gradients for module cards
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

  // Responsive design values
  const flexDirection = useBreakpointValue({ base: "column", md: "row" });
  const boxWidth = useBreakpointValue({ base: "100%", md: "25%" });
  const pieChartWidth = useBreakpointValue({ base: "100%", md: "50%" });

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
      <Heading
        fontSize="5xl"
        mb={10}
        mt={10}
        color="whiteAlpha.800"
        textAlign="center"
      >
        Modules:
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {sections.map((section, index) => (
          <GridItem p={2} key={section._id}>
            <ModuleCard
              color={gradients[index % gradients.length]}
              heading={section.heading}
              subheading={section.subheading}
              totalLevels={section.levels ? section.levels.length : 0}
              onViewClick={() => handleSectionSelect(section.route)}
              onDeleteClick={() => handleDeleteSection(section._id)}
              onEditClick={() => handleEditClick(section)}
              type="admin"
            />
          </GridItem>
        ))}
        {isEditing && (
          <EditModuleModal
            isOpen={isEditModalOpen}
            onClose={handleEditCancel}
            module={moduleBeingEdited}
            onSave={handleEditSave}
          />
        )}
        <GridItem p={2}>
          <Card
            borderRadius={10}
            bg="whiteAlpha.300"
            border="2px dashed"
            boxShadow="lg"
          >
            <CardBody>
              <Box
                bg="transparent"
                borderRadius={6}
                height="30dvh"
                p={4}
                border="2px dashed"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <AddIcon
                  boxSize="5em"
                  border="2px dashed"
                  p={2}
                  borderRadius="50%"
                />
              </Box>

              <Divider bg="white" mt={5} />

              <Box height="7dvh" />

              <Stack mt="6" spacing="5">
                <Button border="1px solid" onClick={onAddModalOpen}>
                  Add New Section
                </Button>

                <Modal
                  onClose={onAddModalClose}
                  finalFocusRef={btnRef}
                  isOpen={isAddModalOpen}
                  scrollBehavior="inside"
                >
                  <ModalOverlay />
                  <ModalContent bg="gray.900">
                    <ModalHeader>Add New Section</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl id="heading" mb={4}>
                        <FormLabel>Heading</FormLabel>
                        <Input
                          type="text"
                          value={newModule.heading}
                          onChange={(e) => {
                            setNewModule({
                              ...newModule,
                              heading: e.target.value,
                            });
                          }}
                          placeholder="Enter heading"
                        />
                      </FormControl>
                      <FormControl id="subheading">
                        <FormLabel>Subheading</FormLabel>
                        <Input
                          type="text"
                          value={newModule.subheading}
                          onChange={(e) => {
                            setNewModule({
                              ...newModule,
                              subheading: e.target.value,
                            });
                          }}
                          placeholder="Enter subheading"
                        />
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <ButtonGroup>
                        <Button
                          colorScheme="blue"
                          onClick={handleNewSectionSubmit}
                          isLoading={isLoading}
                        >
                          Save
                        </Button>
                        <Button onClick={onAddModalClose}>Cancel</Button>
                      </ButtonGroup>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </SimpleGrid>

      <Divider width="80%" mt={10} />

      <Heading
        fontSize="5xl"
        mb={10}
        mt={10}
        color="whiteAlpha.800"
        textAlign="center"
      >
        User Progress:
      </Heading>

      <HStack width="100%" justifyContent="center">
        <Box
          bg="blackAlpha.800"
          borderRadius={8}
          p={4}
          display="flex"
          flexDirection={flexDirection}
          width="50%"
          height="auto"
          alignItems="center"
        >
          <Box width={boxWidth} mr={2} mb={flexDirection === "column" ? 4 : 0}>
            <Text fontSize="xl" color="whiteAlpha.700">
              Average Progress
            </Text>
            <Text fontSize="4xl" fontWeight="bold" color="whiteAlpha.800">
              {averageProgress.toFixed(2)}%
            </Text>
          </Box>

          <Box
            width={pieChartWidth}
            height="35dvh"
            mb={flexDirection === "column" ? 4 : 0}
          >
            <ResponsiveContainer width="100%" height="100%">
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box width={boxWidth} ml={flexDirection === "row" ? 4 : 0}>
            <VStack>
              <Text fontSize="xl" color="whiteAlpha.700">
                Total Users
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">
                {allUserProgress.length}
              </Text>

              <Text fontSize="xl" color="whiteAlpha.700" mt={4}>
                Total Modules
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">
                {sections.length}
              </Text>
            </VStack>
          </Box>
        </Box>
      </HStack>

      <TableContainer bg="blackAlpha.800" borderRadius={10} width="85%" mt={2}>
        <Table variant="simple" size="lg">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Daily Streak</Th>
              <Th>Overall Progress (%)</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allUserProgress.map((user) => (
              <React.Fragment key={user.progress.user_id}>
                <Tr>
                  <Td>{user.username}</Td>
                  <Td>{user.dailyStreak}</Td>
                  <Td>
                    {user.overallProgress}
                    <Progress
                      value={user.overallProgress}
                      size="sm"
                      colorScheme="blue"
                      borderRadius={10}
                    />
                  </Td>
                  <Td>
                    <Button
                      onClick={() => handleShowMore(user.progress.user_id)}
                      colorScheme="blue"
                    >
                      {expandedUser === user.progress.user_id
                        ? "Show Less"
                        : "Show More"}
                    </Button>
                  </Td>
                </Tr>
                {expandedUser === user.progress.user_id && (
                  <Tr>
                    <Td colSpan={4}>
                      <Box bg="gray.700" p={4} borderRadius={10}>
                        <Heading size="md" mb={4}>
                          Module Progress
                        </Heading>
                        <ResponsiveContainer width="50%" height={150}>
                          <BarChart data={user.barChartData}>
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Bar
                              dataKey="Completed"
                              stackId="a"
                              fill="#ffc658"
                            />
                            <Bar
                              dataKey="Remaining"
                              stackId="a"
                              fill="#8884d8"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Divider width="80%" mt={10} />
      <Heading
        fontSize="5xl"
        mb={10}
        mt={10}
        color="whiteAlpha.800"
        textAlign="center"
      >
        Documentation:
      </Heading>
      <DocumentationComponent admin={true} />
    </Box>
  );
}

export default AdminDashboard;
