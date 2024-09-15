/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a modal component for editing a module
 */

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const EditModuleModal = ({ isOpen, onClose, module, onSave }) => {
  const [updatedModule, setUpdatedModule] = useState({
    heading: module?.heading || "",
    subheading: module?.subheading || "",
  });

  // Update the state when the module prop changes
  useEffect(() => {
    if (module) {
      setUpdatedModule({
        heading: module.heading,
        subheading: module.subheading,
      });
    }
  }, [module]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedModule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save the updated module
  const handleSave = () => {
    const updatedModuleWithRoute = {
      ...updatedModule,
      route: updatedModule.heading.toLowerCase().replace(/\s/g, "-"),
    };
    onSave(updatedModuleWithRoute);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Module</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Heading</FormLabel>
            <Input
              type="text"
              name="heading"
              value={updatedModule.heading}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Subheading</FormLabel>
            <Input
              type="text"
              name="subheading"
              value={updatedModule.subheading}
              onChange={handleInputChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModuleModal;
