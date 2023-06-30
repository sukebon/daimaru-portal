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
import { useAuthStore } from "../../../store/useAuthStore";
import { User } from "../../../types";

type Data = {
  id: string;
  checkList: string[];
};

type Read = {
  id: string;
  uid: string;
  name: string;
  rank: number;
  email: string;
  isoSalesStaff: boolean;
  isoBoss: boolean;
  isoManager: boolean;
  isoOffice: boolean;
  isoTopManegment: boolean;
  alcoholChecker: boolean;
  read: boolean;
};

const paymentConfirmId: NextPage = () => {
  const [data, setData] = useState<Data>({ id: "", checkList: [] });
  const users = useAuthStore((state) => state.users);
  const [read, setRread] = useState<Read[]>();
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

  useEffect(() => {
    setRread(
      users.map((user) => {
        if (data?.checkList?.includes(user.uid)) {
          return {
            ...user,
            read: true,
          };
        } else {
          return { ...user, read: false };
        }
      })
    );
  }, [users, data]);

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
              <Th minW="160px">既読</Th>
            </Tr>
          </Thead>
          <Tbody>
            {read?.map(({ uid, read }) => (
              <Tr key={uid}>
                <Td>{getUserName(uid)}</Td>
                <Td>{read ? "〇" : ""}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default paymentConfirmId;
