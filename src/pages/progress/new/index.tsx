import { Box, Button, Container, Flex, Input, Text } from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { db } from "../../../../firebase";

const ProgressNew = () => {
  const router = useRouter();
  const [items, setItems] = useState({
    title: "",
    startDate: "",
    endDate: "",
    contents: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleNumberChange = (e: string, name: string) => {
    const value = e;
    setItems({ ...items, [name]: Number(value) });
  };

  const handleRadioChange = (e: string, name: string) => {
    const value = e;
    setItems({ ...items, [name]: Number(value) });
  };

  const addProgress = async () => {
    const result = window.confirm("登録して宜しいでしょうか");
    if (!result) return;
    const docsRef = collection(db, "progresses");
    try {
      const unsub = await addDoc(docsRef, {
        title: items.title,
        startDate: items.startDate,
        endDate: items.endDate,
        contents: [{ title: "", result: false }],
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      router.push("/progress");
    }
  };

  return (
    <Box w="100%" bg="#f7f7f7" paddingBottom="50px" minH="100vh" p={6}>
      <Container bg="white" p={6}>
        <Box fontSize="2xl">登録</Box>
        <Text>タイトル</Text>
        <Input
          type="text"
          name="title"
          value={items.title}
          onChange={handleInputChange}
        />
        <Flex mt={6} gap={6}>
          <Box w="100%">
            <Text>開始日</Text>
            <Input
              type="date"
              name="startDate"
              value={items.startDate}
              onChange={handleInputChange}
            />
          </Box>
          <Box w="100%">
            <Text>終了日</Text>
            <Input
              type="date"
              name="endDate"
              value={items.endDate}
              onChange={handleInputChange}
            />
          </Box>
        </Flex>
        <Box mt={6}>
          <Button w="100%" colorScheme="blue" onClick={addProgress}>
            登録
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProgressNew;
