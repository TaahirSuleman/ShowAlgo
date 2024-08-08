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
    const cancelClearRef = useRef();
    const [speedState, setSpeedState] = useState(2);
    const [movementsState, setMovementsState] = useState();
    const [highlightState, setHighlightState] = useState();
    const [indexState, setIndexState] = useState(-1);
    const [pauseState, setPauseState] = useState(false);
    const [savedIndexState, setSavedIndexState] = useState(-1);
    const [bufferState, setBufferState] = useState(false);

    let savedIndex = -1;

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
                description:
                    "Swapped values in position 1 and 3 in array nums.",
            },
            {
                line: 15,
                operation: "swap",
                dataStructure: "array",
                firstPosition: 1,
                secondPosition: 3,
                varName: "letters",
                description:
                    "Swapped values in position 1 and 3 in array letters.",
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
        if (pauseState == false) {
            setBufferState(true);
        } else {
            setBufferState(false);
            setPauseState(false);
        }
    };

    const sampleText =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    const sampleCode = `def hello():
    array = [10, 17, 43, 18, 9]
    print("Hello, World!")
    return array`;

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
        /* OLD
    setIsRunLoading(true);
    setTimeout(() => {
      setIsRunLoading(false);
      setIndexState(0);
      setHighlightState(true)
    }, 2000);*/
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
            setOutput([]);
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

    return (
        <Grid
            templateColumns={gridTemplateColumns}
            templateRows={gridTemplateRows}
            gap={4}
            p={4}
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

                                <PopoverContent
                                    bg="blue.400"
                                    width="auto"
                                    border="none"
                                >
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
                                            "Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit sed do
                                            eiusmod tempor incididunt ut labore
                                            et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud
                                            exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat.
                                            Duis aute irure dolor in
                                            reprehenderit in voluptate velit
                                            esse cillum dolore eu fugiat nulla
                                            pariatur. Excepteur sint occaecat
                                            cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit
                                            anim id est laborum. Lorem ipsum
                                            dolor sit amet, consectetur
                                            adipiscing elit sed do eiusmod
                                            tempor incididunt ut labore et
                                            dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud
                                            exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat.
                                            Duis aute irure dolor in
                                            reprehenderit in voluptate velit
                                            esse cillum dolore eu fugiat nulla
                                            pariatur. Excepteur sint occaecat
                                            cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit
                                            anim id est laborum. Lorem ipsum
                                            dolor sit amet, consectetur
                                            adipiscing elit sed do eiusmod
                                            tempor incididunt ut labore et
                                            dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud
                                            exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat.
                                            Duis aute irure dolor in
                                            reprehenderit in voluptate velit
                                            esse cillum dolore eu fugiat nulla
                                            pariatur. Excepteur sint occaecat
                                            cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit
                                            anim id est laborum."
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
                        </Box>

                        <AlertDialog
                            isOpen={isClearDialogOpen}
                            leastDestructiveRef={cancelClearRef}
                            onClose={handleClearCancel}
                        >
                            <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader
                                        fontSize="lg"
                                        fontWeight="bold"
                                    >
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
                        bufferState={bufferState}
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
                        <Heading
                            fontWeight="normal"
                            color="whiteAlpha.900"
                            fontSize="2xl"
                        >
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
                    <Button onClick={() => pauseAnimation()}></Button>
                </Box>
            </GridItem>
        </Grid>
    );
}

export default GuestIDE;
