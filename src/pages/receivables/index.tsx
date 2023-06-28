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
import React, { useEffect, useState } from "react";
import { spreadsheetAPI, spreadsheetID } from "../../../firebase";

const Receivables = () => {
  const [contents, setContents] = useState<any>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  useEffect(() => {
    const getSpreadSheet = async () => {
      const id = spreadsheetID;
      const sheetName = "keiri";
      const apikey = spreadsheetAPI;
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheetName}?key=${apikey}`
      );
      const data = await res.json();
      console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
      const headers = data.values?.shift();
      setHeaders(headers);
      const array = data.values?.map((lists: any) => {
        let obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = lists[index];
        });
        return obj;
      });

      setContents(array);
    };
    getSpreadSheet();
  }, []);

  if (contents === null)
    return (
      <Flex w="full" h={"calc(100vh - 200px)"} justify="center" align="center">
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
                {headers?.map((header) => (
                  <Th key={header} minW="130x">
                    {header}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {contents?.map((content: any) => (
                <Tr key={content}>
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
