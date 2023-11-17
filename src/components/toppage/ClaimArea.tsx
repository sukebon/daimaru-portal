import {
  Box,
  Button,
  Flex,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  endAt,
  onSnapshot,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";

export const ClaimArea = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [claimThisMonthCount, setClaimThisMonthCount] = useState(0);
  const [claimLastMonthCount, setClaimLastMonthCount] = useState(0);

  // 今月のクレーム件数
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDate = new Date(year, month, 0);
    let monthStr = "0" + month;
    const sliceMonth = monthStr.slice(-2);
    const startDate = `${year}-${sliceMonth}-01`;
    const endDate = `${year}-${sliceMonth}-${lastDate.getDate()}`;
    const q = query(
      collection(db, "claimList"),
      orderBy("receptionDate"),
      startAt(startDate),
      endAt(endDate)
    );
    onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.map((doc) => ({ ...doc.data() }));
      setClaimThisMonthCount(count.length);
    });
  }, []);

  // 先月のクレーム件数
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth();
    const lastDate = new Date(year, month, 0);
    let monthStr = "0" + month;
    monthStr = monthStr.slice(-2);
    const startDate = `${year}-${monthStr}-01`;
    const endDate = `${year}-${monthStr}-${lastDate.getDate()}`;
    const q = query(
      collection(db, "claimList"),
      orderBy("receptionDate"),
      startAt(startDate),
      endAt(endDate)
    );
    onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.map((doc) => ({ ...doc.data() }));
      setClaimLastMonthCount(count.length);
    });
  }, []);

  return (
    <>
      <Flex
        flex="1"
        p="6"
        align="center"
        justify="center"
        boxShadow="xs"
        rounded="md"
        bg="white"
      >
        <Flex direction="column">
          <Stat textAlign="center">
            <StatLabel>今月のクレーム件数</StatLabel>
            <StatNumber fontSize="3xl">
              {claimThisMonthCount}
              <Box as="span" fontSize="lg">
                件
              </Box>
            </StatNumber>
            <StatHelpText>
              <StatArrow
                type={
                  claimThisMonthCount > claimLastMonthCount
                    ? "increase"
                    : "decrease"
                }
              />
              {Math.abs(Math.round(
                (1 - claimThisMonthCount / claimLastMonthCount) * 1000
              ) / 10)}
              % (前月比)
            </StatHelpText>
          </Stat>
          <Flex justify="center" gap={2} mt={3}>
            <Link href="/claims/" passHref>
              <Button colorScheme="blue" variant="outline" size="sm">
                一覧
              </Button>
            </Link>
            <Link href="/claims/new" passHref>
              <Button colorScheme="blue" size="sm">
                作成
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
