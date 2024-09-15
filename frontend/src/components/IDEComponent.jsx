/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the IDE component consisting of the code editor, output view and visualisation view
 */

import React, { useRef, useState } from "react";
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
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useBreakpointValue,
  useDisclosure,
  Checkbox,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { InfoIcon } from "@chakra-ui/icons";
import CodeEditorView from "../components/CodeEditorView";
import OutputView from "../components/OutputView";
import MainVisualisationWindow from "../components/MainVisualisationWindow";
import DocumentationComponent from "../components/DocumentationComponent";

function IDEComponent({
  value,
  setValue,
  output,
  setOutput,
  speedState,
  movementsState,
  highlightState,
  setHighlightState,
  indexState,
  setIndexState,
  pauseState,
  setPauseState,
  bufferState,
  keyValue,
  isClearLoading,
  isClearOutputLoading,
  setIsClearLoading,
  setIsClearOutputLoading,
  defaultValue,
  level = false,
  followOutputState,
  setFollowOutputState,
  followVisState,
  setFollowVisState,
  isError,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const cancelClearRef = useRef();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  // Clear code on confirm
  const handleClearConfirm = () => {
    setIsClearDialogOpen(false);
    clearCode();
  };

  // Cancel clear code
  const handleClearCancel = () => {
    setIsClearDialogOpen(false);
  };

  // Clear code
  const clearCode = () => {
    setIsClearLoading(true);
    setTimeout(() => {
      level ? setValue(defaultValue) : setValue("");
      setIsClearLoading(false);
    }, 1000);
  };

  // Clear output
  const clearOutput = () => {
    setIsClearOutputLoading(true);
    setTimeout(() => {
      setOutput([]);
      setIsClearOutputLoading(false);
    }, 1000);
  };

  // Handle checkbox change for auto-scrolling output
  const handleCheckboxChangeOutput = (e) => {
    setFollowOutputState(e.target.checked);
  };

  // Handle checkbox change for auto-scrolling visualisation
  const handleCheckboxChangeVis = (e) => {
    setFollowVisState(e.target.checked);
  };

  // Responsive grid layout
  const gridTemplateColumns = useBreakpointValue({
    base: "1fr",
    md: "0.5fr 1fr",
  });

  // Responsive grid layout
  const gridTemplateRows = useBreakpointValue({
    base: "auto",
    md: "1fr 1fr",
  });

  const flexDirection = useBreakpointValue({ base: "column", md: "row" });

  return (
    <Grid
      templateColumns={gridTemplateColumns}
      templateRows={gridTemplateRows}
      gap={2}
      p={4}
      overflow="auto"
    >
      {/* Responsive Grid layout*/}
      <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 2 }}>
        <Box
          width={{ base: "94dvw", md: "40dvw" }}
          boxShadow="md"
          borderBottomRadius={10}
          borderTopRadius={11}
          overflow="hidden"
          bg={isError ? "red.400" : "none"}
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
              onClick={() => setIsClearDialogOpen(true)}
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
            defaultValue={defaultValue}
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
            indexState={indexState}
          />
        </Box>

        <Box
          mt={2}
          borderBottomRadius={10}
          overflow="hidden"
          width={{ base: "94dvw", md: "40dvw" }}
        >
          <Box
            bg="blackAlpha.900"
            borderTopRadius={10}
            p={2}
            display="flex"
            alignItems="center"
            height="8dvh"
            width={{ base: "94dvw", md: "40dvw" }}
          >
            <Button
              variant="solid"
              colorScheme="red"
              isDisabled={output.length === 0}
              onClick={clearOutput}
              isLoading={isClearOutputLoading}
              m={2}
              pl={1}
              size="xs"
            >
              <IoClose size="1.6em" />
              <Box as="span">Clear</Box>
            </Button>

            <Box width="20%"/>

            <HStack
              flexDirection={flexDirection}
              justifyContent={{ base: "center", md: "space-between" }}
              spacing={{ base: 0, md: 110 }}
            >
              <Heading fontWeight="normal" color="whiteAlpha.900" fontSize="xl">
                Output View
              </Heading>

              <Checkbox
                isChecked={followOutputState}
                onChange={handleCheckboxChangeOutput}
                colorScheme="green"
                size="sm"
                mr={{ base: 0, md: 2 }}
              >
                Auto-scroll
              </Checkbox>
            </HStack>

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
              followOutputState={followOutputState}
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
          justifyContent={{ base: "center", md: "space-between" }}
          height="8dvh"
          width={{ base: "94dvw", md: "55dvw" }}
          flexDirection={flexDirection}
        >
          <Heading
            fontWeight="normal"
            color="whiteAlpha.900"
            fontSize="xl"
            textAlign="center"
            ml={{ base: 0, md: 20 }}
            flex={{ base: 0, md: 1 }}
          >
            Visualisation View
          </Heading>

          <Checkbox
            isChecked={followVisState}
            onChange={handleCheckboxChangeVis}
            colorScheme="green"
            size="sm"
            mr={{ base: 0, md: 2 }}
          >
            Auto-scroll
          </Checkbox>
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
            key={keyValue}
            movementsState={movementsState}
            output={output}
            setOutput={setOutput}
            speedState={speedState}
            indexState={indexState}
            setIndexState={setIndexState}
            pauseState={pauseState}
            setPauseState={setPauseState}
            bufferState={bufferState}
            followOutputState={followOutputState}
            followVisState={followVisState}
          />
        </Box>
      </GridItem>
    </Grid>
  );
}

export default IDEComponent;
