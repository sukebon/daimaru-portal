import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { CustomerInformation } from "../../../types";
import { format } from "date-fns";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import { useUtils } from "@/hooks/useUtils";

export const CustomerInfoArea = () => {
  const { excerpt } = useUtils();
  const [customerInfoData, setCustomerInfoData] = useState<
    CustomerInformation[]
  >([]);

  useEffect(() => {
    const getCustomerInfomations = async () => {
      const collectionRef = collection(db, "customerInformations");
      const q = query(collectionRef, orderBy("createdAt", "desc"), limit(5));
      onSnapshot(q, (querySnapshot) => {
        setCustomerInfoData(
          querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as CustomerInformation)
          )
        );
      });
    };
    getCustomerInfomations();
  }, []);

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
    <Box w="100%" boxShadow="xs" p={{ base: 6, md: 6 }} rounded="md" bg="white">
      <Flex w="full" gap={3} justifyContent="space-between">
        <Box as="h3" fontSize="lg" fontWeight="bold" mb="4" ml="1">
          お客様情報
        </Box>
        <Flex gap={2}>
          <Box w={{ base: "full", md: "auto" }}>
            <Link href="/customer-informations/" passHref>
              <Button w="full" colorScheme="blue" size="xs" variant="outline">
                一覧
              </Button>
            </Link>
          </Box>
          <Box w={{ base: "full", md: "auto" }}>
            <Link href="/customer-informations/new" passHref>
              <Button w="full" colorScheme="blue" size="xs">
                作成
              </Button>
            </Link>
          </Box>
        </Flex>
      </Flex>
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Th>日付</Th>
            <Th>顧客名</Th>
            <Th>タイトル</Th>
            <Th textAlign="center">受けた印象</Th>
            <Th textAlign="center">詳細</Th>
          </Thead>
          <Tbody fontSize="xs">
            {customerInfoData.map(
              ({ id, createdAt, customer, title, emotion }) => (
                <Tr key={id}>
                  <Td fontSize="xs">
                    {format(new Date(createdAt.toDate()), "yyyy年MM月dd日")}
                  </Td>
                  <Td fontSize="xs">{excerpt(customer, 10)}</Td>
                  <Td fontSize="xs">{excerpt(title, 15)}</Td>
                  <Td w="100px">
                    <Flex justify="center">{getEmotion(emotion)}</Flex>
                  </Td>
                  <Td>
                    <Flex justify="center" w="full">
                      <Link href={`/customer-informations/${id}`} passHref>
                        <Button variant="outline" size="xs">
                          詳細
                        </Button>
                      </Link>
                    </Flex>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
