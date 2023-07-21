import {
  Box,
  Button,
  Container,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { NextPage } from "next";
import { format } from "date-fns";
import { useAuthStore } from "../../../store/useAuthStore";
import { FaTrashCan } from "react-icons/fa6";
import { useDisp } from '../../hooks/useDisp';
import { useUtils } from '../../hooks/useUtils';

type News = {
  id: string;
  content: string;
  calendar: string;
  author: string;
  createdAt: any;
};

const News: NextPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { getUserName } = useDisp();
  const { excerpt } = useUtils();

  useEffect(() => {
    const getNews = async () => {
      const collectionRef = collection(db, "news");
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      onSnapshot(q, (querySnapshot) => {
        setNews(
          querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as News)
          )
        );
      });
    };
    getNews();
  }, []);

  const deleteNews = async (id: string) => {
    const result = confirm("削除して宜しいでしょうか");
    if (!result) return;
    try {
      const docRef = doc(db, "news", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Container maxW="1300px" bg="white" p={6} boxShadow="md" rounded="md">
      <Flex justify="space-between" align="center">
        <Box as="h1" fontSize="lg" fontWeight="bold">
          お客様情報一覧
        </Box>
        <Flex gap={3}>
          <Link href="/" passHref>
            <Button colorScheme="blue" size="sm" variant="outline">
              トップへ戻る
            </Button>
          </Link>
          <Link href="/news/new" passHref>
            <Button colorScheme="blue" size="sm">
              作成
            </Button>
          </Link>
        </Flex>
      </Flex>

      <TableContainer>
        <Table size="sm" mt={6}>
          <Thead>
            <Tr>
              <Th>日付</Th>
              <Th>内容</Th>
              <Th>投稿者</Th>
              <Th w="50px" textAlign="center">
                詳細
              </Th>
              <Th w="50px">削除</Th>
            </Tr>
          </Thead>
          <Tbody>
            {news.map(
              ({
                id,
                calendar,
                content,
                author,
                createdAt,
              }) => (
                <Tr key={id}>
                  <Td>
                    {calendar && format(new Date(calendar), "yyyy年MM月dd日")}
                    {/* {createdAt && format(new Date(createdAt?.toDate()), "yyyy年MM月dd日")} */}
                  </Td>
                  <Td>{excerpt(content, 50)}</Td>
                  <Td>{getUserName(author)}</Td>
                  <Td w="50px">
                    {/* <Flex fontSize="xl" justify="center">
                        <Link href={`/customer-informations/${id}`} passHref>
                          <Button size="xs" variant="outline">
                            詳細
                          </Button>
                        </Link>
                      </Flex> */}
                  </Td>
                  <Td w="50px">
                    <Flex justify="center">
                      {author === currentUser && (
                        <FaTrashCan
                          cursor="pointer"
                          onClick={() => deleteNews(id)}
                        />
                      )}
                    </Flex>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default News;
