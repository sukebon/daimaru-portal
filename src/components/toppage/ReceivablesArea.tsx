import {
  Box,
  Button,
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
import useSWR from "swr";
import { FC, useState, useEffect } from "react";
import Link from "next/link";

type Data = {
  contents: any;
  headers: string[];
};

export const ReceivablesArea: FC = () => {
  const fetcher = (url: string) => axios.get(url, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SPREADSHEET_ID as string,
    }
  }).then((res) => res.data);
  const { data, error, isLoading } = useSWR<Data>('/api/receivables', fetcher);
  const [fileterData, setFilterData] = useState([]);
  useEffect(() => {
    setFilterData(data?.contents.filter((content: any) => (
      content.入金遅延 === '未回収'
    )));
  }, [data?.contents]);
  console.log(data?.contents);
  return (
    <>
      {fileterData && fileterData?.length > 0 && (
        <Box
          m="full"
          boxShadow="xs"
          p={{ base: 3, md: 6 }}
          rounded="md"
          bg="white"
        >
          <Text fontSize="2xl" mb="4" ml="1">
            売掛未回収一覧（テスト）
          </Text>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {data?.headers.map((header, index: number) => (
                    <Th key={index}>{header}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {fileterData?.map((content: any, index: number) => (
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
          </TableContainer>
          <Link
            href="./receivables"
          >
            <Button mt={6} w="full" colorScheme="blue">
              売掛金情報一覧
            </Button>
          </Link>
        </Box>
      )}
    </>
  );
};
