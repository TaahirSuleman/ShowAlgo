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
}) => {
  // Responsive font sizes
  const titleFontSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const levelsFontSize = useBreakpointValue({ base: "4xl", md: "6xl" });
  const subheadingFontSize = useBreakpointValue({ base: "sm", md: "md" });

  // Responsive box sizes for CircularProgress and IconButton
  const circularProgressSize = useBreakpointValue({ base: "75px", md: "90px" });
  const iconButtonSize = useBreakpointValue({ base: "60px", md: "80px" });

  const getColorByPercentage = (percentage) => {
    if (percentage <= 25) {
      return "red.400";
    } else if (percentage <= 50) {
      return "orange.400";
    } else if (percentage <= 75) {
      return "yellow.400";
    } else {
      return "green.400";
    }
  };

  return (
    <Box
      bg="whiteAlpha.800"
      borderRadius="2xl"
      maxW="sm"
      boxShadow="md"
      overflow="hidden"
      textAlign="center"
      width="50dvh"
    >
      <VStack spacing={4}>
        <Box bg={bgColor} p={4} boxShadow="md" height="30dvh" width="50vh">
          <Text fontSize={subheadingFontSize}>{subheading}</Text>
          <Text fontSize={titleFontSize} fontWeight="bold">
            {heading}
          </Text>
        </Box>

        <HStack spacing={{ base: 4, md: 8 }}>
          {" "}
          // Responsive spacing
          <VStack>
            <HStack>
              <Text fontSize={levelsFontSize} fontWeight="bold" color="black">
                {completedLevels}
              </Text>
              <Text fontSize="2xl" color="gray" mt={5}>
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
              size={circularProgressSize} // Responsive size
              thickness="7px"
            >
              <CircularProgressLabel>
                <IconButton
                  icon={<Box as={IoMdPlay} size="24px" />}
                  isRound={true}
                  boxSize={iconButtonSize} // Responsive size
                  color="gray.800"
                />
              </CircularProgressLabel>
            </CircularProgress>
            <Text color="gray">{completedPercentage}%</Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SectionCard;
