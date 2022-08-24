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
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { db } from "../../../firebase";
import { authState } from "../../../store";

const Alcohol = () => {
  const currentUser = useRecoilValue(authState);
  const router = useRouter();
  const [posts, setPosts] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    if (currentUser === "") {
      router.push("/login");
    }
  }, [router, currentUser]);

  //アルコールチェッカーリスト
  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckList");
    const q = query(collectionRef, orderBy("id", "desc"));
    try {
      getDocs(q).then((querySnapshot) => {
        setPosts(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  //users情報
  useEffect(() => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    getDocs(q).then((querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  //アルコールチェッカー権限者
  const userAuthority = (userId: string) => {
    const newUsers = users.map(
      (user: { alcoholChecker: boolean; uid: string }) => {
        if (user.alcoholChecker == true) {
          return user.uid;
        }
      }
    );
    return newUsers.includes(userId);
  };

  return (
    <>
      {userAuthority(currentUser) && (
        <Box
          p={6}
          backgroundColor={"#f7f7f7"}
          paddingBottom={"50px"}
          minH={"100vh"}
        >
          <Flex flexDirection={"column"} alignItems={"center"}>
            <TableContainer backgroundColor="white" borderRadius={6} p={6}>
              <Box as="h1" fontSize="lg">
                アルコールチェック一覧
              </Box>

              <Table size="sm" mt={6}>
                <Thead>
                  <Tr>
                    <Th minW="130x">日付</Th>
                    <Th minW="50px">提出者</Th>
                    <Th minW="50px">未提出者</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {posts.map((post: { id: string; member: string[] }) => (
                    <Tr key={post.id}>
                      <Td>{post.id}</Td>
                      <Td>{post.member.length}名</Td>
                      <Td>{users.length - post.member.length}名</Td>
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
      )}
    </>
  );
};

export default Alcohol;
