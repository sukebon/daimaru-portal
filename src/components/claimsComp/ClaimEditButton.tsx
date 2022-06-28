import { Box, Button, Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

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
  updateStaffClaim: any;
  updateCounterplanClaim: any;
  editCancel: any;
  enabledOffice: any;
  imageUrl: string;
  setImageUrl: any;
  fileUpload: any;
};

const ClaimEditButton: NextPage<Props> = ({
  claim,
  currentUser,
  queryId,
  edit,
  isEdit,
  setEdit,
  updateClaim,
  updateStaffClaim,
  updateCounterplanClaim,
  editCancel,
  enabledOffice,
}) => {
  return (
    <>
      <Box w={{ base: '100%', md: '700px' }} py={2} mx='auto'>
        {!edit && (
          <Flex justifyContent='space-between' w='100%'>
            <Box w='100%' mr={1}>
              <Link href={'/claims'}>
                <a>
                  <Button w='100%'>一覧へ戻る</Button>
                </a>
              </Link>
            </Box>
            {/* 受付から内容確認 担当者と作業者と事務局のみ編集可 */}
            {Number(claim.status) > 0 &&
              Number(claim.status) <= 3 &&
              (claim.stampStaff === currentUser ||
                claim.operator === currentUser ||
                enabledOffice()) && (
                <Box w='100%' ml={1}>
                  <Button
                    w='100%'
                    onClick={() => {
                      isEdit();
                      setEdit(true);
                    }}
                  >
                    編集
                  </Button>
                </Box>
              )}
            {/* 上司承認中 上司と事務局のみ編集可 */}
            {Number(claim.status) === 4 &&
              (claim.operator === currentUser || enabledOffice()) && (
                <Box w='100%' ml={1}>
                  <Button
                    w='100%'
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
          <Flex justifyContent='space-between' w='100%'>
            <Button
              w='95%'
              mx={1}
              colorScheme='telegram'
              onClick={() => {
                enabledOffice() && updateClaim(queryId); //事務局用アップデート（すべて）
                claim.stampStaff === currentUser && updateStaffClaim(queryId); //担当者用アップデート（発生内容・修正処置）

                (Number(claim.status) === 2 || Number(claim.status) === 4) &&
                  claim.operator === currentUser &&
                  updateCounterplanClaim(queryId); //対策者用・上司用アップデート（対策）

                setEdit(false); //編集画面から通常画面に戻す
              }}
            >
              OK
            </Button>
            <Button
              w='95%'
              mx={1}
              colorScheme='gray'
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
