import { Center, Heading } from '@chakra-ui/react'
import React from 'react'

function Home() {
  return (
    <div>
      <Center
        h="100vh"
        p="10"
        bgGradient="linear(to-br, teal.300, purple.400, pink.200)"
        flexDirection="column"
      >
        <Heading>
          Welcome to ShowAlgo.
        </Heading>
      </Center>
    </div>
  )
}

export default Home