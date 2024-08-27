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
import IDEComponent from "../components/IDEComponent";
import CustomToast from "../components/CustomToast";

function AdminLevel() {
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
  const [killState, setKillState] = useState(-2);
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
        completed: false,
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

  // IDE functions

  const pauseAnimation = () => {
    setPauseState(!pauseState);
  };

  const runCode = async () => {
    setIsRunLoading(true); // To show loading state on the button
    let code = value; // Get code from the editor
    //setMovementsState(actionFrames);
    // setIndexState(0);
    // setHighlightState(true);
    console.log(code);
    console.log("I oath im ran");
    try {
      let response = await axios.post(
        "http://localhost:8000/api/pseudocode/run",
        { code }
      );
      console.log(response.data.result);
      let actionFrames = response.data.result.actionFrames;
      setKillState(actionFrames.length);
      //setOutput(response.data.result); // Assuming the response has the execution result
      setMovementsState(actionFrames);
      setOutput((prev) => [...prev, `colourYellow__RUN STARTING.`]);
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
      setOutput((prev) => [
        ...prev,
        `colourYellow__PREVIOUS RUN TERMINATED OR COMPLETED. NEXT RUN OUTPUT WILL APPEAR BELOW.`,
      ]);
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
    navigate(`/admin-dashboard/${sectionRoute}`);
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

      console.log(response);

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
            killState={killState}
            indexState={indexState}
            setOutput={setOutput}
            submitButton={true}
            isSubmitLoading={isSubmitLoading}
            submitCode={submitCode}
          />
        </Box>

        <IDEComponent
          value={value}
          defaultValue={level.starter_code}
          setValue={setValue}
          output={output}
          setOutput={setOutput}
          speedState={speedState}
          movementsState={movementsState}
          highlightState={highlightState}
          setHighlightState={setHighlightState}
          indexState={indexState}
          setIndexState={setIndexState}
          pauseState={pauseState}
          setPauseState={setPauseState}
          bufferState={bufferState}
          keyValue={key}
          isClearLoading={isClearLoading}
          isClearOutputLoading={isClearOutputLoading}
          setIsClearOutputLoading={setIsClearOutputLoading}
          setIsClearLoading={setIsClearLoading}
          level={true}
        />
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

AdminLevel.propTypes = {
  type: PropTypes.oneOf(["user", "admin"]),
};

export default AdminLevel;
