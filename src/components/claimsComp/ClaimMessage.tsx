import { Alert, AlertIcon, Box, Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  claim: {
    status: string;
    operator: string;
    message: string;
  };
  currentUser: string;
  users: [];
  enabledOffice: any;
  enabledManager: any;
  enabledTopManegment: any;
};

const ClaimMessage: NextPage<Props> = ({
  claim,
  currentUser,
  users,
  enabledOffice,
  enabledManager,
  enabledTopManegment,
}) => {
  return (
    <>
      <Flex
        w={{ base: '100%', md: '700px' }}
        mx='auto'
        justifyContent='space-between'
      >
        {/* 対策者に表示するメッセージ */}
        {Number(claim.status) === 2 && claim.operator === currentUser && (
          <Alert status='info'>
            <AlertIcon />
            {users.map(
              (user: { uid: string; name: string }) =>
                claim.operator === user.uid && (
                  <Box key={user.uid}>
                    <Box>作業者：{user.name}</Box>
                    <Box>
                      対策を記入してください。終わり次第、下のブルーのボタンをクリックしてください。
                    </Box>
                  </Box>
                )
            )}
          </Alert>
        )}

        {/* 上司に表示するメッセージ */}
        {Number(claim.status) === 4 && claim.operator === currentUser && (
          <Alert status='info'>
            <AlertIcon />
            {users.map(
              (user: { uid: string; name: string }) =>
                claim.operator === user.uid && (
                  <Box key={user.uid}>
                    <Box>作業者：{user.name}</Box>
                    <Box>
                      完了日と対策の確認してから承認ボタンをクリックしてください。
                    </Box>
                  </Box>
                )
            )}
          </Alert>
        )}

        {/* 管理者に表示するメッセージ */}
        {Number(claim.status) === 5 && enabledManager() && (
          <Alert status='info'>
            <AlertIcon />
            <Box>
              <Box>内容を確認してから承認ボタンをクリックしてください。</Box>
            </Box>
          </Alert>
        )}

        {/* topManagmentに表示するメッセージ */}
        {Number(claim.status) === 6 && enabledTopManegment() && (
          <Alert status='info'>
            <AlertIcon />
            <Box>内容を確認してから承認ボタンをクリックしてください。</Box>
          </Alert>
        )}

        {/* 事務局に表示するメッセージ */}
        {claim.message && Number(claim.status) === 3 && enabledOffice() && (
          <Alert status='error'>
            <AlertIcon />
            <Box>{claim.message}</Box>
          </Alert>
        )}
      </Flex>
    </>
  );
};

export default ClaimMessage;
