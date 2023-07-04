import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export const CustomerInfoArea = () => {
  return (
    <Box w="100%" boxShadow="xs" p={{ base: 6, md: 6 }} rounded="md" bg="white">
      <Box>テスト</Box>
      <Flex
        gap={6}
        align="center"
        flexDirection={{ base: "column", "2xl": "row" }}
      >
        <Flex fontSize="lg" align="center" justify="center">
          <Text>今月のお客様情報件数:</Text>
          <Text fontSize="3xl" fontWeight="bold" mx={2} color="red">
            0
          </Text>
          <Text>件</Text>
        </Flex>
        <Flex flex="1" direction={{ base: "column", sm: "row" }} gap={6}>
          <Box w="full">
            <Link href="/customer-informations/" passHref>
              <Button colorScheme="blue" variant="outline" w="100%">
                お客様情報一覧
              </Button>
            </Link>
          </Box>
          <Box w="full">
            <Link href="/customer-informations/new" passHref>
              <Button colorScheme="blue" w="100%">
                お客様情報を作成
              </Button>
            </Link>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
