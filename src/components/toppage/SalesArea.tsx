import { Box, Button, keyframes } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import Draggable from 'react-draggable'

const animationKeyframes = keyframes`
0% { background-color: green; }
30% { background-color: blue; }
60% { background-color: orange;  }
100% { background-color: green;  }
`;
const animation = `${animationKeyframes} 30s ease-in-out infinite`;

export const SalesArea = () => {

  return (
    <Draggable defaultPosition={{ x: 0, y: window.innerHeight - 150 }}>
    <Box bg="white" p={3} boxShadow="lg" rounded="xl" cursor="pointer" style={{ position: "fixed",zIndex:"100" }}>
      <Link href="/sales" passHref>
        <Button p="3" size="sm" colorScheme="green" animation={animation}> 
          売上着地の入力
        </Button>
      </Link>
    </Box>
  </Draggable>
  )
}
