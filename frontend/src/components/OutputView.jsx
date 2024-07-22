import { Box, Text } from "@chakra-ui/react";
import React from "react";

const OutputView = ({ output, isError, isLoading, className, height, width }) => {
  return (
    <Box
      className={className}
      height={height}
      width={width}
      bg="blackAlpha.600"
      p={4}
      color={isError ? "red.400" : ""}
      border="1px solid"
      borderRadius={4}
      borderColor={isError ? "red.500" : "transparent"}
      overflow="auto"
    >
      {output
        ? <Text>{output}</Text>
        : 'Click "Run Code" to see the ouput here'}
    </Box>
  );
};

export default OutputView;
