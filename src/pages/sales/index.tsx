import {
  Box,
  Button,
  Container,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  collection,
  endAt,
  onSnapshot,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Administrator } from "../../../data";
import { db } from "../../../firebase";
import { authState, usersState } from "../../../store";
import SalesEditModal from "../../components/sales/SalesEditModal";

const Sales = () => {
  const currentUser = useRecoilValue(authState);
  const [users, setUsers] = useRecoilState<any>(usersState); //ユーザー一覧リスト
  const [sales, setSeles] = useState<any>();
  const [targetSum, setTargetSum] = useState<number>();
  const [landingSum, setLandingSum] = useState<number>();
  // const [recentAtDate, setRecentAtDate] = useState(new Date());
  // const [sinceAtDate, setSinceAtDate] = useState("2022-10-31");

  // salesデータを取得
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDate = new Date(year, month, 0);
    const recentAtDate = `${year}-${month}-1`;
    const sinceAtDate = `${year}-${month}-${lastDate.getDate()}`;

    const salesCollectionRef = collection(db, "sales");
    const q = query(
      salesCollectionRef,
      orderBy("datetime"),
      startAt(recentAtDate),
      endAt(sinceAtDate)
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setSeles(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);

  // 名前表示
  const dispName = (uid: string) => {
    const userName = users.find((user: any) => {
      if (user.uid === uid) return true;
    });
    return userName?.name;
  };

  // 目標・着地　合計値
  useEffect(() => {
    let target = 0;
    sales?.forEach((sale: any) => {
      target += Number(sale.currentTarget);
    });
    setTargetSum(target);

    let landing = 0;
    sales?.forEach((sale: any) => {
      landing += Number(sale.currentLanding);
    });
    setLandingSum(landing);
  }, [sales]);

  return (
    <Box backgroundColor={"#f7f7f7"} pt={6} minH={"calc(100vh - 135px)"}>
      <Container maxW="700px" mt={6}>
        <Box my={3} fontSize="xl">
          今月売上一覧
        </Box>
        <TableContainer bgColor="white" borderRadius={6} p={6}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>担当</Th>
                <Th>目標売上</Th>
                <Th>着地売上</Th>
                <Th>差額</Th>
                <Th>編集</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sales?.map((sale: any) => (
                <Tr key={sale.id}>
                  <Td mr={6}>{dispName(sale.currentUser)}</Td>
                  <Td isNumeric>
                    {Number(sale.currentTarget).toLocaleString()}
                  </Td>
                  <Td isNumeric>
                    {Number(sale.currentLanding).toLocaleString()}
                  </Td>
                  <Td isNumeric>
                    {(
                      Number(sale.currentLanding) - Number(sale.currentTarget)
                    ).toLocaleString()}
                  </Td>
                  <Td>
                    {(Administrator.includes(currentUser) ||
                      sale.currentUser === currentUser) && (
                      <SalesEditModal docId={"2022-10_" + sale.currentUser} />
                    )}
                  </Td>
                </Tr>
              ))}
              <Tr>
                <Td mr={6} fontWeight="bold">
                  合計
                </Td>
                <Td fontWeight="bold" isNumeric>
                  {targetSum?.toLocaleString()}
                </Td>
                <Td fontWeight="bold" isNumeric>
                  {landingSum?.toLocaleString()}
                </Td>
                <Td fontWeight="bold" isNumeric>
                  {(Number(landingSum) - Number(targetSum)).toLocaleString()}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Box mt={6} textAlign="center">
          <Link href="/sales/new">
            <a>
              <Button colorScheme="blue">売上登録</Button>
            </a>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Sales;
