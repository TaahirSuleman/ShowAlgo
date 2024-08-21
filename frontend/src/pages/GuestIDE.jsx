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

//   useEffect(() => {
//     setMovementsState([
//       {
//         "line": 4,
//         "operation": "loop_from_to",
//         "range": "0 to 3",
//         "looping_var": "i",
//         "body": [
//           {
//             "line": 3,
//             "operation": "print",
//             "isLiteral": false,
//             "varName": "i",
//             "literal": null,
//             "timestamp": "2024-08-14T16:51:45.846Z",
//             "description": "Printed i."
//           }
//         ],
//         "timestamp": "2024-08-14T16:51:45.846Z",
//         "description": "Loop from 0 to 10."
//       }, 
//       {
//           line: 6,
//           operation: "set",
//           varName: "x",
//           type: "string",
//           value: "10000000000000000000000000000000000000000000000",
//           timestamp: "2024-07-09T12:01:00Z",
//           description: "Set variable x to number 10.",
//         }, 
//       {
//         line: 7,
//         operation: "create",
//         dataStructure: "array",
//         value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
//         length: 9,
//         id: "abcd",
//         type: "int",
//         varName: "nums",
//         timestamp: "2024-07-09T12:01:00Z",
//         description:
//           "Created an array named nums with initial values [1, 2, 3, 4].",
//       },
//       {
//         line: 7,
//         operation: "create",
//         dataStructure: "array",
//         value: ["a","b","c"],
//         length: 9,
//         id: "abcd",
//         type: "int",
//         varName: "letters",
//         timestamp: "2024-07-09T12:01:00Z",
//         description:
//           "Created an array named nums with initial values [1, 2, 3, 4].",
//       },
//       {
//         "line": 19,
//         "operation": "get",
//         "setName": "fetchedVar1", 
//         "varName": "nums",
//         "type": "number",  
//         "index": 2,  
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set variable fetchedVar to nums[2]."
//       },
//       {
//         line: 9,
//         operation: "remove",
//         dataStructure: "array",
//         id: "abcd",
//         varName: "nums",
//         positionToRemove: 2,
//         description: "Removed value at position 2 in array nums",
//       },
//       {
//         operation:"loop_end",
//         description:"end this loop"
//       },
//       {
//         "line": 4,
//         "operation": "loop_from_to",
//         "range": "0 to 4",
//         "looping_var": "k",
//         "timestamp": "2024-08-14T16:51:45.846Z",
//         "description": "Loop from 0 to 10."
//       },  
//       {
//         "line": 19,
//         "operation": "get",
//         "setName": "fetchedVar2", 
//         "varName": "nums",
//         "type": "number",  
//         "index": 2,  
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set variable fetchedVar to nums[2]."
//       },
//       {
//         "line": 19,
//         "operation": "setArr",
//         "varName": "nums",
//         "index": 2,  
//         "setValue" : 25,
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set nums[2] to 25."
//       },
//       {
//         "line": 19,
//         "operation": "get",
//         "setName": "fetchedVar3", 
//         "varName": "nums",
//         "type": "number",  
//         "index": 2,  
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set variable fetchedVar to nums[2]."
//       },
//       {
//         line: 11,
//         operation: "add",
//         dataStructure: "array",
//         value: 99,
//         varName: "nums",
//         position: 2,
//         timestamp: "2024-07-09T12:02:00Z",
//         description: "Inserted value 5 at position 4 in array nums.",
//       },
//       {
//         "line": 19,
//         "operation": "get",
//         "setName": "fetchedVar4", 
//         "varName": "nums",
//         "type": "number",  
//         "index": 2,  
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set variable fetchedVar to nums[2]."
//       },
//       {
//         operation:"loop_end",
//         description:"end this loop"
//       },
//       {
//         line: 14,
//         operation: "swap",
//         dataStructure: "array",
//         firstPosition: 2,
//         secondPosition: 6,
//         varName: "nums",
//         description: "Swapped values in position 1 and 3 in array nums.",
//       },
//       {
//         "line": 19,
//         "operation": "get",
//         "setName": "fetchedVar5", 
//         "varName": "nums",
//         "type": "number",  
//         "index": 2,  
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set variable fetchedVar to nums[2]."
//       },
//       {
//         line: 1,
//         operation: "if",
//         condition: "x > 5",
//         result: true,
//         timestamp: "2024-07-09T12:02:00Z",
//         description: "Checked if x is greater than 5.",
//       },
//       {
//         line: 2,
//         operation: "print",
//         isLiteral: true,
//         varName: null,
//         literal: "x is greater than 5",
//         timestamp: "2024-07-09T12:03:00Z",
//         description: "Printed 'x is greater than 5'.",
//       },
//       {
//         line: 3,
//         operation: "else",
//         timestamp: "2024-07-09T12:04:00Z",
//         description: "Else block not executed as condition was true.",
//       },
//       {
//         line: 6,
//         operation: "set",
//         varName: "x",
//         type: "number",
//         value: 10,
//         timestamp: "2024-07-09T12:01:00Z",
//         description: "Set variable x to number 10.",
//       },
//       {
//         line: 7,
//         operation: "create",
//         dataStructure: "array",
//         value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
//         length: 9,
//         id: "abcd",
//         type: "int",
//         varName: "nums",
//         timestamp: "2024-07-09T12:01:00Z",
//         description:
//           "Created an array named nums with initial values [1, 2, 3, 4].",
//       },
//       {
//         "line": 19,
//         "operation": "setArr",
//         "varName": "nums",
//         "index": 2,  
//         "setValue" : 25,
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set nums[2] to 25."
//         },
//       {
//         line: 8,
//         operation: "create",
//         dataStructure: "array",
//         value: ["a", "b", "c", "d", "e", "f", "g"],
//         type: "string",
//         varName: "letters",
//         timestamp: "2024-07-09T12:01:00Z",
//         description:
//           "Created an array named letters with initial values [a,b,c,d,e,f,g].",
//       },
//       {
//         line: 9,
//         operation: "remove",
//         dataStructure: "array",
//         id: "abcd",
//         varName: "nums",
//         positionToRemove: 2,
//         description: "Removed value at position 2 in array nums",
//       },
//       {
//         line: 10,
//         operation: "remove",
//         dataStructure: "array",
//         id: "abcd",
//         varName: "letters",
//         positionToRemove: 4,
//         description: "Removed value at position 4 in array letters",
//       },
//       {
//         line: 11,
//         operation: "add",
//         dataStructure: "array",
//         value: 5,
//         varName: "nums",
//         position: 4,
//         timestamp: "2024-07-09T12:02:00Z",
//         description: "Inserted value 5 at position 4 in array nums.",
//       },
//       {
//         line: 12,
//         operation: "create",
//         dataStructure: "array",
//         value: ["g", "a", "n", "g", "s", "t", "a"],
//         length: 7,
//         id: "abcd",
//         type: "string",
//         varName: "gansterlicious",
//         timestamp: "2024-07-09T12:01:00Z",
//         description:
//           "Created an array named letters with initial values [a,b,c,d,e,f,g].",
//       },
//       {
//         line: 13,
//         operation: "add",
//         dataStructure: "array",
//         value: "z",
//         varName: "letters",
//         position: 0,
//         timestamp: "2024-07-09T12:02:00Z",
//         description: "Inserted value 'z' at position 0 in array nums.",
//       },
//       {
//         line: 14,
//         operation: "swap",
//         dataStructure: "array",
//         firstPosition: 1,
//         secondPosition: 3,
//         varName: "nums",
//         description: "Swapped values in position 1 and 3 in array nums.",
//       },
//       {
//         line: 15,
//         operation: "swap",
//         dataStructure: "array",
//         firstPosition: 1,
//         secondPosition: 3,
//         varName: "letters",
//         description: "Swapped values in position 1 and 3 in array letters.",
//       },
//       {
//         line: 16,
//         operation: "set",
//         varName: "wordString",
//         type: "string",
//         value: "Hello World",
//         timestamp: "2024-07-09T12:01:00Z",
//         description: "Set variable y to string 'Wagwan World'.",
//       },
//       {
//         line: 17,
//         operation: "set",
//         varName: "z",
//         type: "boolean",
//         value: "true",
//         timestamp: "2024-07-09T12:01:00Z",
//         description: "Set variable z to boolean true.",
//       },
//       {
//         line: 18,
//         operation: "set",
//         varName: "wordString",
//         type: "string",
//         value: "Hello Again World",
//         timestamp: "2024-07-09T12:01:00Z",
//         description: "Set variable y to string 'Hello Again World'.",
//       },
//       {
//         "line": 19,
//         "operation": "get",
//         "setName": "fetchedVar", 
//         "varName": "nums",
//         "type": "number",  
//         "index": 2,  
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set variable fetchedVar to nums[2]."
//         }, 
//     ]);
//   }, []);
// very long sample text

  const pauseAnimation = () => {
    setPauseState(!pauseState);
  };

  const runCode = async () => {
    setIsRunLoading(true); // To show loading state on the button
    let code = value; // Get code from the editor
    //setMovementsState(actionFrames);
    // setIndexState(0);
    // setHighlightState(true);
    console.log(code)
    console.log("I oath im ran")
    try {
      let response = await axios.post(
        "http://localhost:8000/api/pseudocode/run",
        { code }
      );
      console.log(response.data.result);
      let actionFrames = response.data.result.actionFrames;
      setKillState(actionFrames.length)
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

//   const runCode = async () => {
//     setIsRunLoading(true); // To show loading state on the button
//     let code = value; // Get code from the editor
//     //setMovementsState(actionFrames);
//     // setIndexState(0);
//     // setHighlightState(true);
//     setMovementsState([
//       {
//       line: 7,
//       operation: "create_array",
//       dataStructure: "array",
//       value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
//       length: 9,
//       id: "abcd",
//       type: "int",
//       varName: "nums",
//       timestamp: "2024-07-09T12:01:00Z",
//       description:
//         "Created an array named nums with initial values [1, 2, 3, 4].",
//       },
//       {
//         "line": 19,
//         "operation": "get",
//         "setName": "fetchedVar2", 
//         "varName": "nums",
//         "type": "number",  
//         "index": 2,  
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set variable fetchedVar to nums[2]."
//       },
//       {
//         "line": 19,
//         "operation": "setArr",
//         "varName": "nums",
//         "index": 2,  
//         "setValue" : 25,
//         "timestamp": "2024-07-09T12:01:00Z",  
//         "description": "Set nums[2] to 25."
//       },
//       {
//         line: 11,
//         operation: "add",
//         dataStructure: "array",
//         value: 99,
//         varName: "nums",
//         position: 2,
//         timestamp: "2024-07-09T12:02:00Z",
//         description: "Inserted value 5 at position 4 in array nums.",
//       },
//       {
//         line: 9,
//         operation: "remove",
//         dataStructure: "array",
//         id: "abcd",
//         varName: "nums",
//         positionToRemove: 2,
//         description: "Removed value at position 2 in array nums",
//       },
//       {
//         line: 14,
//         operation: "swap",
//         dataStructure: "array",
//         firstPosition: 2,
//         secondPosition: 6,
//         varName: "nums",
//         description: "Swapped values in position 1 and 3 in array nums.",
//       },

//     ])
//     setIndexState(0);
//     setIsRunLoading(false);
//   };

  const stopCode = () => {
    let startTime;
    setPauseState(true);
    const timeoutSetKey = setTimeout(() => {
      console.log(`Time elapsed: ${(Date.now() - startTime) / 1000} seconds`);
      console.log("THIS IS THE SPEED STATE WHEN KILL: "+speedState)
      setIndexState(-1);
      setHighlightState(false);
      setKey((prevKey) => prevKey + 1);
      setPauseState(false);
      setOutput((prev) => [...prev, `colourYellow__PREVIOUS RUN TERMINATED OR COMPLETED. NEXT RUN OUTPUT WILL APPEAR BELOW.`]);
    }, speedState*1000 + 1000);
    startTime = Date.now(); // Start the timer
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
    md: "1fr 1fr", // Two columns layout for medium and larger screens
  });

  const gridTemplateRows = useBreakpointValue({
    base: "auto", // Single row layout for small screens
    md: "1fr 1fr", // Two rows layout for medium and larger screens
  });

//   const codePreprocessor = (pseudocode) => {
//     const lines = pseudocode.split("\r\n");
//     let result = [];
//     let loopBlock = [];
//     let insideLoop = false;
//     let loopVariable = '';
//     let start = 0;
//     let end = 0;
//     let currentLineNumber = 0; // Counter to track the current line number
//     let loopStartLine = 0; // To store the line number of the loop declaration

//     for (let line of lines) {
//         // Increment line number
//         currentLineNumber++;

//         // Trim whitespace for processing
//         line = line.trim();

//         // Check if the line is a loop declaration
//         const loopMatch = line.match(/^LOOP\s+(\w+)\s+FROM\s+(\d+)\s+TO\s+(\d+):$/i);
//         if (loopMatch) {
//             insideLoop = true;
//             loopVariable = loopMatch[1];
//             start = parseInt(loopMatch[2], 10);
//             end = parseInt(loopMatch[3], 10);
//             loopStartLine = currentLineNumber; // Store the line number of the loop declaration
//             // Set the loop variable to the start value
//             result.push(`/*${loopStartLine}*/ SET ${loopVariable} TO ${start}`);
//             continue;
//         }

//         // Check if we are ending a loop block
//         if (line === 'END LOOP') {
//             insideLoop = false;
//             const endLoopLineNumber = currentLineNumber; // The line number for END LOOP
//             // Expand the loop block
//             for (let i = start; i < end; i++) {
//                 result.push(`/*${loopStartLine}*/ IF ${loopVariable} is less than ${end} THEN`);
//                 for (let loopLine of loopBlock) {
//                     // Prepend the original line number as a flag for each line in the loop
//                     result.push(`    /*${loopLine.originalLineNumber}*/ ${loopLine.content}`);
//                 }
//                 // Add the line to increment the loop variable
//                 result.push(`    /*${loopStartLine}*/ set ${loopVariable} to ${loopVariable} + 1`);
//                 result.push(`/*${endLoopLineNumber}*/ END IF`);
//             }
//             // Clear the loop block after processing
//             loopBlock = [];
//             continue;
//         }

//         // If inside a loop block, accumulate the lines with their original line number
//         if (insideLoop) {
//             loopBlock.push({ content: line, originalLineNumber: currentLineNumber });
//         } else {
//             // If not inside a loop, add line to result as is
//             result.push(`/*${currentLineNumber}*/ ${line}`);
//         }
//     }

//     // Join the result array into a single string with Windows-style line breaks
//     return result.join("\r\n");
// }
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
          killState = {killState}
          indexState={indexState}
          setOutput={setOutput}
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
              height="50dvh"
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
