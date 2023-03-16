import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { CuttingReportType } from "../../../types/CuttingReportType";

const CuttingReportArea = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data } = useSWR("/api/cutting-reports/", fetcher);

  const getSerialNumber = (serialNumber: number) => {
    const str = "0000000000" + String(serialNumber);
    return str.slice(-10);
  };

  return (
    <>
      {data?.contents?.length > 0 && (
        <Box
          width="100%"
          boxShadow="xs"
          p={{ base: 3, md: 6 }}
          rounded="md"
          bg="white"
        >
          <Text fontSize="2xl" mb="4" ml="1">
            本日登録の裁断報告書
          </Text>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>裁断報告書NO.</Th>
                  <Th>加工指示書NO.</Th>
                  <Th>受注先名</Th>
                  <Th>品名</Th>
                  <Th>数量</Th>
                  <Th>担当者</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.contents?.map((report: CuttingReportType) => (
                  <>
                    <Tr>
                      <Td>{getSerialNumber(report?.serialNumber)}</Td>
                      <Td>{report?.processNumber}</Td>
                      <Td>{report?.client}</Td>
                      <Td>{report?.itemName}</Td>
                      <Td>{report?.totalQuantity}</Td>
                      <Td>{report?.username}</Td>
                    </Tr>
                  </>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex w="full" justifyContent="center">
            <Link href="https://daimaru-kijizaiko.vercel.app/dashboard">
              <a target="_blank" rel="noopener noreferrer">
                <Button mt={6} colorScheme="blue">
                  生地在庫アプリへ移動
                </Button>
              </a>
            </Link>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default CuttingReportArea;
