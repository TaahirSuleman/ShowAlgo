import {
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
  Text,
  UnorderedList,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, WarningIcon, MinusIcon, InfoIcon } from "@chakra-ui/icons";
import { FaPlay, FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditorView from "../components/CodeEditorView";
import OutputView from "../components/OutputView";

function Level() {
  const [value, setValue] = useState("");
  const editorRef = useRef();
  const [output, setOutput] = useState("Hello, World!");
  const [isError, setIsError] = useState(false);
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [isClearLoading, setIsClearLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showTestCaseStatus, setShowTestCaseStatus] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  const cancelClearRef = useRef();
  const { sectionRoute, levelRoute } = useParams();
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
    __v: 0,
    route: "",
  });

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

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const toggleTestCaseStatus = () => {
    setShowTestCaseStatus(!showTestCaseStatus);
  };

  const checkTestCases = () => {
    const testCases = level.test_cases.map((testCase) => {
      console.log(testCase.output);
      const result = output === testCase.output;
      return { ...testCase, passed: result };
    });
    setLevel({ ...level, test_cases: testCases });
  };

  const getStatusIcon = () => {
    if (!submitClicked)
      return <MinusIcon color="gray.500" boxSize={8} ml={1} />;
    if (level.test_cases.every((tc) => tc.passed))
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
    if (level.test_cases.every((tc) => !tc.passed))
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
    return (
      <WarningIcon
        boxSize={8}
        borderRadius="50%"
        ml={1}
        color="yellow.500"
        bg="white"
      />
    );
  };

  const runCode = () => {
    setIsRunLoading(true);
    setTimeout(() => {
      setIsRunLoading(false);
      setOutput("Hello, World!");
    }, 2000);
  };

  const submitCode = () => {
    setIsSubmitLoading(true);
    setSubmitClicked(true);
    setTimeout(() => {
      setIsSubmitLoading(false);
      setOutput("Hello, World!");
      checkTestCases();
    }, 2000);
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
      setValue("");
      setIsClearLoading(false);
      setOutput("");
    }, 1000);
  };

  const gridTemplateColumns = useBreakpointValue({
    base: "1fr", // Single column layout for small screens
    md: "1fr 1fr", // Two columns layout for medium and larger screens
  });

  const gridTemplateRows = useBreakpointValue({
    base: "auto", // Single row layout for small screens
    md: "auto 1fr", // Two rows layout for medium and larger screens
  });

  return (
    <Grid
      templateColumns={gridTemplateColumns}
      templateRows={gridTemplateRows}
      gap={4}
      p={4}
    >
      <GridItem colSpan={{ base: 1, md: 2 }} rowSpan={1}>
        <Box bg="blackAlpha.900" borderRadius={10} p={5}>
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
              {showHints && (
                <UnorderedList mt={2} color="gray">
                  {level.hints.map((hint, index) => (
                    <ListItem key={index} fontWeight="normal">
                      {hint}
                    </ListItem>
                  ))}
                </UnorderedList>
              )}
            </Text>
          </Text>

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
            Status: {getStatusIcon()}
          </Text>

          <Button
            onClick={toggleTestCaseStatus}
            mt={4}
            colorScheme="gray"
            size="sm"
          >
            {showTestCaseStatus ? "Hide Test Cases" : "Show Test Cases"}
          </Button>
          {showTestCaseStatus && (
            <UnorderedList mt={2} color="gray" listStyleType="none">
              {level.test_cases.map((testCase, index) => (
                <ListItem key={index} fontWeight="normal">
                  Test Case {index + 1}: {testCase.output}
                  {!submitClicked ? (
                    <MinusIcon color="gray.500" boxSize={4} ml={2} />
                  ) : testCase.passed ? (
                    <CheckIcon color="green.500" boxSize={4} ml={2} />
                  ) : (
                    <CloseIcon color="red.500" boxSize={4} ml={2} />
                  )}
                </ListItem>
              ))}
            </UnorderedList>
          )}
        </Box>
      </GridItem>

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
            display="flex"
            justifyContent="space-between"
            p={2}
            alignItems="center"
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
                <ModalContent bg="gray.900">
                  <ModalHeader>Documentation</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text>
                      Documentation goes here... <br />
                      <br />
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum. Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut
                      enim ad minim veniam, quis nostrud exercitation ullamco
                      laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                      irure dolor in reprehenderit in voluptate velit esse
                      cillum dolore eu fugiat nulla pariatur. Excepteur sint
                      occaecat cupidatat non proident, sunt in culpa qui officia
                      deserunt mollit anim id est laborum. Lorem ipsum dolor sit
                      amet, consectetur adipiscing elit sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat. Duis aute irure
                      dolor in reprehenderit in voluptate velit esse cillum
                      dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                      cupidatat non proident, sunt in culpa qui officia deserunt
                      mollit anim id est laborum."
                    </Text>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Heading>

            <Box>
              <Button
                variant="solid"
                colorScheme="green"
                isDisabled={value === ""}
                onClick={runCode}
                isLoading={isRunLoading}
                m={2}
                width="85px"
              >
                <FaPlay />
                <Box as="span" ml={2}>
                  Run
                </Box>
              </Button>
              <Button
                variant="solid"
                colorScheme="blue"
                isDisabled={value === ""}
                onClick={submitCode}
                isLoading={isSubmitLoading}
                m={2}
                width="115px"
              >
                <FaCloudUploadAlt size="1.6em" />
                <Box as="span" ml={2}>
                  Submit
                </Box>
              </Button>
            </Box>

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
                    <Button ref={cancelClearRef} onClick={handleClearCancel}>
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
            height="50dvh"
            width={{ base: "100%", md: "50vw" }}
            theme="vs-dark"
            value={value}
            setValue={setValue}
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
            justifyContent="center"
          >
            <Heading fontWeight="normal" color="whiteAlpha.900" fontSize="2xl">
              Output View
            </Heading>
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
          <Heading fontWeight="normal" color="whiteAlpha.900" fontSize="2xl">
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
          {/* //! For demo purposes, must be removed */}
          {/* <HStack justifyContent="center" mt={10}>
            <Box
              bg="purple.400"
              color="white"
              borderRadius={4}
              p={2}
              m={1}
              w="80px"
              h="80px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text>10</Text>
            </Box>
            <Box
              bg="purple.400"
              color="white"
              borderRadius={4}
              p={2}
              m={1}
              w="80px"
              h="80px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text>17</Text>
            </Box>
            <Box
              bg="purple.400"
              color="white"
              borderRadius={4}
              p={2}
              m={1}
              w="80px"
              h="80px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text>43</Text>
            </Box>
            <Box
              bg="purple.400"
              color="white"
              borderRadius={4}
              p={2}
              m={1}
              w="80px"
              h="80px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text>18</Text>
            </Box>
            <Box
              bg="purple.400"
              color="white"
              borderRadius={4}
              p={2}
              m={1}
              w="80px"
              h="80px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text>9</Text>
            </Box>
          </HStack> */}
        </Box>
      </GridItem>
    </Grid>
  );
}

export default Level;
