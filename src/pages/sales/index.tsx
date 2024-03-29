/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
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
} from "firebase/firestore";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { SalesEditModal } from "../../components/sales/SalesEditModal";
import { useAuthStore } from "../../../store/useAuthStore";
import { Sale } from "../../../types";
import { useDisp } from "@/hooks/useDisp";
import { useAuthManagement } from "@/hooks/useAuthManegement";

const Sales: NextPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const { isAdminAuth } = useAuthManagement();
  const { getUserName } = useDisp();
  const [sales, setSales] = useState<Sale[]>([]);
  const [targetSum, setTargetSum] = useState<number>(0);
  const [AchiveSum, setAchiveSum] = useState<number>(0);
  const [ExpectSum, setExpectSum] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState(""); //今月 2022-10

  const getYearMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    const lastDate = new Date(year, month, 0);
    let monthStr = "0" + String(month);
    monthStr = monthStr.slice(-2);
    let day = date.getDate();
    let dayStr = "0" + day;
    dayStr = dayStr.slice(-2);
    return {
      year,
      month,
      lastDate,
      monthStr,
      dayStr,
    };
  };

  // salesデータを取得
  useEffect(() => {
    const { year, month, monthStr, lastDate } = getYearMonth();
    const startAtDate = `${year}-${monthStr}-01`;
    const endAtDate = `${year}-${monthStr}-${lastDate.getDate()}`;
    setCurrentMonth(`${year}-${month}`);

    const collectionRef = collection(db, "sales");
    const q = query(
      collectionRef,
      orderBy("datetime"),
      startAt(startAtDate),
      endAt(endAtDate)
    );
    try {
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs
          .map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              } as Sale)
          )
          .sort((a, b) => a.rank - b.rank);
        setSales(data);
        registeredUsers(data.map((sale) => sale?.currentUser));
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  // フィルターを掛けたusersを一人ずつ登録していく
  const registeredUsers = (usersArray: string[] = []) => {
    const result = usersArray.includes(currentUser);
    if (result) return;
    users.forEach(({ isoSalesStaff, uid, rank }) => {
      if (isoSalesStaff) {
        addSales(uid, rank);
      }
    });
  };

  // 営業担当を登録する
  const addSales = async (uid: string, rank: number) => {
    const { year, month, monthStr, dayStr } = getYearMonth();
    const result = year + "-" + month;
    const docRef = doc(db, "sales", `${result}_${uid}`);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      try {
        await setDoc(docRef, {
          currentUser: uid,
          currentTarget: 0,
          currentAchieve: 0,
          currentExpect: 0,
          createdAt: serverTimestamp(),
          datetime: `${year}-${monthStr}-${dayStr}`,
          rank,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // 目標・着地・予定
  useEffect(() => {
    let target = 0,
      achive = 0,
      expect = 0;
    sales?.forEach((sale) => {
      target += Number(sale.currentTarget);
      achive += Number(sale.currentAchieve);
      expect += Number(sale.currentExpect);
    });
    setTargetSum(target);
    setAchiveSum(achive);
    setExpectSum(expect);
  }, [sales]);

  const getAchievementRate = (
    target: number,
    achive: number,
    expect: number
  ) => {
    const result = (((expect + achive) / target) * 100).toString().slice(0, 4);
    return Number(result);
  };

  const getDifference = (sale: Sale) => {
    const calc =
      Number(sale.currentExpect) -
      Number(sale.currentTarget) +
      Number(sale.currentAchieve);
    return calc;
  };

  return (
    <Container maxW="1200px">
      <Flex justify="space-between" align="center">
        <Box my={3} fontSize="xl">
          {currentMonth}月 売上一覧
        </Box>
        <Box>（単位:万円）</Box>
      </Flex>
      <TableContainer bg="white" rounded="md" p={6} boxShadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>担当</Th>
              <Th>予算</Th>
              <Th>実績</Th>
              <Th>計上予定</Th>
              <Th>合計</Th>
              <Th>差額</Th>
              <Th>達成率</Th>
              <Th>更新日</Th>
              <Th>編集</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sales?.map((sale) => (
              <Tr
                key={sale.id}
                bgColor={
                  getAchievementRate(
                    Number(sale.currentTarget),
                    Number(sale.currentAchieve),
                    Number(sale.currentExpect)
                  ) >= 100
                    ? "#d4bf0096"
                    : ""
                }
              >
                <Td mr={6}>{getUserName(sale.currentUser)}</Td>
                <Td isNumeric>{Number(sale.currentTarget).toLocaleString()}</Td>
                <Td isNumeric>
                  {Number(sale.currentAchieve).toLocaleString()}
                </Td>
                <Td isNumeric>{Number(sale.currentExpect).toLocaleString()}</Td>
                <Td fontWeight="bold" isNumeric>
                  {(
                    Number(sale.currentAchieve) + Number(sale.currentExpect)
                  ).toLocaleString()}
                </Td>
                <Td
                  fontWeight="bold"
                  isNumeric
                  color={getDifference(sale) < 0 ? "red" : ""}
                >
                  {getDifference(sale).toLocaleString()}
                </Td>
                <Td fontWeight="bold" isNumeric>
                  {getAchievementRate(
                    Number(sale.currentTarget),
                    Number(sale.currentAchieve),
                    Number(sale.currentExpect)
                  ) || 0}
                  %
                </Td>
                <Td>{sale?.updatedAt?.toDate().toLocaleString()}</Td>
                <Td>
                  {(isAdminAuth() || sale.currentUser === currentUser) && (
                    <SalesEditModal sale={sale} />
                  )}
                </Td>
              </Tr>
            ))}
            <Tr
              fontWeight="bold"
              bgColor={
                getAchievementRate(targetSum, AchiveSum, ExpectSum) >= 100
                  ? "#00f3a0"
                  : ""
              }
            >
              <Td mr={6}>合計</Td>
              <Td isNumeric>{targetSum?.toLocaleString()}</Td>
              <Td isNumeric>{AchiveSum?.toLocaleString()}</Td>
              <Td isNumeric>{ExpectSum?.toLocaleString()}</Td>
              <Td isNumeric>{(AchiveSum + ExpectSum).toLocaleString()}</Td>
              <Td
                isNumeric
                color={AchiveSum + ExpectSum - targetSum < 0 ? "red" : ""}
              >
                {(AchiveSum + ExpectSum - targetSum).toLocaleString()}
              </Td>
              <Td isNumeric>
                {getAchievementRate(targetSum, AchiveSum, ExpectSum)}%
              </Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Sales;
