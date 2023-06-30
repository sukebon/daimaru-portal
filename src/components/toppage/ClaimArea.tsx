import { Box, Button, Flex, Text, keyframes } from "@chakra-ui/react";
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
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";
import { useUtils } from "@/hooks/useUtils";

const animationKeyframes = keyframes`
0% { background-color: yellow; }
50% { background-color: white; }
100% { background-color: yellow;  }
`;
const animation = `${animationKeyframes} 2s ease-in-out infinite`;

export const ClaimArea = () => {
  const { isAuth } = useUtils();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [claimThisMonthCount, setClaimThisMonthCount] = useState(0);
  const [claimMyCount, setClaimMyCount] = useState(0);
  const [claimGroupCount, setClaimGroupCount] = useState(0);


  // 今月のクレーム件数
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDate = new Date(year, month, 0);
    let monthStr = "0" + month;
    monthStr.slice(-2);
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
      setClaimThisMonthCount(count.length);
    });
  }, []);

  // 自分のクレーム処理件数
  useEffect(() => {
    const q = query(
      collection(db, "claimList"),
      where('operator', '==', currentUser || false)
    );
    onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.map((doc) => ({ ...doc.data() }));
      setClaimMyCount(count.length);
    });
  }, [currentUser]);

  // グループのクレーム処理件数
  useEffect(() => {
    let operator;
    if (isAuth(['isoOffice'])) {
      operator = "事務局";
    }
    if (isAuth(['isoManager'])) {
      operator = "MGR";
    }
    if (isAuth(['isoTopManegment'])) {
      operator = "TM";
    }
    const q = query(
      collection(db, "claimList"),
      where('operator', '==', operator || false)
    );
    onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.map((doc) => ({ ...doc.data() }));
      setClaimGroupCount(count.length);
    });
  }, [isAuth]);

  const claimMyCountEL = (count: number) => (
    <Box boxShadow="xs" p="6" rounded="md" bg="white">
      <Flex
        gap={3}
        fontSize="md"
        direction={{
          base: "column",
          md: "row",
          lg: "column",
          xl: "row",
        }}
      >
        <Box>
          クレーム報告書 未処理件数：
          <Box as="span" color="red" fontWeight="bold">
            {count}
          </Box>
          件
        </Box>
        <Box>
          <Link href="/claims" passHref>
            <Box
              as="span"
              p={2}
              fontWeight="bold"
              rounded="md"
              textDecoration="underline"
              animation={animation}
            >
              クレーム報告書一覧
            </Box>
          </Link>
          を check してください。
        </Box>
      </Flex>
    </Box>
  );

  return (
    <>
      {claimMyCount > 0 && (
        claimMyCountEL(claimMyCount)
      )}
      {claimGroupCount > 0 && (
        claimMyCountEL(claimGroupCount)
      )}

      <Flex
        w="full"
        p="6"
        align="center"
        justify={{ base: "flex-start", md: "space-between" }}
        direction={{
          base: "column",
          md: "row",
          lg: "column",
          xl: "column",
          "2xl": "row",
        }}
        gap={6}
        boxShadow="xs"
        rounded="md"
        bg="white"
      >
        <Flex fontSize="lg" align="center">
          <Text>今月のクレーム報告件数:</Text>
          <Text fontSize="3xl" fontWeight="bold" mx={2} color="red">
            {claimThisMonthCount}
          </Text>
          <Text>件</Text>
        </Flex>
        <Flex flex="1" direction={{ base: "column", sm: "row" }} gap={6}>
          <Box w="full">
            <Link href="/claims/" passHref>
              <Button colorScheme="blue" variant="outline" w="100%">
                クレーム報告書一覧
              </Button>
            </Link>
          </Box>
          <Box w="full">
            <Link href="/claims/new" passHref>
              <Button colorScheme="blue" w="100%">
                クレーム報告書を作成
              </Button>
            </Link>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
