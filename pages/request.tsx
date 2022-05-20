import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
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
        member: [],
        sendAt: serverTimestamp(),
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
    const q = query(usersCollectionRef, orderBy("sendAt", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);
  console.log(requests);
  return (
    <>
      <Flex
        flexDirection="column"
        width="100vw"
        height="100%"
        minH={"100vh"}
        backgroundColor="#f7f7f7"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box
          minW={{ base: "90%", md: "700px" }}
          marginTop={"50px"}
          marginBottom={"50px"}
        >
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
            disabled={title && content ? false : true}
          >
            登録
          </Button>
        </Box>
        {requests.map((doc: any) => (
          <div key={doc.id} style={{ width: "100%" }}>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              marginTop={"10px"}
              margin={"10px auto 0"}
              padding={"20px"}
              minW={{ base: "90%", md: "700px" }}
              backgroundColor={"white"}
            >
              <Heading fontSize={"2xl"} marginBottom={"10px"}>
                {doc.title}
              </Heading>
              <Text>{doc.content}</Text>
            </Box>
          </div>
        ))}
      </Flex>
    </>
  );
};

export default Request;
