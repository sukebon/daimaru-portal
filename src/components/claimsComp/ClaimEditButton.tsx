import { Box, Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

type Props = {
  claim: {
    status: string;
    stampStaff: string;
    operator: string;
  };
  currentUser: string;
  queryId: string | string[] | undefined;
  edit: boolean;
  isEdit: any;
  setEdit: any;
  updateClaim: any;
  editCancel: any;
  enabledOffice: any;
};

const ClaimEditButton: NextPage<Props> = ({
  claim,
  currentUser,
  queryId,
  edit,
  isEdit,
  setEdit,
  updateClaim,
  editCancel,
  enabledOffice,
}) => {
  return (
    <>
      <Box w={{ base: "100%", md: "700px" }} py={2} mx="auto">
        {!edit && (
          <Flex justifyContent="space-between" w="100%">
            <Box w="100%" mr={1}>
              <Link href={"/claims"}>
                <a>
                  <Button w="100%">一覧へ戻る</Button>
                </a>
              </Link>
            </Box>
            {Number(claim.status) > 0 &&
              Number(claim.status) < 5 &&
              (claim.stampStaff === currentUser ||
                claim.operator === currentUser ||
                enabledOffice()) && (
                <Box w="100%" ml={1}>
                  <Button
                    w="100%"
                    onClick={() => {
                      isEdit();
                      setEdit(true);
                    }}
                  >
                    編集
                  </Button>
                </Box>
              )}
          </Flex>
        )}
        {edit && (
          <Flex justifyContent="space-between" w="100%">
            <Button
              w="95%"
              mx={1}
              colorScheme="telegram"
              onClick={() => {
                updateClaim(queryId);
                setEdit(false);
              }}
            >
              OK
            </Button>
            <Button
              w="95%"
              mx={1}
              colorScheme="gray"
              onClick={() => {
                editCancel();
                setEdit(false);
              }}
            >
              キャンセル
            </Button>
          </Flex>
        )}
      </Box>
    </>
  );
};

export default ClaimEditButton;
