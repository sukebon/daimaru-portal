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
  doc,
  endAt,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
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
  const [registeredUser, setRegisteredUser] = useState<any>();
  const [targetSum, setTargetSum] = useState<number>();
  const [AchiveSum, setAchiveSum] = useState<number>();
  const [landingSum, setLandingSum] = useState<number>();
  const [currentMonth, setCurrentMonth] = useState(""); //今月 2022-10

  console.log(currentMonth);

  // salesデータを取得
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDate = new Date(year, month, 0);
    const recentAtDate = `${year}-${month}-01`;
    setCurrentMonth(`${year}-${month}`);
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
      setRegisteredUser(
        querySnapshot.docs.map((doc) => doc.data().currentUser)
      );
    });
  }, []);

  // 営業担当を登録する
  const addSales = async (uid: string, rank: number) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const result = year + "-" + month;

    const docRef = doc(db, "sales", `${result}_${uid}`);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      try {
        await setDoc(docRef, {
          currentTarget: 0,
          currentAchieve: 0,
          currentLanding: 0,
          currentUser: uid,
          createdAt: serverTimestamp(),
          datetime: `${year}-${month}-${day}`,
          rank,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };

  // フィルターを掛けたusersを一人ずつ登録していく
  useEffect(() => {
    const filterUsers = users
      .filter((user: { isoSalesStaff: boolean }) => user.isoSalesStaff)
      .filter((user: { uid: string }) => !registeredUser?.includes(user.uid));

    filterUsers.forEach((user: any) => {
      addSales(user.uid, user.rank);
    });
  }, [registeredUser, users]);

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
    <Box backgroundColor={"#f7f7f7"} py={6} minH={"calc(100vh - 135px)"}>
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
                <Th>計上予定</Th>
                <Th>差額</Th>
                <Th>達成率</Th>
                <Th>編集</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sales
                ?.sort((a: any, b: any) => a.rank - b.rank)
                ?.map((sale: any) => (
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
                        Number(sale.currentLanding) -
                        Number(sale.currentTarget) +
                        Number(sale.currentAchieve)
                      ).toLocaleString()}
                    </Td>
                    <Td isNumeric>
                      {(
                        ((Number(sale.currentLanding) +
                          Number(sale.currentAchieve)) /
                          Number(sale.currentTarget)) *
                        100
                      )
                        .toString()
                        .slice(0, 4) + "%"}
                    </Td>
                    <Td>
                      {(Administrator.includes(currentUser) ||
                        sale.currentUser === currentUser) && (
                        <SalesEditModal
                          docId={`${currentMonth}_${sale.currentUser}`}
                        />
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
        {/* <Box mt={6} textAlign="center">
          <Link href="/sales/new">
            <a>
              <Button colorScheme="blue">売上登録</Button>
            </a>
          </Link>
        </Box> */}
      </Container>
    </Box>
  );
};

export default Sales;
