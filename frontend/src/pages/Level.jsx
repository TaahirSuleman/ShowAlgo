import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function Level() {
  const { sectionRoute, levelRoute } = useParams();
  const [level, setLevel] = React.useState({});

  //! get level
  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await axios.get(
          `/sections/${sectionRoute}/levels/${levelRoute}`
        );
        setLevel(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLevel();
  }, [sectionRoute, levelRoute]);

  return (
    <Box p={4}>
      <Box bg="blackAlpha.800" borderRadius={10} p={5}>
        <Heading textAlign="center">
          {level.title}
        </Heading>

        <Text>{level.question}</Text>

        <Text mt={4}>Hints:</Text>
        {level.hints.map((hint, index) => (
          <Text key={index}>{hint}</Text>
        ))}
      </Box>
    </Box>
  );
}

export default Level;
