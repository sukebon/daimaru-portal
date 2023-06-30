/* eslint-disable react-hooks/rules-of-hooks */
import { useDisp } from "@/hooks/useDisp";
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
import { doc, getDoc } from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useRouter } from "next/router";

type Data = {
  id: string;
  checkList: string[];
};

const paymentConfirmId: NextPage = () => {
  const [data, setData] = useState<Data>({ id: "", checkList: [] });
  const router = useRouter();
  const pathname = router.asPath.split("/").pop();
  const { getUserName } = useDisp();

  useEffect(() => {
    const getPaymentConfirm = async () => {
      const docRef = doc(db, "paymentConfirms", `${pathname}`);
      const docSnap = await getDoc(docRef);
      setData({ ...docSnap.data(), id: docSnap.id } as Data);
    };
    getPaymentConfirm();
  }, [pathname]);

  return (
    <Flex direction="column" align="center">
      <TableContainer bg="white" borderRadius={6} p={6} mt={2}>
        <Flex gap={6} align="center" justify="space-between" mt={6}>
          <Box as="h1" fontSize="lg">
            {`${data?.id.replace("_", "年")}月`}
          </Box>
          <Link href="/payment-confirms" passHref>
            <Button size="sm">戻る</Button>
          </Link>
        </Flex>
        <Table size="sm" mt={6}>
          <Thead>
            <Tr>
              <Th minW="160px">名前</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.checkList?.map((userId, index) => (
              <Tr key={index}>
                <Td>{getUserName(userId)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default paymentConfirmId;
