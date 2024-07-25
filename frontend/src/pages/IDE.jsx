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
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import CodeEditorView from "../components/CodeEditorView";
import OutputView from "../components/OutputView";
import { FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function IDE() {
  const [value, setValue] = useState("");
  const editorRef = useRef();
  const [output, setOutput] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearLoading, setIsClearLoading] = useState(false);
  const cancelClearRef = useRef();

  // very long sample text
  const sampleText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const sampleCode = `def hello():
  array = [10, 17, 43, 18, 9]
  print("Hello, World!")
  return array`;

  const runCode = () => {
    setIsRunLoading(true);
    setTimeout(() => {
      setIsRunLoading(false);
      setOutput(["Hello, World!"]);
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
        <Box width={{ base: "94vw", md: "50vw" }} boxShadow="md" borderBottomRadius={10} overflow="hidden">
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
            //! remove default value
            // defaultValue={sampleCode}
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
        <Box bg="blackAlpha.900" borderTopRadius={10} p={2} display="flex" alignItems="center" justifyContent="center" height="12dvh">
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

export default IDE;
