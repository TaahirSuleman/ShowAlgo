/**
 * Author(s): Yusuf Kathrada, Gregory Maselle
 * Date: September 2024
 * Description: This file contains the RunControls component that provides controls for running, pausing and submitting code
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  SimpleGrid,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  FaCloudUploadAlt,
  FaPause,
  FaPlay,
  FaPlayCircle,
  FaStop,
  FaChevronDown,
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
  setOutput,
  setHighlightState,
  isRestarting,
  isRunning,
  setIsRunning
}) {
  // state variables
  const [speed, setSpeed] = useState(1);
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.5, 2];
  const [isFinished, setIsFinished] = useState(false)

  // If the visualisation of all pseudocode has completed, unhighlight Code Editor, append to output view.
  useEffect(()=>{
    if (killState === indexState){
      setIsRunning(false)
      setIsFinished(true)
      setHighlightState(false)
      setOutput((prev) => [...prev, `colourYellow__RUN COMPLETE.`]);
    }
  },[indexState])
  
  const handlePauseResume = () => {
    setPauseState(!pauseState);
  };
  // Method used to handle stopping of a run.
  const handleRunStop = async () => {
    if (isRunning) { // Stopping in the middle of an animation
      stopCode();
    } else if (isFinished) { //restarting after a run has completed.
      stopCode();
      setIsFinished(false);
      setIsRunning(true)
      const timeout = setTimeout(() => {
        runCode();
      }, 2000);
      return () => timeout;
    } else { // The first start for the application.
      runCode();
    }
    setIsRunning(!isRunning);
  };

  // To handle the change in speed of the animation
  const handleSpeedChange = (option) => {
    setSpeed(option);
    setSpeedState(2/option) // THE HARD CODED VALUE HERE (2) IS THE STARTING SPEED STATE
    
  };

  // Responsiveness of the buttons
  const columns = useBreakpointValue({
    base: 1, // Single column layout for small screens
    sm: 2, // Two columns layout for medium screens
    md: submitButton ? 4 : 3, // Two columns layout for medium and larger screens
  });

  return (
    <Box bg="blackAlpha.900" width="auto" mt={3} borderRadius={10} p={3}>
      <SimpleGrid columns={columns} spacing={3}>
        <Button
          variant="solid"
          colorScheme={isRunning ? "red" : "green" }
          isDisabled={value === ""}
          onClick={handleRunStop}
          isLoading={isRunLoading || isRestarting}
          width="100%"
          height="33px"
        >
          {isRunning ? <FaStop /> : <FaPlay /> }
          <Box as="span" ml={2}>
            {isRunning ? "Stop" : "Run"}
          </Box>
        </Button>

        <Button
          variant="outline"
          colorScheme={pauseState ? "green" : "red"}
          isDisabled={indexState <= -1 || indexState >= killState}
          onClick={handlePauseResume}
          width="100%"
          height="33px"
        >
          {pauseState ? <FaPlayCircle size="1.6em" /> : <FaPause size="1em" />}
          <Box as="span" ml={2}>
            {pauseState ? "Resume" : "Pause"}
          </Box>
        </Button>

        <Menu>
          <MenuButton as={Button} rightIcon={<FaChevronDown />} variant="outline" colorScheme="purple" width="100%" height="33px">
            <Box as="span">Speed: {speed}x</Box>
          </MenuButton>
          <MenuList minW="125px">
            {speedOptions.map((option) => (
              <MenuItem key={option} onClick={() => handleSpeedChange(option)}>
                {option}x
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {submitButton && (
          <Button
            variant="solid"
            colorScheme="blue"
            isDisabled={value === ""}
            onClick={submitCode}
            isLoading={isSubmitLoading}
            width="100%"
            height="33px"
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
