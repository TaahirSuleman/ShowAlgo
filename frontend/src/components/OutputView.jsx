import { Box, Text } from "@chakra-ui/react";
import { React, useState, useEffect } from "react";

const OutputView = ({
  output,
  isError,
  isLoading,
  className,
  height,
  width,
}) => {
  useEffect(() => {
    console.log(output);
  }, [output]);

  return (
    <Box
      className={className}
      height={height}
      width={width}
      bg="blackAlpha.600"
      p={4}
      color={isError ? "red.400" : ""}
      border="1px solid"
      borderColor={isError ? "red.500" : "transparent"}
      overflow="auto"
    >
      {Array.isArray(output) ? (
        output.map((line, index) =>
          line.includes("colour__") ? (
            <Text color="red" key={index}>
              {line.substring(8)}
            </Text>
          ) : (
            <Text key={index}>{line}</Text>
          )
        )
      ) : (
        <Text>{output}</Text>
      )}
    </Box>
  );
};

export default OutputView;
