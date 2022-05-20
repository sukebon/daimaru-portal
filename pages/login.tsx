import { useEffect, useState } from "react";
import { auth } from "../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
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
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextPage } from "next";

const Login: NextPage = () => {
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  const sighup = (event: any) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push("/");
      })
      .catch((error) => {
        alert("失敗しました");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="#f7f7f7"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="teal.400">Log in</Heading>
        <Box minW={{ base: "90%", md: "350px" }}>
          <form>
            <Stack
              spacing={5}
              p="2rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              rounded="5"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    type="email"
                    placeholder="email address"
                    p="3"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" />
                  <Input
                    type={"password"}
                    placeholder="Password"
                    p="3"
                    value={password}
                    onChange={(event: any) => setPassword(event.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                rounded="5"
                onClick={sighup}
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

export default Login;
