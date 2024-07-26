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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

export default function GuestNavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // access the user state from the UserContext
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const cancelRef = useRef();

  // Exit function
  const Exit = async () => {
    try {
      // Send a POST request to the logout endpoint
      await axios.post("/logout").then(() => {
        // Clear user data from localStorage
        localStorage.removeItem("user");
        // Reset user state
        setUser(null);
        // Redirect to home page
        navigate("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleExitClick = () => {
    setIsExitDialogOpen(true);
  };

  const handleExitConfirm = () => {
    setIsExitDialogOpen(false);
    Exit();
  };

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
