import React, { useRef } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaCode, FaGithub, FaPlay } from "react-icons/fa";

function About() {
  const iframeBoxRef = useRef(null);

  const handleScrollToIframe = () => {
    iframeBoxRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Box>
      <Box color="white" py={20}>
        <Center>
          <VStack spacing={4}>
            <Heading fontSize="8xl" textAlign="center" letterSpacing="-0.04em">
              Welcome to ShowAlgo.
            </Heading>
            <Text
              fontSize="xl"
              textAlign="center"
              maxW="600px"
              textColor="whiteAlpha.700"
            >
              Visualize and understand algorithms in a fun and interactive way.
              Explore various algorithms and see how they work step-by-step.
            </Text>
            <Button
              colorScheme="blue"
              mt={2}
              size="lg"
              onClick={handleScrollToIframe}
              leftIcon={<FaPlay />}
            >
              Get Started
            </Button>
          </VStack>
        </Center>
      </Box>

      <Divider width="80%"/>

      <Box mt={15}>
        <Center>
          <VStack spacing={8} maxW="800px">
            <Heading as="h2" size="xl">
              Features
            </Heading>
            <HStack spacing={8} >
              <VStack>
                <Icon as={FaCode} boxSize={12} color="yellow.400" />
                <Text fontSize="lg" fontWeight="bold" textAlign="center">
                  Standardised Pseudocode Language
                </Text>
                <Text textAlign="center">
                  Code in a langauge you're familiar with.
                </Text>
              </VStack>
              <VStack>
                <Icon as={FaChartLine} boxSize={12} color="yellow.400" />
                <Text fontSize="lg" fontWeight="bold" textAlign="center">
                  Dynamic Visualisations
                </Text>
                <Text textAlign="center">
                  Step through algorithms and see how they work in real-time.
                </Text>
              </VStack>
              <VStack>
                <Icon as={FaGithub} boxSize={12} color="yellow.400" />
                <Text fontSize="lg" fontWeight="bold" textAlign="center">
                  Interactive Learning Mode
                </Text>
                <Text textAlign="center">
                  Learn by doing, with our interactive learning mode.
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Center>
      </Box>

      <Box width="100%" justifyContent="center" display="flex" mt={10} ref={iframeBoxRef}>
        <Box
          width="60%"
          borderRadius={20}
          overflow="hidden"
          boxShadow="lg"
          bg="white"
        >
          <iframe
            src="https://scribehow.com/embed/Using_the_ShowAlgo_IDE__JDZTl4ogQVmdcSBKSvOhzQ"
            width="100%"
            height="550"
            allowfullscreen
            frameborder="10"
          ></iframe>
        </Box>
      </Box>

      <Box bg="gray.900" color="white" py={10} mt={20}>
        <Center>
          <Text>
            &copy; {new Date().getFullYear()} Algorithm Visualizer. All rights
            reserved.
          </Text>
        </Center>
      </Box>
    </Box>
  );
}

export default About;
