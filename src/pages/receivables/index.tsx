import {
  Box,
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
import React, { useState } from "react";
import useSWR from 'swr';
// import axios from "axios";



type Data = {
  contents: any;
  headers: string[];
};

const Receivables = () => {
  const fetcher = async (url: string) => await fetch(url, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SPREADSHEET_ID as string,
    }
  }).then(res => {
    if (!res.ok) {
      const error = new Error('error fetching the data.');
      throw error;
    }
    return res.json();
  });
  const { data, error, isLoading } = useSWR<Data>('/api/receivables', fetcher);

  if (isLoading) return (
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
        <Box as="h1" fontSize="lg">
          売掛金回収一覧
        </Box>
        <Box
          mt={3}
          overflowX="auto"
          position="relative"
          h={"calc(100vh - 200px)"}
        >
          <Table size="sm">
            <Thead position="sticky" top={0} zIndex="docked" bg="white">
              <Tr>
                {data?.headers?.map((header) => (
                  <Th key={header} minW="130x">
                    {header}
                  </Th>
                ))}
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
