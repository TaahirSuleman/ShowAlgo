import React from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  CircularProgress,
  CircularProgressLabel,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IoMdPlay } from "react-icons/io";

const SectionCard = ({
  heading,
  subheading,
  totalLevels,
  completedLevels,
  completedPercentage,
  bgColor,
  onClick,
}) => {
  // Responsive font sizes
  const titleFontSize = useBreakpointValue({ base: "2xl", md: "2xl" });
  const levelsFontSize = useBreakpointValue({ base: "2xl", md: "4xl" });
  const subheadingFontSize = useBreakpointValue({ base: "md", md: "lg" });


  const getColorByPercentage = (percentage) => {
    if (percentage <= 25) {
      return "red.300";
    } else if (percentage <= 50) {
      return "orange.300";
    } else if (percentage <= 75) {
      return "yellow.400";
    } else if (percentage < 100) {
      return "green.400";
    } else {
      return "green.400";
    }
  }

  return (
    <Box
      bg="whiteAlpha.900"
      borderRadius="2xl"
      maxW="sm"
      boxShadow="lg"
      overflow="hidden"
      textAlign="start"
      width="50dvh"
      height="50dvh"
      position="relative"
      mb={7}
    >
      <VStack spacing={4}>
        <Box bg={bgColor} p={4} boxShadow="md" height="30dvh" width="50vh">
          <Text fontSize={subheadingFontSize} fontWeight="bold" color="whiteAlpha.700">{subheading}</Text>
          <Text fontSize={titleFontSize} fontWeight="bold">
            {heading}
          </Text>
        </Box>

        <HStack>
          <VStack position="absolute" left="8" bottom="5" spacing={0}>
            <HStack>
              <Text fontSize={levelsFontSize} fontWeight="bold" color="black">
                {completedLevels}
              </Text>
              <Text fontSize={subheadingFontSize} color="gray" mt={4}>
                / {totalLevels}
              </Text>
            </HStack>
            <Text color="gray">Levels Completed</Text>
          </VStack>
          <VStack>
            <CircularProgress
              value={completedPercentage}
              color={getColorByPercentage(completedPercentage)}
              trackColor="gray.300"
              size="100px"
              thickness="16px"
              position="absolute"
              bottom="24%"
              right="10%"
              borderRadius="50%"
              _hover={{ transform: "scale(1.05)", boxShadow: "0 8px 10px 0 rgba(106, 13, 173, 0.3)" }}
            >
              <CircularProgressLabel>
                <IconButton
                  icon={<Box as={IoMdPlay} size="24px" />}
                  isRound={true}
                  boxSize="78px"
                  color="gray.800"
                  bg="white"
                  _hover={{ bg: "white", color: "rgba(191, 0, 255, 0.5)"}}
                  onClick={onClick}
                />
              </CircularProgressLabel>
            </CircularProgress>
            <Text color="gray" position="absolute" bottom="8" right="14" fontSize="xl">{completedPercentage}%</Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SectionCard;
