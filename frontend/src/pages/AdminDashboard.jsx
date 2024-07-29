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
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-multi-carousel/lib/styles.css";
import ModuleCard from "../components/ModuleCard";
import { AddIcon } from "@chakra-ui/icons";
import EditModuleModal from "../components/EditModuleModal";

function AdminDashboard() {
  const navigate = useNavigate();
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
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
      } catch (error) {
        console.log(error);
      }
    };
    fetchSections();
  }, []);

  const handleSectionSelect = (sectionHeading) => {
    navigate(`/admin-dashboard/${sectionHeading}`);
  };

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
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (section) => {
    setModuleBeingEdited(section);
    setIsEditing(true);
    onEditModalOpen(); // Open the modal for editing
  };

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
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsEditing(false);
      setModuleBeingEdited(null);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setModuleBeingEdited(null);
    onEditModalClose();
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
    </Box>
  );
}

export default AdminDashboard;
