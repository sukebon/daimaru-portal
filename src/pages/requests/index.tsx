import { RequestPostList } from "@/components/requests/RequestPostList";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useRequestStore } from "../../../store/useRequestStore";

const Requests = () => {
  const requests = useRequestStore((state) => state.requests);

  return (
    <Flex direction="column" align="center">
      <Box w={{ base: "full", md: "800px" }} p={6} bg="white" rounded="md">
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
              お手伝い依頼一覧
            </Text>
          </Flex>
          <Flex gap={3} p={3}>
            <Link href="/" passHref>
              <Button>トップページへ</Button>
            </Link>
          </Flex>
        </Flex>
        <RequestPostList requests={requests} />
      </Box>
    </Flex>
  );
};

export default Requests;
