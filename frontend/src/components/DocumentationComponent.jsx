import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  Input,
  IconButton,
  Code,
  Button,
  Tooltip,
  useClipboard,
  InputGroup,
  InputLeftElement,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  ButtonGroup,
  Textarea,
  useToast,
  FormHelperText,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import {
  SearchIcon,
  CopyIcon,
  EditIcon,
  DeleteIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import axios from "axios";

const DocumentationComponent = ({ admin = false }) => {
  const toast = useToast();
  const [documentation, setDocumentation] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();
  const btnRef = React.useRef(null);
  const [sectionBeingEdited, setSectionBeingEdited] = useState({
    title: "",
    content: "",
    _id: "",
  });
  const [selectedSection, setSelectedSection] = useState(null); // State for selected section
  const [isEditing, setIsEditing] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [newSection, setNewSection] = useState({
    title: "",
    content: "",
  });
  const {
    isOpen: isAddSectionOpen,
    onOpen: onAddSectionOpen,
    onClose: onAddSectionClose,
  } = useDisclosure();
  const {
    isOpen: isEditSectionOpen,
    onOpen: onEditSectionOpen,
    onClose: onEditSectionClose,
  } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch the documentation sections
  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        const response = await axios.get("/get-documentation");
        setDocumentation(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDocumentation();
  }, []);

  const filteredSections = documentation.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewSectionSubmit = () => {
    if (!newSection.title || !newSection.content) {
      toast({
        title: "Error",
        description: "Title and Content cannot be empty.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const sectionToSubmit = {
          title: newSection.title,
          content: newSection.content,
        };
        const response = await axios.post(
          "/create-documentation-section",
          sectionToSubmit
        );

        if (response.data.error) {
          toast({
            title: "Error",
            description: response.data.error,
            status: "error",
            duration: 2500,
            isClosable: true,
          });
        } else {
          setDocumentation([...documentation, response.data]);
          toast({
            title: "Success",
            description: "Section added successfully.",
            status: "success",
            duration: 2500,
            isClosable: true,
          });
          onAddSectionClose();
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      } finally {
        setNewSection({
          title: "",
          content: "",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDeleteClick = (section) => {
    setSectionToDelete(section);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `/delete-documentation-section/${sectionToDelete._id}`
      );

      if (response.data.error) {
        toast({
          title: "Error",
          description: response.data.error,
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      } else {
        setDocumentation(
          documentation.filter((section) => section._id !== sectionToDelete._id)
        );
        toast({
          title: "Success",
          description: "Section deleted successfully.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        setSelectedSection(null); // Clear selected section if it's deleted
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setIsAlertOpen(false);
      setSectionToDelete(null);
    }
  };

  const handleEditClick = (section) => {
    setSectionBeingEdited({ ...section });
    setIsEditing(true);
    onEditSectionOpen();
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        `/update-documentation-section/${sectionBeingEdited._id}`,
        sectionBeingEdited
      );
      if (response.data && response.data.error) {
        toast({
          title: "Error",
          description: response.data.error,
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      } else if (response.data) {
        setDocumentation((prevDocumentation) =>
          prevDocumentation.map((section) =>
            section._id === sectionBeingEdited._id ? response.data : section
          )
        );
        toast({
          title: "Success",
          description: "Section updated successfully.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        onEditSectionClose();
        setIsEditing(false);
        setSelectedSection(response.data); // Update the selected section with the new content
      } else {
        toast({
          title: "Error",
          description: "Unexpected response from server.",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      const fetchDocumentation = async () => {
        try {
          const response = await axios.get("/get-documentation");
          setDocumentation(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchDocumentation();
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setSectionBeingEdited(null);
    onEditSectionClose();
  };

  const parseContent = (content) => {
    // Split the content by the CodeBlock delimiters
    const codeBlockParts = content.split(/<<|>>/);

    // Iterate through the parts and replace delimiters with components
    return codeBlockParts.flatMap((part, index) => {
      if (index % 2 === 1) {
        // This is a code block part
        return <CodeBlock key={index} code={part.trim()} />;
      } else {
        // Split the part by the Code delimiters
        const codeParts = part.split(/<|>/);
        return codeParts.map((subPart, subIndex) => {
          if (subIndex % 2 === 1) {
            // This is a code part
            return <Code key={`${index}-${subIndex}`}>{subPart.trim()}</Code>;
          } else {
            // This is a normal text part
            return (
              <Text
                key={`${index}-${subIndex}`}
                whiteSpace={"pre-wrap"}
                as="span"
              >
                {subPart}
              </Text>
            );
          }
        });
      }
    });
  };

  return (
    <Box p={2} width="100%">
      <Flex
        direction={{ base: "column", md: "row" }}
        p={4}
        bg="blackAlpha.500"
        borderRadius={10}
      >
        {/* Sidebar */}
        {isMobile ? (
          <>
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Open Menu"
              onClick={onDrawerOpen}
              mb={4}
              alignSelf="flex-start"
            />
            <Drawer
              isOpen={isDrawerOpen}
              placement="left"
              onClose={onDrawerClose}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Documentation</DrawerHeader>

                <DrawerBody>
                  <InputGroup mb={4}>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>

                  <VStack align="start">
                    {filteredSections.map((section, index) => (
                      <Button
                        key={index}
                        variant="link"
                        onClick={() => {
                          setSelectedSection(section);
                          onDrawerClose();
                        }} // Set the selected section
                      >
                        {section.title}
                      </Button>
                    ))}
                    {admin && (
                      <Button border="1px solid" onClick={onAddSectionOpen}>
                        Add New Section
                      </Button>
                    )}
                    <Modal
                      onClose={onAddSectionClose}
                      finalFocusRef={btnRef}
                      isOpen={isAddSectionOpen}
                      scrollBehavior="inside"
                    >
                      <ModalOverlay />
                      <ModalContent bg="gray.900">
                        <ModalHeader>Add New Section</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <FormControl id="title" mb={4}>
                            <FormLabel>Title</FormLabel>
                            <Input
                              type="text"
                              value={newSection.title}
                              onChange={(e) =>
                                setNewSection({
                                  ...newSection,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Enter title"
                            />
                          </FormControl>

                          <FormControl id="content">
                            <FormLabel>Content</FormLabel>
                            <Textarea
                              type="text"
                              value={newSection.content}
                              onChange={(e) =>
                                setNewSection({
                                  ...newSection,
                                  content: e.target.value,
                                })
                              }
                              placeholder="Enter content"
                            />
                          </FormControl>
                        </ModalBody>
                        <ModalFooter>
                          <ButtonGroup>
                            <Button
                              colorScheme="blue"
                              onClick={handleNewSectionSubmit}
                              isLoading={isLoading}
                            >
                              Save
                            </Button>
                            <Button onClick={onAddSectionClose}>Cancel</Button>
                          </ButtonGroup>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Box w="20%" p={4} borderRight="1px solid">
            <Heading size="md" mb={4}>
              Documentation
            </Heading>

            <InputGroup mb={4}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <VStack align="start">
              {filteredSections.map((section, index) => (
                <Button
                  key={index}
                  variant="link"
                  onClick={() => setSelectedSection(section)} // Set the selected section
                  width="100%"
                  justifyContent="flex-start"
                >
                  <Text isTruncated>{section.title}</Text>
                </Button>
              ))}
              {admin && (
                <Button
                  border="1px solid"
                  onClick={onAddSectionOpen}
                  width="100%"
                >
                  Add New Section
                </Button>
              )}
              <Modal
                onClose={onAddSectionClose}
                finalFocusRef={btnRef}
                isOpen={isAddSectionOpen}
                scrollBehavior="inside"
              >
                <ModalOverlay />
                <ModalContent bg="gray.900">
                  <ModalHeader>Add New Section</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl id="title" mb={4}>
                      <FormLabel>Title</FormLabel>
                      <Input
                        type="text"
                        value={newSection.title}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter title"
                      />
                    </FormControl>

                    <FormControl id="content">
                      <FormLabel>Content</FormLabel>
                      <Textarea
                        type="text"
                        value={newSection.content}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            content: e.target.value,
                          })
                        }
                        placeholder="Enter content"
                      />
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <ButtonGroup>
                      <Button
                        colorScheme="blue"
                        onClick={handleNewSectionSubmit}
                        isLoading={isLoading}
                      >
                        Save
                      </Button>
                      <Button onClick={onAddSectionClose}>Cancel</Button>
                    </ButtonGroup>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </VStack>
          </Box>
        )}

        {/* Content Area */}
        <Box w="100%" p={4}>
          {selectedSection ? (
            <>
              <Heading size="lg" mb={4}>
                {selectedSection.title}
              </Heading>
              <Box>{parseContent(selectedSection.content)}</Box>
              {admin && (
                <HStack mt={4} spacing={2}>
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme="blue"
                    onClick={() => handleEditClick(selectedSection)}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeleteClick(selectedSection)}
                  />
                </HStack>
              )}
            </>
          ) : (
            // automatically select the first section if none is selected
            documentation.length > 0 && (
              <Box>
                <Heading size="lg" mb={4}>
                  {documentation[0].title}
                </Heading>
                <Box>{parseContent(documentation[0].content)}</Box>
                {admin && (
                  <HStack mt={4} spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={() => handleEditClick(documentation[0])}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDeleteClick(documentation[0])}
                    />
                  </HStack>
                )}
              </Box>
            )
          )}
          {isEditing && (
            <Modal
              isOpen={isEditSectionOpen}
              onClose={handleEditCancel}
              scrollBehavior="inside"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Section</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl id="title" mb={4}>
                    <FormLabel>Title</FormLabel>
                    <Input
                      type="text"
                      value={sectionBeingEdited?.title || ""}
                      onChange={(e) =>
                        setSectionBeingEdited({
                          ...sectionBeingEdited,
                          title: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl id="content">
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      type="text"
                      value={sectionBeingEdited?.content || ""}
                      onChange={(e) =>
                        setSectionBeingEdited({
                          ...sectionBeingEdited,
                          content: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleEditSave}>
                    Save
                  </Button>
                  <Button variant="ghost" onClick={handleEditCancel}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Box>
      </Flex>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Section
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this section? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

const CodeBlock = ({ code }) => {
  const { hasCopied, onCopy } = useClipboard(code);

  return (
    <Box position="relative" mt={1} >
      <Code p={4} display="block" whiteSpace="pre-wrap">
        {code}
      </Code>
      <Tooltip label={hasCopied ? "Copied!" : "Copy"}>
        <IconButton
          aria-label="Copy code"
          icon={<CopyIcon />}
          size="sm"
          onClick={onCopy}
          position="absolute"
          top="0"
          right="0"
          mt={2}
          mr={2}
        />
      </Tooltip>
    </Box>
  );
};

export default DocumentationComponent;
