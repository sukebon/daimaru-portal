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
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";

type Data = {
  id: string;
  checkList: string;
};

const ReceivablesCheckList = () => {
  const [data, setData] = useState<Data[]>([]);
  const users = useAuthStore((state) => state.users);

  useEffect(() => {
    const getPaymentConfirms = async () => {
      const collectionRef = collection(db, "paymentConfirms");
      const snapShot = await getDocs(collectionRef);
      setData(
        snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Data))
      );
    };
    getPaymentConfirms();
  }, []);

  return (
    <Flex direction="column" align="center">
      <TableContainer bg="white" rounded={6} p={6}>
        <Flex justify="space-between" align="center">
          <Box as="h1" fontSize="lg">
            売掛金額チェック一覧
          </Box>
          <Link href="/" passHref>
            <Button size="sm">戻る</Button>
          </Link>
        </Flex>

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
            {data?.map(({ id, checkList }) => (
              <Tr key={id}>
                <Td>{`${id.replace("_", "年")}月`}</Td>
                <Td>{checkList.length}名</Td>
                <Td>{users.length - checkList.length}名</Td>
                <Td>
                  <Link href={`payment-confirms/${id}`} passHref>
                    <Button size="xs" colorScheme="blue">詳細</Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/* {totalCount >= count && (
          <Flex mt={6} justify="center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                isLoading={flag ? true : false}
                loadingText="さらに表示する"
                onClick={getList}
              >
                さらに表示する
              </Button>
            )}
          </Flex>
        )} */}
      </TableContainer>
    </Flex>
  );
};

export default ReceivablesCheckList;
