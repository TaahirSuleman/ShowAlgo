import React, { useEffect, useState } from "react";
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
  setSpeedState,
  killState,
  indexState,
  setOutput
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.5, 2];
  const [isFinished, setIsFinished] = useState(false)

  useEffect(()=>{
    if (killState === indexState){
      setIsRunning(false)
      setIsFinished(true)
      setOutput((prev) => [...prev, `colourYellow__RUN COMPLETE.`]);
    }
    console.log("kill "+killState)
  },[indexState])

  const handlePauseResume = () => {
    setPauseState(!pauseState);
  };


  const handleRunStop = async () => {
    if (isRunning) {
      stopCode();
      console.log("RAW STOP")
    } else if (isFinished) {
      console.log("FINISHED STOP AND START")
      stopCode();
      setIsFinished(false);
      setIsRunning(true)
      const timeout = setTimeout(() => {
        runCode();
      }, speedState + 2000 + 1000);
      return () => timeout;
    } else {
      console.log("FROM THE BENINGING")
      runCode();
    }
    setIsRunning(!isRunning);
  };

  const handleSpeedChange = () => {
    const currentIndex = speedOptions.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    setSpeed(speedOptions[nextIndex]);
    setSpeedState(2/speedOptions[nextIndex]) // THE HARD CODED VALUE HERE (2) IS THE STARTING SPEED STATE
    
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
          colorScheme={isRunning ? "red" : "green" }
          isDisabled={value === ""}
          onClick={handleRunStop}
          isLoading={isRunLoading}
          width="100%"
        >
          {isRunning ? <FaStop /> : <FaPlay /> }
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
          {pauseState ? <FaPlayCircle size="1.6em" /> : <FaPause size="1em" />}
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
