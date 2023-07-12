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
import useSWR from "swr";
import { FC } from "react";
import Link from "next/link";

type Data = {
  contents: any;
  headers: string[];
};

export const ReceivablesArea: FC = () => {
  const fetcher = (url: string) =>
    axios
      .get(url, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SPREADSHEET_APIKEY as string,
        },
      })
      .then((res) => res.data);
  const { data, error, isLoading } = useSWR<Data>(
    "/api/receivables/uncollected/",
    fetcher
  );

  return (
    <>
      {data?.contents && data?.contents?.length > 0 && (
        <Box
          w="full"
          boxShadow="xs"
          p={{ base: 6, md: 6 }}
          rounded="md"
          bg="white"
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold">
              売掛未回収
            </Text>
            <Link href="/receivables" passHref>
              <Button variant="outline" colorScheme="blue" size="sm">
                一覧
              </Button>
            </Link>
          </Flex>
          <TableContainer mt={3}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {/* <Th>コード</Th> */}
                  <Th>得意先名</Th>
                  <Th>担当</Th>
                  <Th>入金遅延</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.contents?.map((content: any, index: number) => (
                  <Tr key={index}>
                    {/* <Td>{content.コード}</Td> */}
                    <Td fontSize="xs">{content.得意先名}</Td>
                    <Td fontSize="xs">{content.担当}</Td>
                    <Td fontSize="xs">{content.入金遅延}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};
