import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { CuttingReport } from "../../../types";
import { useCuttingReport } from "../../hooks/useCuttingReport";
import { CuttingReportTr } from "./CuttingReportTr";

type Props = {
  report: CuttingReport;
};

export const CuttingReportModal: FC<Props> = ({ report }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getSerialNumber } = useCuttingReport();

  return (
    <>
      <Button
        size="xs"
        variant="outline"
        colorScheme="facebook"
        onClick={onOpen}
      >
        詳細
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex alignItems="center" gap={3}>
              裁断報告書
            </Flex>
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              <Flex
                gap={6}
                direction={{ base: "column", md: "row" }}
                justify={{ base: "flex-start", md: "space-between" }}
              >
                <Flex
                  gap={6}
                  flex="1"
                  direction={{ base: "column", md: "row" }}
                >
                  <Box>
                    <Text fontWeight="bold">裁断報告書</Text>
                    <Box>No.{getSerialNumber(report?.serialNumber)}</Box>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">裁断日</Text>
                    <Box>{report?.cuttingDate}</Box>
                  </Box>
                </Flex>
                <Box>
                  <Text fontWeight="bold">担当者</Text>
                  <Box>{report?.username}</Box>
                </Box>
              </Flex>
              <Flex
                align="stretch"
                direction={{ base: "column", md: "row" }}
                gap={6}
              >
                <Stack spacing={6} w="full">
                  <Flex gap={6} direction={{ base: "column", md: "row" }}>
                    <Box>
                      <Text fontWeight="bold">加工指示書</Text>
                      <Box>No.{report?.processNumber}</Box>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">受注先名</Text>
                      <Box>{report?.client}</Box>
                    </Box>
                  </Flex>
                  <Flex gap={6} direction={{ base: "column", md: "row" }}>
                    <Box>
                      <Text w="8" fontWeight="bold">
                        種別
                      </Text>
                      <Box>{report?.itemType === "1" ? "既製" : "別注"}</Box>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">品名</Text>
                      <Box>{report?.itemName}</Box>
                    </Box>
                  </Flex>
                  <Flex gap={6}>
                    <Box>
                      <Text fontWeight="bold">枚数</Text>
                      <Box textAlign="right">{report?.totalQuantity}</Box>
                    </Box>
                  </Flex>
                </Stack>
                {report?.comment && (
                  <Box w="full">
                    <Text fontWeight="bold">明細・備考</Text>
                    <Box
                      h="full"
                      p={3}
                      mt={2}
                      whiteSpace="pre-wrap"
                      border="1px"
                      borderColor="gray.100"
                    >
                      {report?.comment}
                    </Box>
                  </Box>
                )}
              </Flex>

              <TableContainer>
                <Table variant="simple" mt={6}>
                  <Thead>
                    <Tr>
                      <Th>種別</Th>
                      <Th>生地品番</Th>
                      <Th>色</Th>
                      <Th>品名</Th>
                      <Th isNumeric>数量</Th>
                      <Th isNumeric>用尺</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {report?.products?.map((product, index) => (
                      <CuttingReportTr
                        key={index}
                        cuttingProduct={product}
                        report={report}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                onClose();
              }}
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
