import {
  Box,
  Button,
  Container,
  Flex,
  slideFadeConfig,
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
import { useRecoilValue } from "recoil";
import { Administrator } from "../../../data";
import { db } from "../../../firebase";
import { authState, usersState } from "../../../store";
import SalesEditModal from "../../components/sales/SalesEditModal";

const Sales = () => {
  const currentUser = useRecoilValue(authState);
  const users = useRecoilValue<any>(usersState); //ユーザー一覧リスト
  const [sales, setSeles] = useState<any>();
  const [targetSum, setTargetSum] = useState<number>();
  const [AchiveSum, setAchiveSum] = useState<number>();
  const [landingSum, setLandingSum] = useState<number>();

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

    let achive = 0;
    sales?.forEach((sale: any) => {
      achive += Number(sale.currentAchieve);
    });
    setAchiveSum(achive);

    let landing = 0;
    sales?.forEach((sale: any) => {
      landing += Number(sale.currentLanding);
    });
    setLandingSum(landing);
  }, [sales]);

  return (
    <Box backgroundColor={"#f7f7f7"} pt={6} minH={"calc(100vh - 135px)"}>
      <Container maxW="800px" mt={6}>
        <Box my={3} fontSize="xl">
          今月売上一覧
        </Box>
        <TableContainer bgColor="white" borderRadius={6} p={6}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>担当</Th>
                <Th>予算</Th>
                <Th>実績</Th>
                <Th>着地</Th>
                <Th>差額</Th>
                <Th>達成率</Th>
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
                    {Number(sale.currentAchieve).toLocaleString()}
                  </Td>
                  <Td isNumeric>
                    {Number(sale.currentLanding).toLocaleString()}
                  </Td>
                  <Td isNumeric>
                    {(
                      Number(sale.currentLanding) - Number(sale.currentTarget)
                    ).toLocaleString()}
                  </Td>
                  <Td isNumeric>
                    {(
                      (Number(sale.currentLanding) /
                        Number(sale.currentTarget)) *
                      100
                    )
                      .toString()
                      .slice(0, 4) + "%"}
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
                  {AchiveSum?.toLocaleString()}
                </Td>
                <Td fontWeight="bold" isNumeric>
                  {landingSum?.toLocaleString()}
                </Td>
                <Td fontWeight="bold" isNumeric>
                  {(Number(landingSum) - Number(targetSum)).toLocaleString()}
                </Td>
                <Td fontWeight="bold" isNumeric>
                  {((Number(landingSum) / Number(targetSum)) * 100)
                    .toString()
                    .slice(0, 4) + "%"}
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
        {/* {Administrator.includes(currentUser) && (
          <>
            <Box mt={6} p={6} bgColor="white" borderRadius={6}>
              <Box>未登録者</Box>
              <Flex>
                {users.map((user: any) => (
                  <Box key={user.id}>{user.name}</Box>
                ))}
              </Flex>
            </Box>
          </>
        )} */}
      </Container>
    </Box>
  );
};

export default Sales;
