/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the navigation bar for the guest user
 */

import {
  Button,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  Heading,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

export default function GuestNavBar() {
  const navigate = useNavigate();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const cancelRef = useRef();

  // Exit function
  const Exit = async () => {
      try {
        // Redirect to home page
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    };

  // Closes the dialog
  const handleExitClick = () => {
    setIsExitDialogOpen(true);
  };

  // Confirm exit by redirecting to home page
  const handleExitConfirm = () => {
    setIsExitDialogOpen(false);
    Exit();
  };

  // Cancel exit
  const handleExitCancel = () => {
    setIsExitDialogOpen(false);
  };

  return (
    <nav>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Heading>ShowAlgo</Heading>

        <Button
          onClick={handleExitClick}
          bg="gray.800"
          sx={{
            _hover: {
              bg: "red.400",
            },
          }}
        >
          Exit
        </Button>
      </Box>

      <AlertDialog
        isOpen={isExitDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleExitCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Exit
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to exit?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleExitCancel}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleExitConfirm} ml={3}>
                Exit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </nav>
  );
}
