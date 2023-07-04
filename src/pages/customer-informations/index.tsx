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
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { NextPage } from "next";
import { CustomerInformation } from "../../../types";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";

const CustomerInformations: NextPage = () => {
  const [data, setData] = useState<CustomerInformation[]>([]);

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
        return <BsEmojiLaughing />;
      case "normal":
        return <BsEmojiNeutral />;
      case "bad":
        return <FaRegFaceTired />;
      default:
        return "no image";
    }
  };

  return (
    <Container maxW="800px" bg="white" p={6} boxShadow="md" rounded="md">
      <TableContainer>
        <Flex justify="space-between" align="center">
          <Box as="h1" fontSize="lg">
            お客様情報一覧
          </Box>
          <Link href="/" passHref>
            <Button size="sm">戻る</Button>
          </Link>
        </Flex>
        <Table size="sm" mt={6}>
          <Thead>
            <Tr>
              <Th>顧客名</Th>
              <Th>タイトル</Th>
              <Th>感情</Th>
              <Th>内容</Th>
              <Th>詳細</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(({id ,customer,title,emotion,content}) => (
              <Tr key={id}>
                <Td>{excerpt(customer, 12)}</Td>
                <Td>{title}</Td>
                <Td><Box fontSize="xl">{getEmotion(emotion)}</Box></Td>
                <Td>{excerpt(content, 12)}</Td>
                <Td>
                  <Link href={`/customer-informations/${id}`} passHref>
                  <Button size="xs" colorScheme="blue">
                    詳細
                  </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CustomerInformations;
