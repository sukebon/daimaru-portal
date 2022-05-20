import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/auth";

const Request = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [requests, setRequests] = useState<any>([]);

  const addRequest = async () => {
    try {
      const docRef = await addDoc(collection(db, "requestList"), {
        title: title,
        content: content,
      });
      console.log("Document written with ID: ", docRef.id);
      setTitle("");
      setContent("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    const usersCollectionRef = collection(db, "requestList");

    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
    // getDocs(usersCollectionRef).then((querySnapshot) => {
    //   setRequests(
    //     querySnapshot.docs.map((doc) => ({
    //       ...doc.data(),
    //       id: doc.id,
    //     }))
    //   );
    // });
  }, []);

  return (
    <div>
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="#f7f7f7"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box minW={{ base: "90%", md: "700px" }} marginTop={"100px"}>
          <Heading color="teal.400" marginBottom={"20px"}>
            協力依頼
          </Heading>
          <FormControl>
            <FormLabel htmlFor="email">タイトル</FormLabel>
            <Input
              id="title"
              type="text"
              value={title}
              placeholder="タイトルを入力してください。"
              backgroundColor={"white"}
              marginBottom={"20px"}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormLabel htmlFor="email">内容</FormLabel>
            <Textarea
              id="content"
              value={content}
              placeholder="内容を入力してください。"
              backgroundColor={"white"}
              marginBottom={"20px"}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>
          <Button
            borderRadius={0}
            type="submit"
            variant="solid"
            colorScheme="teal"
            width="full"
            rounded="5"
            onClick={addRequest}
          >
            登録
          </Button>
        </Box>
        <Box>
          {requests.map((doc: any) => (
            <div key={doc.id}>
              {doc.title}　:　{doc.content}
            </div>
          ))}
        </Box>
      </Flex>
    </div>
  );
};

export default Request;
