/**
 * Author(s): Yusuf Kathrada, Gregory Maselle
 * Date: September 2024
 * Description: This file contains the OutputView component
 */

import { Box, Text } from "@chakra-ui/react";
import { React, useState, useEffect, useRef } from "react";

const OutputView = ({
  output,
  isError,
  isLoading,
  className,
  height,
  width,
  followOutputState
}) => {
  const boxRef = useRef(null); 
  // Manages the `auto-scrolling` feature of output view.
  useEffect(() => {
    if (boxRef.current && followOutputState) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <Box
      ref={boxRef}
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
