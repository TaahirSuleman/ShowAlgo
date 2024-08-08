import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  ButtonGroup,
  Button,
  Stack,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import {
  FaCloudUploadAlt,
  FaPause,
  FaPlay,
  FaPlayCircle,
  FaStop,
} from "react-icons/fa";

function RunControls({
  submitButton = false,
  isSubmitLoading,
  submitCode,
  value,
  isRunLoading,
  runCode,
  stopCode,
  pauseState,
  setPauseState,
  pauseAnimation,
  speedState,
  setSpeedState
}) {
  const [isResuming, setIsResuming] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.5, 2];

  //! Finish this function
  const handlePauseResume = () => {
    setPauseState(!pauseState);
  };

  const handleRunStop = () => {
    if (isRunning) {
      stopCode();
    } else {
      runCode();
    }
    setIsRunning(!isRunning);
  };

  const handleSpeedChange = () => {
    const currentIndex = speedOptions.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    setSpeed(speedOptions[nextIndex]);
    setSpeedState(3/speedOptions[nextIndex])
    
  };

  const columns = useBreakpointValue({
    base: 1, // Single column layout for small screens
    sm: 2, // Two columns layout for medium screens
    md: submitButton ? 4 : 3, // Two columns layout for medium and larger screens
  });

  return (
    <Box bg="blackAlpha.900" width="auto" mt={4} borderRadius={10} p={4}>
      <SimpleGrid columns={columns} spacing={4}>
        <Button
          variant="solid"
          colorScheme={isRunning ? "red" : "green"}
          isDisabled={value === ""}
          onClick={handleRunStop}
          isLoading={isRunLoading}
          width="100%"
        >
          {isRunning ? <FaStop /> : <FaPlay />}
          <Box as="span" ml={2}>
            {isRunning ? "Stop" : "Run"}
          </Box>
        </Button>

        <Button
          variant="outline"
          colorScheme={pauseState ? "green" : "red"}
          isDisabled={value === ""}
          onClick={handlePauseResume}
          width="100%"
        >
          {isResuming ? <FaPause size="1em" /> : <FaPlayCircle size="1.6em" />}
          <Box as="span" ml={2}>
            {pauseState ? "Resume" : "Pause"}
          </Box>
        </Button>

        <Button
          variant="outline"
          colorScheme="purple"
          onClick={handleSpeedChange}
          width="100%"
        >
          <Box as="span">Speed: {speed}x</Box>
        </Button>

        {submitButton && (
          <Button
            variant="solid"
            colorScheme="blue"
            isDisabled={value === ""}
            onClick={submitCode}
            isLoading={isSubmitLoading}
            width="100%"
          >
            <FaCloudUploadAlt size="1.6em" />
            <Box as="span" ml={2}>
              Submit
            </Box>
          </Button>
        )}
      </SimpleGrid>
    </Box>
  );
}

export default RunControls;
