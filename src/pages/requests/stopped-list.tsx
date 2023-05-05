import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RequestPostList } from "@/components/requests/RequestPostList";
import { useQueryRequests } from "@/hooks/requests/useQueryRequests";
import { useMutateRequests } from "@/hooks/requests/useMutateRequests";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const StoppedList = () => {
  const [count, setCount] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [flag, setFlag] = useState(false);
  const { data, isLoading } = useQueryRequests(count);
  const { readStopedRequestsMutation } = useMutateRequests();

  const getList = () => {
    setFlag(true);
    setTimeout(() => {
      setCount(count + 10);
      readStopedRequestsMutation.mutate(count + 10);
      setTimeout(() => {
        setFlag(false);
      }, 500);
    }, 500);
  };

  useEffect(() => {
    const getCount = async () => {
      const coll = collection(db, "requestList");
      const q = query(coll, where("display", "==", false));
      const snapshot = await getCountFromServer(q);
      setTotalCount(snapshot.data().count);
    };
    getCount();
  }, []);

  return (
    <Flex direction="column" align="center">

      <Box w={{ base: "100%", md: "800px" }} p={6} bg="white" rounded="md">
        <Flex
          justify="space-between"
          align="center"
          direction={{
            base: "column",
            md: "row",
            lg: "column",
            xl: "row",
          }}
          mb={3}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            gap={3}
          >
            <Text fontSize="2xl" mr="3">
              【掲載終了】お手伝い依頼一覧
            </Text>
          </Flex>
          <Flex gap={3} p={3}>
            <Link href="/">
              <Button>トップページへ</Button>
            </Link>
          </Flex>
        </Flex>
        <RequestPostList requests={data || []} />
        {totalCount >= count && (
          <Flex justify="center">
            {isLoading ? <Spinner /> : (
              <Button isLoading={flag ? true : false} loadingText='さらに表示する' onClick={getList}>さらに表示する</Button>
            )}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default StoppedList;
