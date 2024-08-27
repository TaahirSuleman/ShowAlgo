import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import CodeEditorView from "../components/CodeEditorView";
import OutputView from "../components/OutputView";
import { FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { InfoIcon } from "@chakra-ui/icons";
import MainVisualisationWindow from "../components/MainVisualisationWindow";
import axios from "axios";
import RunControls from "../components/RunControls";
import DocumentationComponent from "../components/DocumentationComponent";

function GuestIDE() {
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
  const [movementsState, setMovementsState] = useState([]);
  const [highlightState, setHighlightState] = useState();
  const [indexState, setIndexState] = useState(-1);
  const [pauseState, setPauseState] = useState(false);
  const [savedIndexState, setSavedIndexState] = useState(-1);
  const [bufferState, setBufferState] = useState(false);
  const [key, setKey] = useState(0);
  const [killState, setKillState] = useState(-2);

  let savedIndex = -1;

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
      setValue("");
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
    md: "0.5fr 1fr", // Two columns layout for medium and larger screens
  });

  const gridTemplateRows = useBreakpointValue({
    base: "auto", // Single row layout for small screens
    md: "1fr 1fr", // Two rows layout for medium and larger screens
  });

  return (
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
        />
      </Box>

      <Grid
        templateColumns={gridTemplateColumns}
        templateRows={gridTemplateRows}
        gap={2}
        p={4}
        overflow="auto"
      >
        <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 2 }}>
          <Box
            width={{ base: "94dvw", md: "40dvw" }}
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
              height="8dvh"
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
                size="xs"
              >
                <IoClose size="1.6em" />
                <Box as="span">Clear</Box>
              </Button>

              <Box>
                <Heading
                  fontWeight="normal"
                  color="whiteAlpha.900"
                  textAlign="center"
                  fontSize="xl"
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
              speedState={speedState}
              movementsState={movementsState}
              height="33dvh"
              width={{ base: "100%", md: "50vw" }}
              theme="vs-dark"
              value={value}
              setValue={setValue}
              highlightState={highlightState}
              setHighlightState={setHighlightState}
              pauseState={pauseState}
              setPauseState={setPauseState}
            />
          </Box>

          <Box mt={2} borderBottomRadius={10} overflow="hidden" width={{ base: "94dvw", md: "40dvw" }}>
            <Box
              bg="blackAlpha.900"
              borderTopRadius={10}
              p={2}
              display="flex"
              alignItems="center"
              height="8dvh"
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
                // width="85px"
                size="xs"
              >
                <IoClose size="1.6em" />
                <Box as="span">Clear</Box>
              </Button>

              <Heading
                fontWeight="normal"
                color="whiteAlpha.900"
                fontSize="xl"
              >
                Output View
              </Heading>

              <Box width="84px" />
            </Box>
            <Box
              borderBottomRadius={4}
              height={{ base: "33dvh", md: "33dvh" }}
              boxShadow="md"
            >
              <OutputView
                height="100%"
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
            height="8dvh"
            width={{ base: "94dvw", md: "55dvw" }}
          >
            <Heading fontWeight="normal" color="whiteAlpha.900" fontSize="xl">
              Visualisation View
            </Heading>
          </Box>

          <Box
            bg="blackAlpha.600"
            borderBottomRadius={10}
            boxShadow="md"
            height={{ base: "75vh", md: "75dvh" }}
            p={4}
            width={{ base: "94dvw", md: "55dvw" }}
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
  );
}

export default GuestIDE;
