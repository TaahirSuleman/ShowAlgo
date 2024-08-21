// CustomToast.jsx
import React from "react";
import { Box, Text, CloseButton } from "@chakra-ui/react";
import ConfettiExplosion from "react-confetti-explosion";

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
      zIndex={1000}
    >
      <ConfettiExplosion
        force={0.6}
        duration={4000}
        particleCount={80}
        width={1000}
      />
      <Box
        bg="blueviolet"
        color="white"
        p={6}
        borderRadius="lg"
        boxShadow="2xl"
        textAlign="center"
        maxW="sm"
        mx="auto"
      >
        <Text fontWeight="extrabold" fontSize="2xl" mb={2}>
          🎉 Congratulations! 🎉
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        <Text mt={2} fontSize="md">
          {description}
        </Text>
        <Text mt={4} fontSize="lg" fontStyle="italic">
          Keep up the great work and continue to shine! 🌟
        </Text>
      </Box>
    </Box>
  );
};

export default CustomToast;
