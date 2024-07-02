import { Center, Heading } from '@chakra-ui/react'
import React from 'react'
import NavBar from '../components/NavBar'

function LearningMode() {
  return (
    <div>
    <NavBar/>
      <Center
        h="100vh"
        p="10"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        <Heading>
          Learning Mode goes here
        </Heading>
      </Center>
    </div>
  )
}

export default LearningMode