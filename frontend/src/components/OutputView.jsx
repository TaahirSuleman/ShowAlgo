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
      {output.map((line, index) => (line.includes("colourRed__") ? (
        <Text color="red" 
              key={index} 
              style={{
                fontWeight:"bold",
                textShadow: `
                  -1px -1px 0 #fff,  
                  1px -1px 0 #fff,
                  -1px 1px 0 #fff,
                  1px 1px 0 #fff`
              }}
        >{line.substring(11)}</Text>  
      )
      : (line.includes("colourYellow__") ? 
          <Text color="yellow" key={index}>{line.substring(14)}</Text>
          :
          <Text key={index}>{line}</Text>
        )
      ))}
    </Box>
  );
};

export default OutputView;
