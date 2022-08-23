import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

const AlcoholId = () => {
  const [posts, setPosts] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const router = useRouter();
  const queryId = router.query.id;

  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckData");
    const q = query(collectionRef, where("date", "==", `${queryId}`));
    getDocs(q).then((querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, [queryId]);

  useEffect(() => {
    const usersRef = collection(db, "authority");
    getDocs(usersRef).then((querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

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
                <Th minW="130x">名前</Th>
                <Th minW="50px">アルコールの検査</Th>
                <Th minW="50px">酒気帯び</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {posts.map((post: { id: string; user: string }) => (
                <Tr key={post.id}>
                  <Td>
                    {users.map(
                      (user: { uid: string; name: string }) =>
                        user.uid === post.user && user.name
                    )}
                  </Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Box>
  );
};

export default AlcoholId;
