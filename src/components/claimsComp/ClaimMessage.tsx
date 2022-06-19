import { Alert, AlertIcon, Box, Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  claim: {
    status: string;
    operator: string;
  };
  currentUser: string;
  users: [];
};

const ClaimMessage: NextPage<Props> = ({ claim, currentUser, users }) => {
  return (
    <>
      {Number(claim.status) === 2 && claim.operator === currentUser && (
        <Flex
          w={{ base: '100%', md: '700px' }}
          mx='auto'
          justifyContent='space-between'
        >
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
        </Flex>
      )}
    </>
  );
};

export default ClaimMessage;
