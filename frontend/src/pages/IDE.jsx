import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import CodeEditorView from "../components/CodeEditorView";
import OutputView from "../components/OutputView";

function IDE() {
  const [value, setValue] = useState("");
  const [output, setOutput] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [isClearLoading, setIsClearLoading] = useState(false);

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

  const clearCode = () => {
    setIsClearLoading(true);
    setTimeout(() => {
      setValue("");
      setIsClearLoading(false);
      setOutput([]);
    }, 2000);
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
    // <Box>
    //   <HStack height="50%" p={4}>
    //     <VStack>
    //       <Heading fontSize="2xl" fontWeight="normal" color="whiteAlpha.700">
    //         Code Editor
    //       </Heading>

    //       <Box bg="red.400">
    //         <Box bg="yellow.400">
    //           <Button
    //             variant="solid"
    //             colorScheme="green"
    //             onClick={runCode}
    //             isLoading={isLoading}
    //             m={2}
    //           >
    //             Run Code
    //           </Button>
    //         </Box>
    //         <CodeEditorView
    //           height="45dvh"
    //           width="50dvw"
    //           theme="vs-dark"
    //           defaultValue={sampleCode}
    //         />
    //       </Box>
    //       <Heading fontSize="2xl" fontWeight="normal" color="whiteAlpha.700">
    //         Output View
    //       </Heading>
    //       <OutputView height="50dvh" width="50dvw" output={output} />
    //     </VStack>

    //     <VStack width="100%">
    //       <Heading
    //         fontSize="2xl"
    //         fontWeight="normal"
    //         color="whiteAlpha.700"
    //         pb={2}
    //       >
    //         Visualisation View
    //       </Heading>
    //       <Box
    //         width="100%"
    //         height="108dvh"
    //         bg="blackAlpha.600"
    //         borderRadius={4}
    //       >
    //         {/* //! For demo purposes, must be removed */}
    //         <HStack justifyContent="center" mt={10}>
    //           <Box
    //             bg="purple.400"
    //             color="white"
    //             borderRadius={4}
    //             p={2}
    //             m={1}
    //             w="80px"
    //             h="80px"
    //             display="flex"
    //             justifyContent="center"
    //             alignItems="center"
    //           >
    //             <Text>10</Text>
    //           </Box>
    //           <Box
    //             bg="purple.400"
    //             color="white"
    //             borderRadius={4}
    //             p={2}
    //             m={1}
    //             w="80px"
    //             h="80px"
    //             display="flex"
    //             justifyContent="center"
    //             alignItems="center"
    //           >
    //             <Text>17</Text>
    //           </Box>
    //           <Box
    //             bg="purple.400"
    //             color="white"
    //             borderRadius={4}
    //             p={2}
    //             m={1}
    //             w="80px"
    //             h="80px"
    //             display="flex"
    //             justifyContent="center"
    //             alignItems="center"
    //           >
    //             <Text>43</Text>
    //           </Box>
    //           <Box
    //             bg="purple.400"
    //             color="white"
    //             borderRadius={4}
    //             p={2}
    //             m={1}
    //             w="80px"
    //             h="80px"
    //             display="flex"
    //             justifyContent="center"
    //             alignItems="center"
    //           >
    //             <Text>18</Text>
    //           </Box>
    //           <Box
    //             bg="purple.400"
    //             color="white"
    //             borderRadius={4}
    //             p={2}
    //             m={1}
    //             w="80px"
    //             h="80px"
    //             display="flex"
    //             justifyContent="center"
    //             alignItems="center"
    //           >
    //             <Text>9</Text>
    //           </Box>
    //         </HStack>
    //       </Box>
    //     </VStack>
    //   </HStack>
    // </Box>
    <Grid
      templateColumns={gridTemplateColumns}
      templateRows={gridTemplateRows}
      gap={4}
      p={4}
    >
      <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 2 }}>
        <Heading
          fontWeight="normal"
          color="whiteAlpha.700"
          textAlign="center"
          fontSize="2xl"
          mb={2}
        >
          Code Editor
        </Heading>
        <Box width={{ base: "94vw", md: "50vw" }} boxShadow="md">
          <Box
            bg="blackAlpha.800"
            borderTopRadius={4}
            display="flex"
            justifyContent="end"
            pb={2}
            pt={2}
          >
            <Button
              variant="solid"
              colorScheme="green"
              onClick={runCode}
              isLoading={isRunLoading}
              m={2}
            >
              Run
            </Button>
            <Button
              variant="solid"
              colorScheme="gray"
              onClick={clearCode}
              isLoading={isClearLoading}
              m={2}
            >
              Clear
            </Button>
          </Box>
          <CodeEditorView
            height="50dvh"
            width={{ base: "100%", md: "50vw" }}
            theme="vs-dark"
            defaultValue={sampleCode}
            value={value}
          />
        </Box>

        <Box>
          <Heading
            fontWeight="normal"
            color="whiteAlpha.700"
            textAlign="center"
            fontSize="2xl"
            mb={2}
            mt={3}
          >
            Output View
          </Heading>
          <Box
            borderRadius={4}
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
        <Heading
          fontWeight="normal"
          color="whiteAlpha.700"
          textAlign="center"
          fontSize="2xl"
          mb={2}
        >
          Visualisation View
        </Heading>

        <Box
          bg="blackAlpha.600"
          borderRadius={4}
          boxShadow="md"
          height={{ base: "75vh", md: "120vh" }}
          p={4}
        ></Box>
      </GridItem>
    </Grid>
  );
}

export default IDE;
