import { useState } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  FormControl,
} from '@chakra-ui/react';

const App = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Flex
      flexDirection='column'
      width='100wh'
      height='100vh'
      backgroundColor='#f7f7f7'
      justifyContent='center'
      alignItems='center'
    >
      <Stack
        flexDir='column'
        mb='2'
        justifyContent='center'
        alignItems='center'
      >
        <Heading color='teal.400'>Log in</Heading>
        <Box minW={{ base: '90%', md: '350px' }}>
          <form>
            <Stack
              spacing={5}
              p='2rem'
              backgroundColor='whiteAlpha.900'
              boxShadow='md'
              rounded='5'
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents='none' />
                  <Input type='email' placeholder='email address' p='3' />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents='none' color='gray.300' />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    p='3'
                  />
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type='submit'
                variant='solid'
                colorScheme='teal'
                width='full'
                rounded='5'
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default App;
