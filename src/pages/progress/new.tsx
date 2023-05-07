import React from "react";
import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { ProgressInpuArea } from "../../components/progress/ProgressInpuArea";
import { NextPage } from "next";
import Link from "next/link";

const ProgressNew: NextPage = () => {
  const progress = {
    id: "",
    title: "",
    startDate: "",
    endDate: "",
    contents: [
      {
        title: "",
        result: false
      }
    ],
  };

  return (
    <Container bg="white" p={6} rounded="md">
      <Flex align="center" justify="space-between">
        <Box fontSize="2xl">新規登録</Box>
        <Link href="/progress">
          <Button size="sm">戻る</Button>
        </Link>
      </Flex>
      <ProgressInpuArea progress={progress} type="new" />
    </Container>
  );
};

export default ProgressNew;
