import { Box, Flex } from '@chakra-ui/react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { NextPage } from 'next';
import { relative } from 'path';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { ClaimProps } from '../../../lib/ClaimProps';

const ClaimStampArea: NextPage<ClaimProps> = ({ claim }) => {
  const [users, setUsers] = useState<any>([]); //ユーザー一覧
  //ユーザー一覧を取得
  useEffect(() => {
    const usersCollectionRef = collection(db, 'authority');
    const q = query(usersCollectionRef, orderBy('rank', 'asc'));
    const unsub = onSnapshot(q, (querySnapshot: any) => {
      setUsers(
        querySnapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);
  return (
    <>
      <Box
        w={{ base: '100%', md: '750px' }}
        mt={2}
        p={2}
        mx='auto'
        backgroundColor='white'
        borderRadius={6}
      >
        <Flex
          justifyContent='space-around'
          flexDirection={{ base: 'column-reverse', md: 'row' }}
        >
          <Box textAlign='center'>
            <Box fontSize='xs'>記入者</Box>
            <Box py={2} color='red' fontWeight='bold'>
              {claim.author &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.author && user.name
                )}
            </Box>
          </Box>
          <Box textAlign='center'>
            <Box fontSize='xs'>担当者</Box>
            <Box py={2} color='red' fontWeight='bold'>
              {claim.stampStaff &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampStaff && user.name
                )}
            </Box>
          </Box>
          <Box textAlign='center'>
            <Box fontSize='xs'>事務局</Box>
            <Box py={2} color='red' fontWeight='bold'>
              {claim.stampOffice &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampOffice && user.name
                )}
            </Box>
          </Box>
          <Box textAlign='center'>
            <Box fontSize='xs'>上司</Box>
            <Box py={2} color='red' fontWeight='bold'>
              {claim.stampBoss &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampBoss && user.name
                )}
            </Box>
          </Box>
          <Box textAlign='center'>
            <Box fontSize='xs'>管理者</Box>
            <Box py={2} color='red' fontWeight='bold'>
              {claim.stampManager &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampManager && user.name
                )}
            </Box>
          </Box>
          <Box textAlign='center'>
            <Box fontSize='xs'>TM</Box>
            <Box py={2} color='red' fontWeight='bold'>
              {claim.stampTm &&
                users.map(
                  (user: { uid: string; name: string }) =>
                    user.uid === claim.stampTm && user.name
                )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ClaimStampArea;
