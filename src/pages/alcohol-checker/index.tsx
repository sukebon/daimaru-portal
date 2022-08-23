import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

const Alcohol = () => {
  const [posts, setPosts] = useState<any>([]);
  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckList");
    getDocs(collectionRef).then((querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);
  console.log(posts);
  return (
    <Box
      p={6}
      backgroundColor={"#f7f7f7"}
      paddingBottom={"50px"}
      minH={"100vh"}
    >
      <Flex flexDirection={"column"} alignItems={"center"}>
        <TableContainer backgroundColor="white" borderRadius={6} p={6}>
          <Flex mb={6} justifyContent="space-between">
            <Box fontSize="lg">全{posts.length}件</Box>
          </Flex>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th minW="130x">日付</Th>
                <Th minW="50px">完了</Th>
                <Th minW="50px">未処理</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {posts.map((post: { id: string; member: string[] }) => (
                <Tr key={post.id}>
                  <Td>{post.id}</Td>
                  <Td>{post.member.length}名</Td>
                  <Td>{24 - post.member.length}名</Td>
                  <Td>
                    <Link href={`alcohol-checker/${post.id}`}>
                      <a>
                        <Button>詳細</Button>
                      </a>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Box>
  );
};

export default Alcohol;
