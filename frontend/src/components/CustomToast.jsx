// CustomToast.jsx
import React from "react";
import { Box, Text, CloseButton } from "@chakra-ui/react";
import ConfettiExplosion from 'react-confetti-explosion';

const CustomToast = ({ title, description, duration, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="red"
        color="white"
        p={4}
        borderRadius="md"
        boxShadow="md"
        zIndex={1000}
      >
        <Text fontWeight="bold">{title}</Text>
        <Text>{description}</Text>
      </Box>
  );
};

export default CustomToast;
