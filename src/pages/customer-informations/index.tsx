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
import { db, storage } from "../../../firebase";
import { NextPage } from "next";
import { CustomerInformation } from "../../../types";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import { format } from "date-fns";
import { deleteObject, ref } from "firebase/storage";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDisp } from "@/hooks/useDisp";
import { FaTrashCan } from "react-icons/fa6";

const CustomerInformations: NextPage = () => {
  const [data, setData] = useState<CustomerInformation[]>([]);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { getUserName } = useDisp();

  useEffect(() => {
    const getCustomerInfomations = async () => {
      const collectionRef = collection(db, "customerInformations");
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      onSnapshot(q, (querySnapshot) => {
        setData(
          querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as CustomerInformation)
          )
        );
      });
    };
    getCustomerInfomations();
  }, []);

  const deleteInformation = async (id: string) => {
    const result = confirm("削除して宜しいでしょうか");
    if (!result) return;
    try {
      const docRef = doc(db, "customerInformations", id);
      const docSnap = await getDoc(docRef);
      const imagesArray = docSnap?.data()?.images;
      if (imagesArray?.length > 0) {
        imagesArray.forEach((image: { imagePath: string }) => {
          const desertRef = ref(storage, image?.imagePath);
          deleteObject(desertRef);
        });
      }
      await deleteDoc(docRef);
    } catch (error) {
      console.log(error);
    }
  };

  const excerpt = (str: string, num: number) => {
    let result = str;
    if (str.length > num) {
      result = str.slice(0, num) + "...";
    }
    return result;
  };

  const getEmotion = (str: string) => {
    switch (str) {
      case "good":
        return <BsEmojiLaughing color="orange" />;
      case "normal":
        return <BsEmojiNeutral color="blue" />;
      case "bad":
        return <FaRegFaceTired color="red" />;
      default:
        return "no image";
    }
  };

  return (
    <Container maxW="1200px" bg="white" p={6} boxShadow="md" rounded="md">
      <TableContainer>
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
            <Link href="/customer-informations/new" passHref>
              <Button colorScheme="blue" size="sm">
                作成
              </Button>
            </Link>
          </Flex>
        </Flex>
        <Table size="sm" mt={6}>
          <Thead>
            <Tr>
              <Th>登録日</Th>
              <Th>顧客名</Th>
              <Th>タイトル</Th>
              <Th textAlign="center">受けた印象</Th>
              <Th>内容</Th>
              <Th>投稿者</Th>
              <Th w="50px" textAlign="center">
                詳細
              </Th>
              <Th w="50px">削除</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(
              ({
                createdAt,
                id,
                customer,
                title,
                emotion,
                content,
                author,
              }) => (
                <Tr key={id}>
                  <Td>
                    {format(new Date(createdAt?.toDate()), "yyyy年MM月dd日")}
                  </Td>
                  <Td>{excerpt(customer, 12)}</Td>
                  <Td>{excerpt(title, 12)}</Td>
                  <Td>
                    <Flex fontSize="xl" justify="center">
                      {getEmotion(emotion)}
                    </Flex>
                  </Td>
                  <Td>{excerpt(content, 20)}</Td>
                  <Td>{getUserName(author)}</Td>
                  <Td w="50px">
                    <Flex fontSize="xl" justify="center">
                      <Link href={`/customer-informations/${id}`} passHref>
                        <Button size="xs" variant="outline">
                          詳細
                        </Button>
                      </Link>
                    </Flex>
                  </Td>
                  <Td w="50px">
                    <Flex justify="center">
                      {author === currentUser && (
                        <FaTrashCan
                          cursor="pointer"
                          onClick={() => deleteInformation(id)}
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

export default CustomerInformations;
