import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { NextPage } from "next";
import {
  taskflow,
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from "../../../data";
import { claimSelectList4 } from "../../../data";
import Link from "next/link";
import { ClaimFilterArea } from "@/components/claims/ClaimFilterArea";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClaimStore } from "../../../store/useClaimStore";
import { useUtils } from "@/hooks/useUtils";
import { Claim } from "../../../types";
import { useDisp } from "@/hooks/useDisp";

const Claims: NextPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const claims = useClaimStore((state) => state.claims);
  const filterClaims = useClaimStore((state) => state.filterClaims);
  const { isAuth } = useUtils();
  const { getUserName } = useDisp();

  //作業者を表示する関数
  const currentOperator = (claim: Claim) => {
    if (claim.operator === "MGR") return "管理者";
    if (claim.operator === "TM") return "TM";
    if ([0, 2, 4].includes(claim.status)) return "事務局";
    return getUserName(claim.operator);
  };

  return (
    <>
      <Flex direction="column" align="center">
        <TableContainer
          w="100%"
          bg="white"
          rounded={6}
          p={4}
          overflowX="unset"
          overflowY="unset"
        >
          <Flex justifyContent="space-between">
            <Box fontSize="lg">
              {filterClaims.length}件/全{claims.length}件
            </Box>
            <Box>
              <ClaimFilterArea />
            </Box>
          </Flex>
          <Box
            mt={3}
            w="full"
            overflowX="auto"
            position="relative"
            h={{
              base: "calc(100vh - 195px)",
            }}
          >
            <Table size="sm">
              <Thead position="sticky" top={0} zIndex="docked" bg="white">
                <Tr>
                  <Th>詳細</Th>
                  <Th minW="80px">作業者</Th>
                  <Th minW="95px">ステータス</Th>
                  <Th minW="105px">受付日</Th>
                  <Th minW="80px">受付NO.</Th>
                  <Th minW="100px">担当</Th>
                  <Th minW="260px">顧客名</Th>
                  <Th minW="105px">発生日</Th>
                  <Th minW="150px">発生内容</Th>
                  <Th minW="160px">修正処置</Th>
                  <Th minW="120px">対策</Th>
                  <Th minW="120px">起因部署</Th>
                  <Th minW="105px">完了日</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filterClaims.map((claim) => (
                  <Tr
                    key={claim.id}
                    bg={
                      claim.operator === currentUser ||
                      (isAuth(["isoOffice"]) &&
                        [0, 2, 4].includes(claim.status)) ||
                      (isAuth(["isoManager"]) && claim.status === 6) ||
                      (isAuth(["isoTopManegment"]) && claim.status === 7)
                        ? "yellow.100"
                        : "white"
                    }
                  >
                    <Td>
                      <Link href={`/claims/${claim.id}`}>
                        <Button size="xs" colorScheme="blue">
                          詳細
                        </Button>
                      </Link>
                    </Td>
                    <Td>{currentOperator(claim)}</Td>
                    <Td>
                      {taskflow.map(
                        (task) => task.id == claim.status && task.status
                      )}
                    </Td>
                    <Td>{claim.receptionDate}</Td>
                    <Td>{claim.receptionNum}</Td>
                    <Td>
                      {users.map(
                        (user) => user.uid == claim.stampStaff && user.name
                      )}
                    </Td>
                    <Td>{claim.customer}</Td>
                    <Td>{claim.occurrenceDate}</Td>
                    <Td>
                      {claimSelectList1.map(
                        (c) =>
                          Number(c.id) === Number(claim.occurrenceSelect) &&
                          c.headline + " " + c.title
                      )}
                    </Td>
                    <Td>
                      {claimSelectList2.map(
                        (c) =>
                          Number(c.id) === Number(claim.amendmentSelect) &&
                          c.title
                      )}
                    </Td>
                    <Td>
                      {claimSelectList3.map(
                        (c) =>
                          Number(c.id) === Number(claim.counterplanSelect) &&
                          c.title
                      )}
                    </Td>
                    <Td>
                      {claimSelectList4.map(
                        (c) =>
                          Number(c.id) ===
                            Number(claim.causeDepartmentSelect) && c.title
                      )}
                    </Td>
                    <Td>{claim.completionDate}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </TableContainer>
      </Flex>
    </>
  );
};

export default Claims;
