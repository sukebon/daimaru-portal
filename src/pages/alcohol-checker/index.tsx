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
import { collection, getCountFromServer } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useUtils } from "@/hooks/useUtils";
import { useQueryAlcoholList } from "@/hooks/Alcohols/useQueryAlcoholList";
import { useMutateAlcoholList } from "@/hooks/Alcohols/useMutateAlcoholList";
import { db } from "../../../firebase";
import { AlcoholCheckList } from "../../../types";

const Alcohol = () => {
  const { isAuth } = useUtils();
  const users = useAuthStore((state) => state.users);
  // const [count, setCount] = useState(30);
  const [totalCount, setTotalCount] = useState(0);
  const [flag, setFlag] = useState(false);
  const { data, isLoading } = useQueryAlcoholList(30);
  const [alcoholList, setAlcoholList] = useState<
    AlcoholCheckList[]
  >([]);
  const [dataEndAt, setDataEndAt] = useState<string>("");
  const { readAlcoholCheckListMutate } = useMutateAlcoholList();
  const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"];

  const getList = () => {
    setFlag(true);
    setTimeout(() => {
      readAlcoholCheckListMutate.mutate({
        count: 30,
        dataEndAt,
        oldData: data || [],
      });
      setTimeout(() => {
        setFlag(false);
      }, 500);
    }, 500);
  };

  useEffect(() => {
    const getCount = async () => {
      const coll = collection(db, "alcoholCheckList");
      const snapshot = await getCountFromServer(coll);
      setTotalCount(snapshot.data().count);
    };
    getCount();
  }, []);

  useEffect(() => {
    setAlcoholList(data || []);
    setDataEndAt(data?.at(-1)?.id || "");
  }, [data]);

  const getDayOfWeek = (value: string) => {
    const date = new Date(value);
    const dayOfWeek = date.getDay();
    return dayOfWeekStr[dayOfWeek];
  };

  return (
    <>
      {isAuth(["alcoholChecker"]) && (
        <Flex direction="column" align="center">
          <TableContainer bg="white" rounded={6} p={6}>
            <Box as="h1" fontSize="lg">
              アルコールチェック一覧
            </Box>

            <Table size="sm" mt={6}>
              <Thead>
                <Tr>
                  <Th minW="130x">日付</Th>
                  <Th minW="50px">提出者</Th>
                  {/* <Th minW="50px">未提出者</Th> */}
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {alcoholList?.map(({ id, member }) => (
                  <Tr key={id}>
                    <Td>
                      {id} ({getDayOfWeek(id)})
                    </Td>
                    <Td>{member.length}名</Td>
                    {/* <Td>{users.length - member.length}名</Td> */}
                    <Td>
                      <Link href={`alcohol-checker/${id}`} passHref>
                        <Button size="xs">詳細</Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {totalCount >= alcoholList?.length && (
              <Flex mt={6} justify="center">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Button
                    isLoading={flag ? true : false}
                    loadingText="さらに表示する"
                    onClick={getList}
                  >
                    さらに表示する
                  </Button>
                )}
              </Flex>
            )}
          </TableContainer>
        </Flex>
      )}
    </>
  );
};

export default Alcohol;
