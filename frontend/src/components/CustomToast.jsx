/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a custom toast component
 */

import React from "react";
import { Box, Text, CloseButton } from "@chakra-ui/react";
import ConfettiExplosion from "react-confetti-explosion";

const CustomToast = ({ title, description, duration, onClose }) => {
  // Close the toast after a set duration
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
      {/* Add confetti explosion effect when toast is displayed */}
      <ConfettiExplosion
        force={0.6}
        duration={4000}
        particleCount={80}
        width={1000}
      />
      <Box
        bg="blueviolet"
        border="4px solid white"
        color="white"
        p={[4, 6, 8]}
        borderRadius={15}
        boxShadow="lg white"
        textAlign="center"
        width="50dvw"
        mx="auto"
      >
        <CloseButton
          position="absolute"
          top="10px"
          right="10px"
          onClick={onClose}
        />
        <Text fontWeight="extrabold" fontSize={["lg", "3xl", "4xl"]} mb={2}>
          🎉 Congratulations! 🎉
        </Text>
        <Text fontWeight="bold" fontSize={["md", "lg", "xl"]}>
          {title}
        </Text>
        <Text mt={2} fontSize={["sm", "md", "lg"]}>
          {description}
        </Text>
        <Text mt={4} fontSize={["md", "lg", "xl"]} fontStyle="italic">
          Keep up the great work and continue to shine! 🌟
        </Text>
      </Box>
    </Box>
  );
};

export default CustomToast;
