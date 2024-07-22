import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import CodeEditorView from "../components/CodeEditorView";
import OutputView from "../components/OutputView";

function IDE() {
  const [value, setValue] = useState("");
  const [output, setOutput] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // very long sample text
  const sampleText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const sampleCode = `def hello():
  array = [10, 17, 43, 18, 9]
  print("Hello, World!")
  return array`;

  const runCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOutput(["Hello, World!"]);
    }, 2000);
  };

  return (
    <Box>
      <HStack height="50%" p={4}>
        <VStack>
          <HStack
            width="100%"
            justifyContent="space-between"
            position="relative"
          >
            <Box position="absolute" width="100%" textAlign="center">
              <Heading
                fontSize="2xl"
                fontWeight="normal"
                color="whiteAlpha.700"
              >
                Code Editor
              </Heading>
            </Box>

            {/* Spacer to push the button to the right */}
            <Spacer />

            <Button
              variant="solid"
              colorScheme="green"
              onClick={runCode}
              isLoading={isLoading}
            >
              Run Code
            </Button>
          </HStack>

          <CodeEditorView
            height="50dvh"
            width="50dvw"
            theme="vs-dark"
            defaultValue={sampleCode}
          />
          <Heading fontSize="2xl" fontWeight="normal" color="whiteAlpha.700">
            Output View
          </Heading>
          <OutputView height="50dvh" width="50dvw" output={output} />
        </VStack>
        <VStack width="100%">
          <Heading fontSize="2xl" fontWeight="normal" color="whiteAlpha.700" pb={2}>
            Visualisation View
          </Heading>
          <Box
            width="100%"
            height="108dvh"
            bg="blackAlpha.600"
            borderRadius={4}
          >
            {/* //! For demo purposes, must be removed */}
            <HStack justifyContent="center" mt={10}>
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
            </HStack>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}

export default IDE;
