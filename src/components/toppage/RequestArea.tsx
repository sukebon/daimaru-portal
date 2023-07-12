import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { RequestPostList } from "../requests/RequestPostList";
import { useRequestStore } from "../../../store/useRequestStore";

export const RequestArea: FC = () => {
  const requests = useRequestStore((state) => state.requests);

  return (
    <Box p={{ base: 6, md: 6 }} boxShadow="xs" rounded="md" bg="white">
      <Flex
        justify="space-between"
        align="center"
        gap={3}
      >
        <Flex align="center">
          <Box fontSize="lg" fontWeight="bold">
            お手伝い依頼
          </Box>
        </Flex>
        <Flex gap={2}>
          <Link href="/requests" passHref>
            <Button variant="outline" size="sm" colorScheme="blue">
              一覧
            </Button>
          </Link>
          {/* <Link href="/requests/stopped-list" passHref>
            <Button>掲載終了一覧</Button>
          </Link> */}
          <Link href="/requests/new" passHref>
            <Button size="sm" colorScheme="blue">
              作成
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Divider mt={6} />
      <RequestPostList requests={requests} />
    </Box>
  );
};
