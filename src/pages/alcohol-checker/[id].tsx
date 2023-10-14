import {
  Box,
  Button,
  Container,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { AlcoholCheckData } from "../../../types";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDisp } from "@/hooks/useDisp";
import { AlcoholCheckTableRow } from "@/components/alcohol-checker/AlcoholCheckTableRow";

const AlcoholId = () => {
  const users = useAuthStore((state) => state.users);
  const [notUsers, setNotUsers] = useState<string[]>([]);
  const [posts, setPosts] = useState<AlcoholCheckData[]>([]);
  const router = useRouter();
  const queryId = router.query.id as string;
  const { getUserName } = useDisp();

  //アルコールチェックデータを取得
  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckData");
    const q = query(collectionRef, where("date", "==", `${queryId}`));
    onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as AlcoholCheckData)
        )
      );
    });
  }, [queryId]);

  //未入力者一覧
  useEffect(() => {
    const newPosts = posts.map((post) => {
      return post.uid;
    });
    const newUsers = users
      .map((user) => {
        return user.uid;
      })
      .filter((user) => !newPosts?.includes(user));
    setNotUsers(newUsers);
  }, [users, posts]);

  if (!queryId) return;

  return (
    <Container minW={900} bg="white" borderRadius={6} p={6}>
      <Link href="/alcohol-checker" passHref>
        <Button w="100%">一覧へ戻る</Button>
      </Link>
      <Box mt={6} fontSize="lg">{queryId}</Box>
      <TableContainer mt={2}>
        <Table size="sm" mt={6}>
          <Thead>
            <Tr>
              <Th minW="160px">名前</Th>
              <Th>アルコールの検査</Th>
              <Th>酒気帯び</Th>
              <Th minW="50px">数値</Th>
              <Th minW="100px">提出時刻</Th>
              <Th minW="100px">更新時刻</Th>
              <Th>編集</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts?.map((post) => (
              <AlcoholCheckTableRow key={post.id} post={post} />
            ))}
            {notUsers.map((notUser) => (
              <Tr key={notUser}>
                <Td>{getUserName(notUser)}</Td>
                <Td textAlign="center"></Td>
                <Td textAlign="center"></Td>
                <Td textAlign="center"></Td>
                <Td textAlign="center"></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AlcoholId;
