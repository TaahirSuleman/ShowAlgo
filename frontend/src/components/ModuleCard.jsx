/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a ModuleCard component
 */

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

function ModuleCard({
  heading,
  subheading,
  totalLevels,
  completedLevels,
  completedPercentage,
  color = "linear(to-br, #1203fa, #00e1fd)",
  onGoClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
  type = "user",
}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onClose = () => setIsAlertOpen(false);
  const cancelRef = React.useRef();

  const handleDeleteClick = () => {
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    onDeleteClick();
    onClose();
  };

  // Get color based on percentage for progress bar
  const getColorByPercentage = (percentage) => {
    if (percentage <= 25) {
      return "red.400";
    } else if (percentage <= 50) {
      return "orange.400";
    } else if (percentage <= 75) {
      return "yellow.400";
    } else if (percentage < 100) {
      return "green.400";
    } else {
      return "green.500";
    }
  };

  return (
    <Card borderRadius={10}>
      <CardBody>
        <Box bgGradient={color} borderRadius={6} height="30dvh" p={4}>
          <Heading fontSize="3xl" color="white">
            {heading}
          </Heading>
          <Heading mt={2} fontSize="lg" color="whiteAlpha.700">
            {subheading}
          </Heading>
        </Box>

        <Divider bg="white" mt={5} />

        <Stack mt="6" spacing="5">
          {type === "admin" ? (
            <Text fontWeight="" fontSize="xl" textAlign="center">
              Total levels:{" "}
              <Text as="span" fontWeight="bold" fontSize="3xl">
                {totalLevels}
              </Text>
            </Text>
          ) : (
            <HStack justifyContent="space-evenly">
              <VStack spacing={0}>
                <HStack>
                  <Text fontSize="5xl" fontWeight="bold" color="whiteAlpha.900">
                    {completedLevels}
                  </Text>
                  <Text fontSize="xl" mt={6}>
                    / {totalLevels}
                  </Text>
                </HStack>
                <Text color="whiteAlpha.700">Levels Completed</Text>
              </VStack>

              <CircularProgress
                value={completedPercentage}
                color={getColorByPercentage(completedPercentage)}
                trackColor="gray.600"
                size="100px"
                thickness="16px"
              >
                <CircularProgressLabel fontSize="lg">
                  {completedPercentage}%
                </CircularProgressLabel>
              </CircularProgress>
            </HStack>
          )}

          {type === "admin" ? (
            <ButtonGroup>
              <IconButton
                icon={<ViewIcon />}
                colorScheme="green"
                onClick={onViewClick}
                width="67%"
              />
              <IconButton
                icon={<EditIcon />}
                colorScheme="blue"
                onClick={onEditClick}
                width="17%"
              />
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={handleDeleteClick}
              />
            </ButtonGroup>
          ) : (
            <Button colorScheme="whatsapp" onClick={onGoClick}>
              Go
            </Button>
          )}
        </Stack>
      </CardBody>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Module
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this module? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
}

ModuleCard.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string.isRequired,
  totalLevels: PropTypes.number.isRequired,
  completedLevels: PropTypes.number,
  completedPercentage: PropTypes.number,
  color: PropTypes.string,
  onGoClick: PropTypes.func,
  onViewClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  type: PropTypes.oneOf(["user", "admin"]),
};

export default ModuleCard;
