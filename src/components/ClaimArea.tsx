import { Box, Button, Flex, Text } from "@chakra-ui/react";
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
import { useRecoilValue } from "recoil";
import { db } from "../../firebase";
import { authState, claimsState, usersState } from "../../store";

const ClaimArea = () => {
  const claims = useRecoilValue(claimsState);
  const users = useRecoilValue(usersState);
  const currentUser = useRecoilValue(authState);
  const [claimCount, setClaimCount] = useState(0);
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);
  const [isoManagerUsers, setIsoManagerUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDate = new Date(year, month, 0);
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${lastDate.getDate()}`;
    console.log(startDate);
    console.log(endDate);
    const q = query(
      collection(db, "claimList"),
      orderBy("receptionDate"),
      startAt(startDate),
      endAt(endDate)
    );

    onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.map((doc: any) => ({ ...doc.data() }));
      setClaimCount(count.length);
    });
  }, []);

  //【クレーム】各自クレーム処理件数
  const myClaimCount = () => {
    let sum = 0;
    claims.forEach((claim: any) => {
      if (
        claim.operator == currentUser ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(0)) ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(2)) ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(4)) ||
        (searchUsers(isoManagerUsers).includes(currentUser) &&
          claim.status === Number(6)) ||
        (searchUsers(isoTopManegmentUsers).includes(currentUser) &&
          claim.status === Number(7))
      ) {
        sum++;
      }
    });
    if (sum === 0) return;
    return sum;
  };

  //各リストを取得
  useEffect(() => {
    //ISO 事務局のリスト(オブジェクト）
    setIsoOfficeUsers(
      users.filter((user: any) => {
        return user.isoOffice === true;
      })
    );
    //ISOマネージャーのリスト(オブジェクト）
    setIsoManagerUsers(
      users.filter((user: any) => {
        return user.isoManager === true;
      })
    );
    //ISO トップマネジメントのリスト(オブジェクト）
    setIsoTopManegmentUsers(
      users.filter((user: any) => {
        return user.isoTopManegment === true;
      })
    );
    //ISO 上司のリスト(オブジェクト）
  }, [users]);

  //【クレーム】iso（事務局・管理者・TM）のオブジェクトからuidのみ取り出して配列にする
  const searchUsers = (array: { uid: string }[]) => {
    const newUsers = array.map((user: { uid: string }) => {
      return user.uid;
    });
    return newUsers;
  };
  return (
    <>
      {myClaimCount() && (
        <Box width="100%" boxShadow="xs" mt="6" p="6" rounded="md" bg="white">
          <Flex
            fontSize="md"
            mt="1"
            ml="1"
            flexDirection={{
              base: "column",
              md: "row",
              lg: "column",
              xl: "row",
            }}
          >
            <Box>
              クレーム報告書 未処理件数：
              <Box as="span" color="red" fontWeight="bold">
                {myClaimCount()}
              </Box>
              件{" 　"}
            </Box>
            <Box>
              <Link href="/claims">
                <a>
                  <Text
                    as="span"
                    fontWeight="bold"
                    textDecoration="underline"
                    _hover={{
                      textDecoration: "none",
                    }}
                  >
                    クレーム報告書一覧
                  </Text>
                </a>
              </Link>
              をcheckしてください。
            </Box>
          </Flex>
        </Box>
      )}
      <Flex
        width="100%"
        alignItems="center"
        justifyContent={{ base: "flex-start", md: "space-between" }}
        flexDirection={{ base: "column", md: "row" }}
        boxShadow="xs"
        mt="6"
        p="6"
        rounded="md"
        bg="white"
      >
        <Flex w="100%" my={1} fontSize="lg" alignItems="center">
          <Text>今月のクレーム報告件数:</Text>
          <Text fontSize="3xl" fontWeight="bold" mx={2} color="red">
            {claimCount}
          </Text>
          <Text>件</Text>
        </Flex>
        <Box w="100%" my={1}>
          <Link href="/claims/new">
            <a>
              <Button colorScheme="blue" w="100%">
                クレーム報告書を作成
              </Button>
            </a>
          </Link>
        </Box>
      </Flex>
    </>
  );
};

export default ClaimArea;
