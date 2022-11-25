import { Box, Button, Container, Flex, Input, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AddProgressModal from "../../../components/progress/addProgressModal";

type Props = {
  progress: {
    title: string;
    startDate: string;
    endDate: string;
    contents: [{}];
  };
};

const ProgressId: NextPage<Props> = ({ progress }) => {
  const [items, setItems] = useState({
    title: "",
    startDate: "",
    endDate: "",
    contents: [{}],
  });

  useEffect(() => {
    setItems({ ...progress });
  }, [progress]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  return (
    <Box w="100%" bg="#f7f7f7" paddingBottom="50px" minH="100vh" p={6}>
      <Container bg="white" p={6}>
        <Flex alignItems="center" justifyContent="space-between">
          <Box>編集</Box>
          <Link href="/progress">
            <a>
              <Button size="sm">戻る</Button>
            </a>
          </Link>
        </Flex>
        <Box mt={12}>
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
          <Text mt={3}>項目</Text>
          <Flex gap={3}>
            <AddProgressModal progress={progress} />
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default ProgressId;
