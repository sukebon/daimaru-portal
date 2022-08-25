import { ArrowForwardIcon } from "@chakra-ui/icons";
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
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { db } from "../../../firebase";
import { datetime, dateTime } from "../../../functions";
import { authState } from "../../../store";

const AlcoholId = () => {
  const currentUser = useRecoilValue(authState);
  const [posts, setPosts] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [list, setList] = useState<any>([]);
  const [notUsers, setNotUsers] = useState<any>([]);
  const router = useRouter();
  const queryId = router.query.id;

  useEffect(() => {
    if (currentUser === "") {
      router.push("/login");
    }
  }, [router, currentUser]);

  //アルコールチェックデータを取得
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

  const postsDateAsc = (array: [], property: string) => {
    array.sort(function (a, b) {
      return a[property] < b[property] ? -1 : 1; //オブジェクトの降順ソート
    });
  };

  //user一覧取得
  useEffect(() => {
    const usersRef = collection(db, "authority");
    const q = query(usersRef, orderBy("rank", "asc"));
    getDocs(q).then((querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  //未入力者一覧
  useEffect(() => {
    let newUsers = users.map((user: { uid: string }) => {
      return user.uid;
    });
    let newPosts = posts.map((post: { uid: string }) => {
      return post.uid;
    });
    newUsers = newUsers.filter((user: string) => {
      if (!newPosts.includes(user)) return user;
    });
    setNotUsers(newUsers);
  }, [users, posts]);

  //アルコールチェックリスト
  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckList");
    getDocs(collectionRef).then((querySnapshot) => {
      setList(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  //nextページ prevページのIDを取得
  const nextPrevPage = (id: any, page: number) => {
    let currentIndex = 0;
    list.forEach((item: any, index: number) => {
      if (item.id == id) {
        currentIndex = index;
      }
    });
    const array = list.filter((item: any, index: number) => {
      if (currentIndex + page === index) return item.id;
    });
    let nextId;
    if (array && array[0]) {
      nextId = array[0].id;
    }
    return nextId;
  };

  return (
    <>
      <Box
        p={6}
        backgroundColor={"#f7f7f7"}
        paddingBottom={"50px"}
        minH={"100vh"}
      >
        {/* {nextPrevPage(queryId, -1) !== undefined ? (
          <Link href={`/claims/${nextPrevPage(queryId, -1)}`}>
            <a>
              <Flex alignItems='center'>
                次のクレーム
                <ArrowForwardIcon />
              </Flex>
            </a>
          </Link>
        ) : (
          <Box></Box>
        )} */}
        <Flex flexDirection={"column"} alignItems={"center"}>
          <TableContainer>
            <Link href="/alcohol-checker">
              <a>
                <Button w="100%">一覧へ戻る</Button>
              </a>
            </Link>
            <Box bg="white" borderRadius={6} p={6} mt={2}>
              <Flex justifyContent="space-between">
                <Box fontSize="lg">{queryId}</Box>
              </Flex>
              <Table size="sm" mt={6}>
                <Thead>
                  <Tr>
                    <Th minW="160px">名前</Th>
                    <Th minW="50px">アルコールの検査</Th>
                    <Th minW="50px">酒気帯び</Th>
                    <Th minW="150px">提出時刻</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {posts.map(
                    (post: {
                      id: string;
                      uid: string;
                      alcoholCheck1: string;
                      alcoholCheck2: string;
                      createdAt: any;
                      datetime: string;
                    }) => (
                      <Tr key={post.id}>
                        <Td>
                          {users.map(
                            (user: { uid: string; name: string }) =>
                              user.uid === post.uid && user.name
                          )}
                        </Td>
                        <Td>
                          {Number(post.alcoholCheck1) === 1 ? "済み" : "未"}
                        </Td>
                        <Td>
                          {Number(post.alcoholCheck2) === 1 ? "なし" : "あり"}
                        </Td>
                        <Td>{post.datetime && post.datetime}</Td>
                      </Tr>
                    )
                  )}
                  {notUsers.map((notUser: string) => (
                    <Tr key={notUser}>
                      <Td>
                        {users.map(
                          (user: { uid: string; name: string }) =>
                            user.uid === notUser && user.name
                        )}
                      </Td>
                      <Td textAlign="center"></Td>
                      <Td textAlign="center"></Td>
                      <Td textAlign="center"></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TableContainer>
        </Flex>
      </Box>
    </>
  );
};

export default AlcoholId;
