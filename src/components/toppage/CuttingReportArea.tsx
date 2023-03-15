import {
  Box,
  Flex,
  List,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import useSWR from "swr";
import { CuttingReportType } from "../../../types/CuttingReportType";

const CuttingReportArea = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data } = useSWR("/api/cutting-reports/", fetcher);
  console.log(data);
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
                  <Th>加工指示書NO.</Th>
                  <Th>受注先名</Th>
                  <Th>品名</Th>
                  <Th>数量</Th>
                  <Th>担当者</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.contents?.map((value: CuttingReportType) => (
                  <>
                    <Tr>
                      <Td>{value?.processNumber}</Td>
                      <Td>{value?.client}</Td>
                      <Td>{value?.itemName}</Td>
                      <Td>{value?.totalQuantity}</Td>
                      <Td>{value?.username}</Td>
                    </Tr>
                  </>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default CuttingReportArea;
