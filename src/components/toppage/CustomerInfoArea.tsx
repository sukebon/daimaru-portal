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
import { CustomerInfoData } from "../../../types";
import { format } from "date-fns";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import { useUtils } from "@/hooks/useUtils";

export const CustomerInfoArea = () => {
  const { excerpt } = useUtils();
  const [customerInfoData, setCustomerInfoData] = useState<
    CustomerInfoData[]
  >([]);

  useEffect(() => {
    const getCustomerInfomations = async () => {
      const collectionRef = collection(db, "customerInformations");
      const q = query(collectionRef, orderBy("createdAt", "desc"), limit(5));
      onSnapshot(q, (querySnapshot) => {
        setCustomerInfoData(
          querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as CustomerInfoData)
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
    <Box
      flex={{ base: "1", md: "1", lg: "1" }}
      w="full"
      boxShadow="xs"
      p={{ base: 6, md: 6 }}
      rounded="md"
      bg="white"
    >
      <Flex w="full" gap={3} justify="space-between">
        <Box as="h3" fontSize="lg" fontWeight="bold">
          お客様情報
        </Box>
        <Flex gap={2}>
          <Box>
            <Link href="/customer-informations/" passHref>
              <Button w="full" colorScheme="blue" size="sm" variant="outline">
                一覧
              </Button>
            </Link>
          </Box>
          <Box>
            <Link href="/customer-informations/new" passHref>
              <Button w="full" colorScheme="blue" size="sm">
                作成
              </Button>
            </Link>
          </Box>
        </Flex>
      </Flex>
      <TableContainer mt={3}>
        <Table size="" w="full">
          <Thead fontSize="xs">
            <Tr>
              <Th px={1}>日付</Th>
              <Th px={1}>顧客名</Th>
              <Th px={1}>タイトル</Th>
              <Th px={1} textAlign="center">
                受けた印象
              </Th>
              {/* <Th textAlign="center">詳細</Th> */}
            </Tr>
          </Thead>
          <Tbody fontSize="xs">
            {customerInfoData.map(
              ({ id, createdAt, customer, title, emotion }) => (
                <Tr key={id} p={2}>
                  <Td fontSize="xs" px={1} py={2}>
                    {format(new Date(createdAt.toDate()), "MM月dd日")}
                  </Td>
                  <Td fontSize="xs" px={1}>
                    {excerpt(customer, 10)}
                  </Td>
                  <Td fontSize="xs" px={1}>
                    <Link href={`/customer-informations/${id}`} passHref>
                      <Box
                        as="span"
                        textDecoration="underline"
                        _hover={{ textDecoration: "none" }}
                      >
                        {excerpt(title, 15)}
                      </Box>
                    </Link>
                  </Td>
                  <Td>
                    <Flex justify="center" fontSize="lg">
                      {getEmotion(emotion)}
                    </Flex>
                  </Td>
                  {/* <Td>
                    <Flex justify="center">
                      <Link href={`/customer-informations/${id}`} passHref>
                        <Button variant="outline" size="xs">
                          詳細
                        </Button>
                      </Link>
                    </Flex>
                  </Td> */}
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
