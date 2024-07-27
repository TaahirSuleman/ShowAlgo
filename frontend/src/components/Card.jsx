import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';

const Card = ({ course }) => {
  return (
    <Box
      bg="blackAlpha.900"
      borderRadius="lg"
      p={6}
      boxShadow="md"
      borderTop={`5px solid ${course.color}`}
    >
      <Heading size="md" mb={2}>{course.title}</Heading>
      <Text>{course.chapters} Chapters</Text>
      <Text>{course.items} Items</Text>
      <Text>Progress: {course.progress}%</Text>
    </Box>
  );
};

export default Card;
