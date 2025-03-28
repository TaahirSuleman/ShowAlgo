import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  IconButton,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  UnorderedList,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  WarningIcon,
  MinusIcon,
  InfoIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { FaPlay, FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CodeEditorView from "../components/CodeEditorView";
import OutputView from "../components/OutputView";
import { IoMdHome } from "react-icons/io";
import RunControls from "../components/RunControls";
import MainVisualisationWindow from "../components/MainVisualisationWindow";
import DocumentationComponent from "../components/DocumentationComponent";
import CustomToast from "../components/CustomToast";
import ConfettiExplosion from "react-confetti-explosion";

function Level() {
  const toast = useToast();
  const [customToast, setCustomToast] = useState(false);
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  const editorRef = useRef();
  const [output, setOutput] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearLoading, setIsClearLoading] = useState(false);
  const [isClearOutputLoading, setIsClearOutputLoading] = useState(false);
  const cancelClearRef = useRef();
  const [speedState, setSpeedState] = useState(2);
  const [movementsState, setMovementsState] = useState();
  const [highlightState, setHighlightState] = useState();
  const [indexState, setIndexState] = useState(-1);
  const [pauseState, setPauseState] = useState(false);
  const [savedIndexState, setSavedIndexState] = useState(-1);
  const [bufferState, setBufferState] = useState(false);
  const [key, setKey] = useState(0);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // level states
  const [showHints, setShowHints] = useState(false);
  const [showTestCaseStatus, setShowTestCaseStatus] = useState(false);
  const { sectionRoute, levelRoute } = useParams();
  const [user, setUser] = useState({
    username: "",
    _id: "",
  });
  const [level, setLevel] = React.useState({
    _id: "",
    section_id: "",
    title: "",
    order: 0,
    question: "",
    test_cases: [
      {
        input: "",
        output: "",
        passed: false,
      },
    ],
    examples: [],
    solution: "",
    hints: [],
    difficulty: "",
    starter_code: "",
    __v: 0,
    route: "",
  });

  const [UserProgress, setUserProgress] = useState({
    user_id: "",
    sections: [
      {
        section_id: "",
        levels: [
          {
            level_id: "",
            completed: false,
            difficulty: "",
          },
        ],
      },
    ],
  });

  // get user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user._id) {
        console.log("User ID is not defined");
        return;
      }
      try {
        const response = await axios.get(`/get-progress/${user._id}`);
        setUserProgress(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user._id) {
      fetchUserProgress();
    }
  }, [user._id]);

  // update user progress
  useEffect(() => {
    const updateUserProgress = async () => {
      try {
        // Check if the level was already marked as completed
        const section = UserProgress.sections.find(
          (section) => section.section_id === level.section_id
        );
        const levelProgress = section
          ? section.levels.find((lvl) => lvl.level_id === level._id)
          : null;
        const wasCompletedBefore = levelProgress
          ? levelProgress.completed
          : false;

        // Update the progress on the backend
        const response = await axios.put(`/update-progress/${user._id}`, {
          levelId: level._id,
        });

        // If it wasn't completed before but is now, it's the first time
        const isFirstTime = !wasCompletedBefore;

        if (testResults.status === "success") {
          // Show appropriate toast message
          setCustomToast({
            title: isFirstTime ? "Level Completed!" : "Level Re-completed!",
            description: isFirstTime
              ? "Congratulations on completing this level for the first time!"
              : "You've successfully completed this level again!",
            status: "success",
            duration: 6000,
            isClosable: false,
            position: "bottom",
          });
        }

        // update the UserProgress state to reflect the new progress
        setUserProgress(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user._id) {
      updateUserProgress();
    }
  }, [testResults]);

  // IDE functions

  useEffect(() => {
    setMovementsState([
      {
        line: 1,
        operation: "if",
        condition: "x > 5",
        result: true,
        timestamp: "2024-07-09T12:02:00Z",
        description: "Checked if x is greater than 5.",
      },
      {
        line: 2,
        operation: "print",
        isLiteral: true,
        varName: null,
        literal: "x is greater than 5",
        timestamp: "2024-07-09T12:03:00Z",
        description: "Printed 'x is greater than 5'.",
      },
      {
        line: 3,
        operation: "else",
        timestamp: "2024-07-09T12:04:00Z",
        description: "Else block not executed as condition was true.",
      },
      {
        line: 6,
        operation: "set",
        varName: "x",
        type: "number",
        value: 10,
        timestamp: "2024-07-09T12:01:00Z",
        description: "Set variable x to number 10.",
      },
      {
        line: 7,
        operation: "create",
        dataStructure: "array",
        value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        length: 9,
        id: "abcd",
        type: "int",
        varName: "nums",
        timestamp: "2024-07-09T12:01:00Z",
        description:
          "Created an array named nums with initial values [1, 2, 3, 4].",
      },
      {
        line: 8,
        operation: "create",
        dataStructure: "array",
        value: ["a", "b", "c", "d", "e", "f", "g"],
        type: "string",
        varName: "letters",
        timestamp: "2024-07-09T12:01:00Z",
        description:
          "Created an array named letters with initial values [a,b,c,d,e,f,g].",
      },
      {
        line: 9,
        operation: "remove",
        dataStructure: "array",
        id: "abcd",
        varName: "nums",
        positionToRemove: 2,
        description: "Removed value at position 2 in array nums",
      },
      {
        line: 10,
        operation: "remove",
        dataStructure: "array",
        id: "abcd",
        varName: "letters",
        positionToRemove: 4,
        description: "Removed value at position 4 in array letters",
      },
      {
        line: 11,
        operation: "add",
        dataStructure: "array",
        value: 5,
        varName: "nums",
        position: 4,
        timestamp: "2024-07-09T12:02:00Z",
        description: "Inserted value 5 at position 4 in array nums.",
      },
      {
        line: 12,
        operation: "create",
        dataStructure: "array",
        value: ["g", "a", "n", "g", "s", "t", "a"],
        length: 7,
        id: "abcd",
        type: "string",
        varName: "gansterlicious",
        timestamp: "2024-07-09T12:01:00Z",
        description:
          "Created an array named letters with initial values [a,b,c,d,e,f,g].",
      },
      {
        line: 13,
        operation: "add",
        dataStructure: "array",
        value: "z",
        varName: "letters",
        position: 0,
        timestamp: "2024-07-09T12:02:00Z",
        description: "Inserted value 'z' at position 0 in array nums.",
      },
      {
        line: 14,
        operation: "swap",
        dataStructure: "array",
        firstPosition: 1,
        secondPosition: 3,
        varName: "nums",
        description: "Swapped values in position 1 and 3 in array nums.",
      },
      {
        line: 15,
        operation: "swap",
        dataStructure: "array",
        firstPosition: 1,
        secondPosition: 3,
        varName: "letters",
        description: "Swapped values in position 1 and 3 in array letters.",
      },
      {
        line: 16,
        operation: "set",
        varName: "wordString",
        type: "string",
        value: "Hello World",
        timestamp: "2024-07-09T12:01:00Z",
        description: "Set variable y to string 'Wagwan World'.",
      },
      {
        line: 17,
        operation: "set",
        varName: "z",
        type: "boolean",
        value: "true",
        timestamp: "2024-07-09T12:01:00Z",
        description: "Set variable z to boolean true.",
      },
      {
        line: 18,
        operation: "set",
        varName: "wordString",
        type: "string",
        value: "Hello Again World",
        timestamp: "2024-07-09T12:01:00Z",
        description: "Set variable y to string 'Hello Again World'.",
      },
    ]);
  }, []);

  // very long sample text

  const pauseAnimation = () => {
    setPauseState(!pauseState);
  };

  const runCode = async () => {
    setIsRunLoading(true); // To show loading state on the button
    const code = value; // Get code from the editor
    console.log(code);
    try {
      let response = await axios.post(
        "http://localhost:8000/api/pseudocode/run",
        { code }
      );
      console.log(response.data.result);
      let actionFrames = response.data.result.actionFrames;
      //setOutput(response.data.result); // Assuming the response has the execution result
      setMovementsState(actionFrames);
      setIndexState(0);
      setHighlightState(true);
    } catch (error) {
      console.error("Failed to run code:", error);
      setIsError(true); // Handle error state
    }
    setIsRunLoading(false);
  };

  const stopCode = () => {
    setPauseState(true);
    const timeoutSetKey = setTimeout(() => {
      setIndexState(-1);
      setHighlightState(false);
      setKey((prevKey) => prevKey + 1);
      setPauseState(false);
    }, speedState + 2000);
    return () => timeoutSetKey;
  };

  const handleClearClick = () => {
    setIsClearDialogOpen(true);
  };

  const handleClearConfirm = () => {
    setIsClearDialogOpen(false);
    clearCode();
  };

  const handleClearCancel = () => {
    setIsClearDialogOpen(false);
  };

  const clearCode = () => {
    setIsClearLoading(true);
    setTimeout(() => {
      setValue(level.starter_code);
      setIsClearLoading(false);
    }, 1000);
  };

  const clearOutput = () => {
    setIsClearOutputLoading(true);
    setTimeout(() => {
      setOutput([]);
      setIsClearOutputLoading(false);
    }, 1000);
  };

  const gridTemplateColumns = useBreakpointValue({
    base: "1fr", // Single column layout for small screens
    md: "1fr 1fr", // Two columns layout for medium and larger screens
  });

  const gridTemplateRows = useBreakpointValue({
    base: "auto", // Single row layout for small screens
    md: "1fr 1fr", // Two rows layout for medium and larger screens
  });

  // Level functions
  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array means this runs once on mount

  // get level
  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await axios.get(
          `/sections/${sectionRoute}/levels/${levelRoute}`
        );
        setLevel(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLevel();
  }, [sectionRoute, levelRoute]);

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

  const handleOnHomeClick = () => {
    navigate(`/learning-mode/${sectionRoute}`);
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const toggleTestCaseStatus = () => {
    setShowTestCaseStatus(!showTestCaseStatus);
  };

  const checkTestCases = async (code, cases) => {
    try {
      console.log("code:", code);
      console.log("cases:", cases);
      const response = await axios.post("/test-code", {
        userCode: code,
        testCases: cases,
      });

      const results = response.data;
      console.log("Test results:", results);
      setTestResults(results);
    } catch (error) {
      console.error("Error testing code:", error);

      toast({
        title: "Error testing code",
        description: "Failed to test code",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  const getStatusIcon = (status) => {
    if (!submitClicked) {
      return (
        <MinusIcon
          color="white"
          boxSize={8}
          bg="gray.500"
          borderRadius="50%"
          p={1}
          ml={1}
        />
      );
    }

    switch (status) {
      case "success":
        return (
          <CheckIcon
            color="white"
            boxSize={8}
            bg="green.500"
            borderRadius="50%"
            p={1}
            ml={1}
          />
        );
      case "error":
        return (
          <CloseIcon
            color="white"
            boxSize={8}
            bg="red.500"
            borderRadius="50%"
            p={1}
            ml={1}
          />
        );
      case "warning":
        return (
          <WarningIcon
            boxSize={8}
            borderRadius="50%"
            ml={1}
            color="yellow.500"
            bg="white"
          />
        );
    }
  };

  const submitCode = async () => {
    setSubmitClicked(true);

    try {
      let response = await axios.post(
        "http://localhost:8000/api/pseudocode/run",
        { code: value }
      );

      console.log(response)

      if (response.status === 200) {
        setIsSubmitLoading(true);
        setTimeout(() => {
          checkTestCases(value, level.test_cases);
          setIsSubmitLoading(false);
        }, 2000);
      } else {
        setIsSubmitLoading(false);
        setTestResults([]);
        toast({
          title: "Code Execution Failed",
          description: "The code did not pass the execution.",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      }
    } catch (error) {
      setTestResults([]);
      console.error("Failed to run code:", error);
      toast({
        title: "Error running code",
        description: "Failed to run code",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      setIsSubmitLoading(false);
    }
  };

  return (
    <Box>
      <Box p={4}>
        <Box bg="blackAlpha.900" borderRadius={10} p={5}>
          <Box display="flex" justifyContent="center">
            <IconButton
              icon={<ArrowBackIcon />}
              color="white"
              colorScheme="gray"
              onClick={handleOnHomeClick}
            />
          </Box>

          <Heading textAlign="center">
            {level.order}. {level.title}
          </Heading>

          <Text fontWeight="bold" fontSize="xl" mt={2}>
            Problem:{" "}
            <Text as="span" fontWeight="normal">
              {level.question}

              <Button
                onClick={toggleHints}
                mt={4}
                colorScheme="gray"
                size="xs"
                as="span"
                m={2}
              >
                {showHints ? "Hide Hints" : "Show Hints"}
              </Button>
            </Text>
          </Text>
          {showHints && (
            <Box>
              <UnorderedList mt={2} color="gray">
                {level.hints.map((hint, index) => (
                  <ListItem key={index} fontWeight="normal">
                    {hint}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          )}

          <Text fontWeight="bold" fontSize="xl" mt={2}>
            Example(s):{" "}
            <UnorderedList listStyleType="none">
              {level.examples.map((example, index) => (
                <ListItem key={index} fontWeight="normal">
                  {example}
                </ListItem>
              ))}
            </UnorderedList>
          </Text>

          <Divider mt={4} />

          <Text fontWeight="bold" fontSize="xl" mt={2}>
            Status:{" "}
            {isSubmitLoading ? (
              <Spinner ml={1} />
            ) : (
              getStatusIcon(testResults.status)
            )}
          </Text>

          {testResults.test_results && (
            <Box>
              <Button
                onClick={toggleTestCaseStatus}
                mt={4}
                colorScheme="gray"
                size="sm"
              >
                {showTestCaseStatus ? "Hide Test Cases" : "Show Test Cases"}
              </Button>

              {showTestCaseStatus && (
                <Accordion allowToggle mt={2} color="gray">
                  {testResults.test_results.map((result, index) => (
                    <AccordionItem
                      key={index}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      mb={2}
                    >
                      <AccordionButton>
                        <Box
                          flex="1"
                          textAlign="left"
                          fontWeight="bold"
                          textColor="white"
                        >
                          Test Case {result.testCase}:
                          {isSubmitLoading ? (
                            <Spinner ml={1} />
                          ) : result.passed ? (
                            <CheckIcon color="green.500" boxSize={4} ml={2} />
                          ) : (
                            <CloseIcon color="red.500" boxSize={4} ml={2} />
                          )}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <Text fontWeight="normal">
                          Expected: {result.expectedOutput}
                        </Text>
                        <Text fontWeight="normal">
                          Actual: {result.actualOutput}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box>
        <Box display="flex" justifyContent="center">
          <RunControls
            isClearLoading={isClearLoading}
            isRunLoading={isRunLoading}
            runCode={runCode}
            stopCode={stopCode}
            value={value}
            pauseAnimation={pauseAnimation}
            pauseState={pauseState}
            setPauseState={setPauseState}
            speedState={speedState}
            setSpeedState={setSpeedState}
            submitButton={true}
            isSubmitLoading={isSubmitLoading}
            submitCode={submitCode}
          />
        </Box>

        <Grid
          templateColumns={gridTemplateColumns}
          templateRows={gridTemplateRows}
          gap={4}
          p={4}
          overflow="auto"
        >
          <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 2 }}>
            <Box
              width={{ base: "94vw", md: "50vw" }}
              boxShadow="md"
              borderBottomRadius={10}
              overflow="hidden"
            >
              <Box
                bg="blackAlpha.900"
                borderTopRadius={10}
                p={2}
                display="flex"
                alignItems="center"
                height="12dvh"
                justifyContent="space-between"
              >
                <Button
                  variant="solid"
                  colorScheme="red"
                  isDisabled={value === ""}
                  onClick={handleClearClick}
                  isLoading={isClearLoading}
                  m={2}
                  pl={1}
                  width="85px"
                >
                  <IoClose size="1.6em" />
                  <Box as="span">Clear</Box>
                </Button>

                <Box>
                  <Heading
                    fontWeight="normal"
                    color="whiteAlpha.900"
                    textAlign="center"
                    fontSize="2xl"
                  >
                    Code Editor
                    <Popover trigger="hover">
                      <PopoverTrigger>
                        <IconButton
                          ref={btnRef}
                          onClick={onOpen}
                          icon={
                            <InfoIcon
                              color="blackAlpha.900"
                              p={0.5}
                              bg="blue.300"
                              borderRadius="50%"
                              borderColor="white"
                              boxSize="0.8em"
                            />
                          }
                          size="auto"
                          bg="transparent"
                          ml={2}
                        />
                      </PopoverTrigger>

                      <PopoverContent bg="blue.400" width="auto" border="none">
                        <PopoverArrow bg="blue.400" />
                        <PopoverBody color="white" fontSize="sm">
                          Show Documentation
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                    <Modal
                      onClose={onClose}
                      finalFocusRef={btnRef}
                      isOpen={isOpen}
                      scrollBehavior="inside"
                    >
                      <ModalOverlay />
                      <ModalContent bg="gray.900" maxW="90vw" maxH="90vh">
                        <ModalHeader>Documentation</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <DocumentationComponent />
                        </ModalBody>
                        <ModalFooter>
                          <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Heading>
                </Box>

                <Box width="84px" />

                <AlertDialog
                  isOpen={isClearDialogOpen}
                  leastDestructiveRef={cancelClearRef}
                  onClose={handleClearCancel}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Confirm Clear
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Are you sure you want to clear the code?
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button
                          ref={cancelClearRef}
                          onClick={handleClearCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={handleClearConfirm}
                          ml={3}
                        >
                          Clear
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Box>

              <CodeEditorView
                speedState={speedState}
                movementsState={movementsState}
                height="50dvh"
                width={{ base: "100%", md: "50vw" }}
                theme="vs-dark"
                value={value}
                setValue={setValue}
                highlightState={highlightState}
                setHighlightState={setHighlightState}
                pauseState={pauseState}
                setPauseState={setPauseState}
                defaultValue={level.starter_code}
              />
            </Box>

            <Box mt={4} borderBottomRadius={10} overflow="hidden">
              <Box
                bg="blackAlpha.900"
                borderTopRadius={10}
                p={2}
                display="flex"
                alignItems="center"
                height="12dvh"
                justifyContent="space-between"
              >
                <Button
                  variant="solid"
                  colorScheme="red"
                  isDisabled={output.length === 0}
                  onClick={clearOutput}
                  isLoading={isClearOutputLoading}
                  m={2}
                  pl={1}
                  width="85px"
                >
                  <IoClose size="1.6em" />
                  <Box as="span">Clear</Box>
                </Button>

                <Heading
                  fontWeight="normal"
                  color="whiteAlpha.900"
                  fontSize="2xl"
                >
                  Output View
                </Heading>

                <Box width="84px" />
              </Box>
              <Box
                borderBottomRadius={4}
                height={{ base: "auto", md: "50vh" }}
                boxShadow="md"
              >
                <OutputView
                  height={{ base: "25vh", md: "50vh" }}
                  width="100%"
                  output={output}
                />
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 2 }}>
            <Box
              bg="blackAlpha.900"
              borderTopRadius={10}
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="12dvh"
            >
              <Heading
                fontWeight="normal"
                color="whiteAlpha.900"
                fontSize="2xl"
              >
                Visualisation View
              </Heading>
            </Box>

            <Box
              bg="blackAlpha.600"
              borderBottomRadius={10}
              boxShadow="md"
              height={{ base: "75vh", md: "115vh" }}
              p={4}
            >
              <MainVisualisationWindow
                key={key}
                movementsState={movementsState}
                output={output}
                setOutput={setOutput}
                speedState={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pauseState={pauseState}
                setPauseState={setPauseState}
                bufferState={bufferState}
              ></MainVisualisationWindow>
            </Box>
          </GridItem>
        </Grid>
      </Box>

      {customToast && (
        <CustomToast
          title={customToast.title}
          description={customToast.description}
          duration={customToast.duration}
          onClose={() => setCustomToast(null)}
        />
      )}
    </Box>
  );
}

Level.propTypes = {
  type: PropTypes.oneOf(["user", "admin"]),
};

export default Level;
