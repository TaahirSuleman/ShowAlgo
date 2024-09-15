/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the About page containing information and a walkthrough of the ShowAlgo IDE
 */

import React, { useEffect, useRef } from "react";
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
  Stack,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaCode, FaGithub, FaPlay } from "react-icons/fa";

function About() {
  const iframeBoxRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to iframe box
  const handleScrollToIframe = () => {
    iframeBoxRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      <Box color="white" py={20}>
        <Center>
          <VStack spacing={4}>
            <Heading fontSize={{ base: "4xl", md: "8xl" }} textAlign="center" letterSpacing="-0.04em">
              Welcome to ShowAlgo.
            </Heading>
            <Text
              fontSize={{ base: "md", md: "xl" }}
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

      <Divider width="80%" />

      <Box mt={15}>
        <Center>
          <VStack spacing={8} maxW="800px">
            <Heading as="h2" size="xl">
              Features
            </Heading>
            <Stack direction={{ base: "column", md: "row" }} spacing={8}>
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
            </Stack>
          </VStack>
        </Center>
      </Box>

      <Flex
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        mt={10}
      >
        <Box
          width={{ base: "90%", md: "60%" }}
          borderRadius={20}
          overflow="hidden"
          boxShadow="lg"
          bg="white"
          ref={iframeBoxRef}
          mb={{ base: 4, md: 0 }}
        >
          <iframe
            src="https://scribehow.com/embed/Using_the_ShowAlgo_IDE__JDZTl4ogQVmdcSBKSvOhzQ"
            width="100%"
            height="550"
            allowFullScreen
            frameBorder="10"
          ></iframe>
        </Box>

        <Box
          width={{ base: "90%", md: "30%" }}
          mr={{ base: 0, md: "20" }}
          display="flex"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          mt={{ base: 4, md: 0 }}
        >
          <Heading size="2xl" textAlign="center">
            Jump right in!
          </Heading>
          <Heading size="2xl" fontWeight="thin" textAlign="center">
            Start visualising algorithms now.
          </Heading>

          <Button
            colorScheme="blue"
            mt={4}
            size="lg"
            width="150px"
            onClick={() => navigate("/ide")}
            leftIcon={<FaPlay />}
          >
            Go to IDE
          </Button>
        </Box>
      </Flex>

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