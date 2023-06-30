import {
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import { arrayUnion, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";
import { useUtils } from "@/hooks/useUtils";

type Data = {
  contents: any;
  headers: string[];
};

const Receivables: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const {getYearMonth} = useUtils()

  const addPaymentConfirm = async () => {
    const { year, monthStr } = getYearMonth();
    const userRef = doc(db, "authority", currentUser);
    try {
      await setDoc(doc(db, "paymentConfirms", `${year}_${monthStr}`), {
        checkList: arrayUnion(currentUser),
        checkListRef: arrayUnion(userRef),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getPaymentConfirm = async () => {
      const { year, monthStr } = getYearMonth();
      const docRef = doc(db, "paymentConfirms", `${year}_${monthStr}`);
     
      onSnapshot(docRef,(doc:any)=>(
        setIsCheck(doc?.data()?.checkList?.includes(currentUser))
      ))
    };
    getPaymentConfirm();
  }, [currentUser]);

  console.log(isCheck)


  const fetcher = async (url: string) =>
    await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SPREADSHEET_APIKEY as string,
      },
    }).then((res) => {
      if (!res.ok) {
        const error = new Error("error fetching the data.");
        throw error;
      }
      return res.json();
    });
  const { data, error, isLoading } = useSWR<Data>("/api/receivables", fetcher);

  if (isLoading)
    return (
      <Flex w="full" justifyContent="center">
        <Spinner />
      </Flex>
    );

  return (
    <Flex direction="column" align="center">
      <TableContainer
        bg="white"
        rounded={6}
        p={6}
        overflowX="unset"
        overflowY="unset"
      >
        <Flex justify="space-between" align="center">
          <Box as="h1" fontSize="lg">
            売掛金回収一覧
          </Box>
          {!isCheck ? (
            <Button size="sm" colorScheme="blue" onClick={addPaymentConfirm}>
              既読にする
            </Button>
          ) : (
            <Button size="sm" isDisabled={true}>
              既読
            </Button>
          )}
        </Flex>
        <Box
          mt={3}
          overflowX="auto"
          position="relative"
          h={"calc(100vh - 200px)"}
        >
          <Table size="sm">
            <Thead position="sticky" top={0} zIndex="docked" bg="white">
              <Tr>
                <Th>コード</Th>
                <Th>得意先名</Th>
                <Th>担当</Th>
                <Th>繰越残高</Th>
                <Th>純売上額</Th>
                <Th>消費税等</Th>
                <Th>今回請求残高</Th>
                <Th>締日付</Th>
                <Th>回収予定日</Th>
                <Th>入金日付</Th>
                <Th>入金遅延</Th>
                <Th>備考</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.contents?.map((content: any, index: number) => (
                <Tr key={index}>
                  <Td>{content.コード}</Td>
                  <Td>{content.得意先名}</Td>
                  <Td>{content.担当}</Td>
                  <Td isNumeric>{content.繰越残高}</Td>
                  <Td isNumeric>{content.純売上額}</Td>
                  <Td isNumeric>{content.消費税等}</Td>
                  <Td isNumeric>{content.今回請求残高}</Td>
                  <Td>{content.締日付}</Td>
                  <Td>{content.回収予定日}</Td>
                  <Td>{content.入金日付}</Td>
                  <Td>{content.入金遅延}</Td>
                  <Td>{content.備考}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </TableContainer>
    </Flex>
  );
};

export default Receivables;
