import {
  Box,
  Button,
  Card,
  CardBody,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

function ModuleCard({
  heading,
  subheading,
  totalLevels,
  completedLevels,
  completedPercentage,
  color,
  onClick,
}) {
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

          <Button colorScheme="whatsapp" onClick={onClick}>
            Go
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default ModuleCard;
