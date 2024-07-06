import React from "react";
import { useState, useEffect } from "react";
import { Center, Heading, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function About() {
  return (
    <div>
      <NavBar/>
      <Center
        h="100vh"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        <Heading>
          About page goes here
        </Heading>
      </Center>
    </div>
  );
}

export default About;
