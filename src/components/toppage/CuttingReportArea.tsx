import {
  Box,
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
import { CuttingReport } from "../../../types";
import { useCuttingReport } from "../../hooks/useCuttingReport";
import { CuttingReportModal } from "../cutting-report/CuttingReportModal";

type Data = {
  contents: CuttingReport[];
};

const CuttingReportArea = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: reports } = useSWR<Data>("/api/cutting-reports/", fetcher);
  // const { data: reports } = useSWR<Data>("/api/cutting-reports/ready-made/", fetcher);
  const { getSerialNumber } = useCuttingReport();

  return (
    <>
      {reports?.contents && reports?.contents?.length > 0 && (
        <Box
          w="100%"
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
                  <Th>詳細</Th>
                  <Th>裁断報告書NO.</Th>
                  <Th>加工指示書NO.</Th>
                  <Th>受注先名</Th>
                  <Th>品名</Th>
                  <Th>数量</Th>
                  <Th>担当者</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reports?.contents.map((report) => (
                  <Tr key={report.id}>
                    <Td>
                      <CuttingReportModal report={report} />
                    </Td>
                    <Td fontSize="xs">
                      {getSerialNumber(report?.serialNumber)}
                    </Td>
                    <Td fontSize="xs">{report?.processNumber}</Td>
                    <Td fontSize="xs">{report?.client}</Td>
                    <Td fontSize="xs">{report?.itemName}</Td>
                    <Td fontSize="xs" isNumeric>
                      {report?.totalQuantity}
                    </Td>
                    <Td fontSize="xs">{report?.username}</Td>
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

export default CuttingReportArea;
