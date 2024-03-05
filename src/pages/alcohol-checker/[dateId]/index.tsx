import {
  Box,
  Button,
  Container,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  collection,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { AlcoholCheckData, User } from "../../../../types";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useParams } from "next/navigation";
import { AlcoholCheckRow } from "@/components/alcohol-checker/AlcoholCheckRow";
import { AlcoholCheckOldRow } from "@/components/alcohol-checker/AlcoholCheckOldRow";

const AlcoholId = () => {
  const users = useAuthStore((state) => state.users);
  const [notUsers, setNotUsers] = useState<string[]>([]);
  const [posts, setPosts] = useState<(AlcoholCheckData )[]>([]);
  const [oldPosts, setOldPosts] = useState<AlcoholCheckData[]>([]);
  const { dateId }: { dateId: string } = useParams();

  //アルコールチェックデータを取得
  useEffect(() => {
    const collectionRef = collection(
      db,
      "alcoholCheckList",
      dateId,
      "alcoholCheckData"
    );
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    onSnapshot(q, async (snapshot) => {
      let data: (AlcoholCheckData)[] = [];
      for await (let doc of snapshot.docs) {
        data.push({
          ...doc.data(),
          id: doc.id,
        } as AlcoholCheckData & { user: User });
      }
      setPosts(data);
    });
  }, [dateId]);

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
  }, []);

  //アルコールチェックデータを取得
  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckData");
    const q = query(collectionRef, where("date", "==", `${dateId}`));
    onSnapshot(q, (querySnapshot) => {
      setOldPosts(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as AlcoholCheckData)
        )
      );
    });
  }, [dateId]);

  return (
    <Container minW={900} bg="white" borderRadius={6} p={6}>
      <Link href="/alcohol-checker" passHref>
        <Button w="100%">一覧へ戻る</Button>
      </Link>
      <Box mt={6} fontSize="lg">
        {dateId}
      </Box>
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
            {posts.length !== 0
              ? posts?.map((post) => (
                  <AlcoholCheckRow key={post.id} post={post} />
                ))
              : oldPosts?.map((post) => (
                  <AlcoholCheckOldRow key={post.id} post={post} />
                ))}
            {/* {notUsers.map((notUser) => (
              <Tr key={notUser}>
                <Td>{getUserName(notUser)}</Td>
                <Td textAlign="center"></Td>
                <Td textAlign="center"></Td>
                <Td textAlign="center"></Td>
                <Td textAlign="center"></Td>
              </Tr>
            ))} */}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AlcoholId;
