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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowBackIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
  MinusIcon,
  PlusSquareIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { IoMdHome } from "react-icons/io";

function AdminLevelSelection() {
  const toast = useToast();
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    title: "",
    question: "",
    test_cases: [{ input: "", output: "" }],
    hints: [""],
    difficulty: "easy",
    route: "",
    examples: [""],
    solution: "",
    order: 0,
    section_id: "",
  });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const [levelToDelete, setLevelToDelete] = useState(null);

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

  const onEditClick = (level) => {
    setSelectedLevel(level);
    onEditOpen();
  };

  const onDeleteClick = (level) => {
    setLevelToDelete(level);
    onAlertOpen();
  };

  const handleDeleteConfirm = async (levelId) => {
    try {
      await axios.delete(`/delete-level/${levelId}`);

      // Refresh levels and section after deleting a level
      const levelsResponse = await axios.get(
        `/sections/${sectionRoute}/levels`
      );
      setLevels(levelsResponse.data);

      const sectionResponse = await axios.get(`/sections/${sectionRoute}`);
      setSection(sectionResponse.data);

      onAlertClose();

      // Show success toast
      toast({
        title: "Level deleted.",
        description: "The level has been successfully deleted.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);

      // Show error toast
      toast({
        title: "An error occurred.",
        description: "Unable to delete the level. Please try again later.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = {
        ...formData,
        section_id: section._id,
        order: levels.length + 1,
        route: formData.title.toLowerCase().replace(/\s/g, "-"),
      };
      await axios.post(`/create-level`, formDataToSubmit);
      onClose();

      // Refresh levels and sections after adding a new one
      const levelResponse = await axios.get(`/sections/${sectionRoute}/levels`);
      setLevels(levelResponse.data);

      const sectionResponse = await axios.get(`/sections/${sectionRoute}`);
      setSection(sectionResponse.data);

      // Show success toast
      toast({
        title: "Level created.",
        description: "The new level has been successfully created.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);

      // Show error toast
      toast({
        title: "An error occurred.",
        description: "Unable to create the level. Please try again later.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  const handleTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTestCases = formData.test_cases.map((testCase, i) =>
      i === index ? { ...testCase, [name]: value } : testCase
    );
    setFormData({ ...formData, test_cases: updatedTestCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      test_cases: [...formData.test_cases, { input: "", output: "" }],
    });
  };

  const removeTestCase = (index) => {
    const updatedTestCases = formData.test_cases.filter((_, i) => i !== index);
    setFormData({ ...formData, test_cases: updatedTestCases });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedLevel({ ...selectedLevel, [name]: value });
  };

  const handleEditTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTestCases = selectedLevel.test_cases.map((testCase, i) =>
      i === index ? { ...testCase, [name]: value } : testCase
    );
    setSelectedLevel({ ...selectedLevel, test_cases: updatedTestCases });
  };

  const addEditTestCase = () => {
    setSelectedLevel({
      ...selectedLevel,
      test_cases: [...selectedLevel.test_cases, { input: "", output: "" }],
    });
  };

  const removeEditTestCase = (index) => {
    const updatedTestCases = selectedLevel.test_cases.filter(
      (_, i) => i !== index
    );
    setSelectedLevel({ ...selectedLevel, test_cases: updatedTestCases });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedLevel = {
        ...selectedLevel,
        route: selectedLevel.title.toLowerCase().replace(/\s/g, "-"),
      };
      await axios.put(`/update-level/${selectedLevel._id}`, updatedLevel);
      onEditClose();

      // Refresh levels after editing
      const levelResponse = await axios.get(`/sections/${sectionRoute}/levels`);
      setLevels(levelResponse.data);

      // Show success toast
      toast({
        title: "Level updated.",
        description: "The level has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);

      // Show error toast
      toast({
        title: "An error occurred.",
        description: "Unable to update the level. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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

      <Button
        leftIcon={<PlusSquareIcon />}
        colorScheme="green"
        mt={4}
        onClick={onOpen}
      >
        Add Level
      </Button>

      <TableContainer bg="blackAlpha.800" borderRadius={10} width="85%" mt={2}>
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
              <Tr key={level._id}>
                <Td>{level.order}</Td>
                <Td>
                  <NavLink
                    to={`/admin-dashboard/${sectionHeading}/${level.route}`}
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
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={() => onEditClick(level)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => onDeleteClick(level._id)}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Level</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Question</FormLabel>
                <Textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Solution</FormLabel>
                <Textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Examples</FormLabel>
                <Textarea
                  name="examples"
                  value={formData.examples}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Test Cases</FormLabel>
                {formData.test_cases.map((testCase, index) => (
                  <Box key={index} mb={2}>
                    <Input
                      name="input"
                      placeholder="Input"
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, e)}
                      mb={1}
                    />
                    <Input
                      name="output"
                      placeholder="Output"
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, e)}
                    />
                    <Button
                      mt={2}
                      colorScheme="red"
                      onClick={() => removeTestCase(index)}
                    >
                      Remove Test Case
                    </Button>
                  </Box>
                ))}
                <Button mt={2} colorScheme="green" onClick={addTestCase}>
                  Add Test Case
                </Button>
              </FormControl>
              <FormControl>
                <FormLabel>Hints</FormLabel>
                <Textarea
                  name="hints"
                  value={formData.hints}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" mt={4}>
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Level</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedLevel && (
              <form onSubmit={handleEditFormSubmit}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    value={selectedLevel.title}
                    onChange={handleEditInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Question</FormLabel>
                  <Textarea
                    name="question"
                    value={selectedLevel.question}
                    onChange={handleEditInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    name="difficulty"
                    value={selectedLevel.difficulty}
                    onChange={handleEditInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Solution</FormLabel>
                  <Textarea
                    name="solution"
                    value={selectedLevel.solution}
                    onChange={handleEditInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Examples</FormLabel>
                  <Textarea
                    name="examples"
                    value={selectedLevel.examples}
                    onChange={handleEditInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Test Cases</FormLabel>
                  {selectedLevel.test_cases.map((testCase, index) => (
                    <Box key={index} mb={2}>
                      <Input
                        name="input"
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) => handleEditTestCaseChange(index, e)}
                        mb={1}
                      />
                      <Input
                        name="output"
                        placeholder="Output"
                        value={testCase.output}
                        onChange={(e) => handleEditTestCaseChange(index, e)}
                      />
                      <Button
                        mt={2}
                        colorScheme="red"
                        onClick={() => removeEditTestCase(index)}
                      >
                        Remove Test Case
                      </Button>
                    </Box>
                  ))}
                  <Button mt={2} colorScheme="green" onClick={addEditTestCase}>
                    Add Test Case
                  </Button>
                </FormControl>
                <FormControl>
                  <FormLabel>Hints</FormLabel>
                  <Textarea
                    name="hints"
                    value={selectedLevel.hints}
                    onChange={handleEditInputChange}
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" mt={4}>
                  Save
                </Button>
                <Button colorScheme="gray" mt={4} ml={2} onClick={onEditClose}>
                  Cancel
                </Button>
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Level
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this level? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteConfirm(levelToDelete)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default AdminLevelSelection;
