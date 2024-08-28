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
import IDEComponent from "../components/IDEComponent";

function IDE() {
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
    }, speedState*1000 + 1000);
    return () => timeoutSetKey;
  };

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

      <IDEComponent
        value={value}
        setValue={setValue}
        output={output}
        setOutput={setOutput}
        speedState={speedState}
        movementsState={movementsState}
        highlightState={highlightState}
        setHighlightState={setHighlightState}
        indexState={indexState}
        setIndexState={setIndexState}
        pauseState={pauseState}
        setPauseState={setPauseState}
        bufferState={bufferState}
        keyValue={key}
        isClearLoading={isClearLoading}
        isClearOutputLoading={isClearOutputLoading}
        setIsClearOutputLoading={setIsClearOutputLoading}
        setIsClearLoading={setIsClearLoading}
      />

    </Box>
  );
}

export default IDE;
