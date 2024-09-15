/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the AdminLevelSelection page which allows the admin to view, add, edit, and delete levels for a section
 */

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
  Divider,
  VStack,
  HStack,
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
    test_cases: [{ inputs: [], output: "" }],
    hints: [""],
    difficulty: "easy",
    route: "",
    examples: [""],
    solution: "",
    starter_code: "",
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

  // Confirm and delete the level
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

  // Submit the form to create a new level
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
    } finally {
      setFormData({
        title: "",
        question: "",
        test_cases: [{ inputs: [], output: "" }],
        hints: [""],
        difficulty: "easy",
        route: "",
        examples: [""],
        solution: "",
        starter_code: "",
        order: 0,
        section_id: "",
      });
    }
  };

  // Handle changes in test cases
  const handleTestCaseChange = (testCaseIndex, inputIndex, e) => {
    const { name, value } = e.target;
    const updatedTestCases = [...formData.test_cases];
    if (name === "input") {
      updatedTestCases[testCaseIndex].inputs[inputIndex] = value;
    } else {
      updatedTestCases[testCaseIndex][name] = value;
    }
    setFormData({ ...formData, test_cases: updatedTestCases });
  };

  // Add test cases
  const addTestCase = () => {
    setFormData({
      ...formData,
      test_cases: [...formData.test_cases, { inputs: [""], output: "" }],
    });
  };

  // Remove a test case
  const removeTestCase = (index) => {
    const updatedTestCases = formData.test_cases.filter((_, i) => i !== index);
    setFormData({ ...formData, test_cases: updatedTestCases });
  };

  // Add input field to a test case
  const addInputField = (testCaseIndex) => {
    const updatedTestCases = [...formData.test_cases];
    updatedTestCases[testCaseIndex].inputs.push("");
    setFormData({ ...formData, test_cases: updatedTestCases });
  };

  // Remove input field from a test case
  const removeInputField = (testCaseIndex, inputIndex) => {
    const updatedTestCases = [...formData.test_cases];
    updatedTestCases[testCaseIndex].inputs = updatedTestCases[
      testCaseIndex
    ].inputs.filter((_, i) => i !== inputIndex);
    setFormData({ ...formData, test_cases: updatedTestCases });
  };

  // Handle changes in editing form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedLevel({ ...selectedLevel, [name]: value });
  };

  // Handle changes in test cases for editing
  const handleEditTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTestCases = selectedLevel.test_cases.map((testCase, i) =>
      i === index ? { ...testCase, [name]: value } : testCase
    );
    setSelectedLevel({ ...selectedLevel, test_cases: updatedTestCases });
  };

  // Add test case for editing
  const addEditTestCase = () => {
    setSelectedLevel({
      ...selectedLevel,
      test_cases: [...selectedLevel.test_cases, { inputs: [""], output: "" }],
    });
  };

  // Remove test case for editing
  const removeEditTestCase = (index) => {
    const updatedTestCases = selectedLevel.test_cases.filter(
      (_, i) => i !== index
    );
    setSelectedLevel({ ...selectedLevel, test_cases: updatedTestCases });
  };

  // Add input field to a test case for editing
  const removeEditTestCaseInput = (testCaseIndex, inputIndex) => {
    setSelectedLevel((prevSelectedLevel) => {
      const updatedTestCases = [...prevSelectedLevel.test_cases];
      updatedTestCases[testCaseIndex].inputs.splice(inputIndex, 1);
      return { ...prevSelectedLevel, test_cases: updatedTestCases };
    });
  };

  // Remove input field from a test case for editing
  const addEditTestCaseInput = (testCaseIndex) => {
    setSelectedLevel((prevSelectedLevel) => {
      const updatedTestCases = [...prevSelectedLevel.test_cases];
      updatedTestCases[testCaseIndex] = {
        ...updatedTestCases[testCaseIndex],
        inputs: [...updatedTestCases[testCaseIndex].inputs, ""],
      };
      return { ...prevSelectedLevel, test_cases: updatedTestCases };
    });
  };

  // Submit the form to edit a level
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
                <FormLabel>Starter Code</FormLabel>
                <Textarea
                  name="starter_code"
                  value={formData.starter_code}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Test Cases</FormLabel>
                {formData.test_cases.map((testCase, testCaseIndex) => (
                  <Box
                    key={testCaseIndex}
                    mb={4}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    <FormLabel>Test Case {testCaseIndex + 1}</FormLabel>
                    <Divider mb={4} />
                    <VStack spacing={4} align="stretch">
                      {testCase.inputs.map((input, inputIndex) => (
                        <HStack key={inputIndex} spacing={4}>
                          <Input
                            name="input"
                            placeholder={`Input ${inputIndex + 1}`}
                            value={input}
                            onChange={(e) =>
                              handleTestCaseChange(testCaseIndex, inputIndex, e)
                            }
                          />
                          <IconButton
                            icon={<MinusIcon />}
                            colorScheme="red"
                            onClick={() =>
                              removeInputField(testCaseIndex, inputIndex)
                            }
                          />
                        </HStack>
                      ))}
                      <Button
                        colorScheme="blue"
                        onClick={() => addInputField(testCaseIndex)}
                      >
                        Add Input
                      </Button>
                      <Input
                        name="output"
                        placeholder="Output"
                        value={testCase.output}
                        onChange={(e) =>
                          handleTestCaseChange(testCaseIndex, null, e)
                        }
                      />
                      <Button
                        colorScheme="red"
                        onClick={() => removeTestCase(testCaseIndex)}
                      >
                        Remove Test Case
                      </Button>
                    </VStack>
                  </Box>
                ))}

                <Box width="100%" justifyContent="center" display="flex">
                  <Button mt={2} colorScheme="green" onClick={addTestCase}>
                    Add Test Case
                  </Button>
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Hints</FormLabel>
                <Textarea
                  name="hints"
                  value={formData.hints}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" mt={8}>
                Submit
              </Button>
              <Button colorScheme="gray" mt={8} ml={2} onClick={onClose}>
                Cancel
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
                  <FormLabel>Starter Code</FormLabel>
                  <Textarea
                    name="starter_code"
                    value={selectedLevel.starter_code}
                    onChange={handleEditInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Test Cases</FormLabel>
                  {(selectedLevel.test_cases || []).map(
                    (testCase, testCaseIndex) => (
                      <Box
                        key={testCaseIndex}
                        mb={4}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                      >
                        <FormLabel>Test Case {testCaseIndex + 1}</FormLabel>
                        <Divider mb={4} />
                        <VStack spacing={4} align="stretch">
                          {testCase.inputs.map((input, inputIndex) => (
                            <HStack key={inputIndex} spacing={4}>
                              <Input
                                name="input"
                                placeholder={`Input ${inputIndex + 1}`}
                                value={input}
                                onChange={(e) =>
                                  handleEditTestCaseChange(
                                    testCaseIndex,
                                    inputIndex,
                                    e
                                  )
                                }
                              />
                              <IconButton
                                icon={<MinusIcon />}
                                colorScheme="red"
                                onClick={() =>
                                  removeEditTestCaseInput(
                                    testCaseIndex,
                                    inputIndex
                                  )
                                }
                              />
                            </HStack>
                          ))}
                          <Button
                            colorScheme="blue"
                            onClick={() => addEditTestCaseInput(testCaseIndex)}
                          >
                            Add Input
                          </Button>
                          <Input
                            name="output"
                            placeholder="Output"
                            value={testCase.output}
                            onChange={(e) =>
                              handleEditTestCaseChange(testCaseIndex, null, e)
                            }
                          />
                          <Button
                            colorScheme="red"
                            onClick={() => removeEditTestCase(testCaseIndex)}
                          >
                            Remove Test Case
                          </Button>
                        </VStack>
                      </Box>
                    )
                  )}
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
              <Button ref={cancelRef} onClick={onAlertClose}>
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
