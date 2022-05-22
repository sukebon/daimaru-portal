import { Box, Button, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase/auth';
import { users } from '../data.js';

interface Props {
  requests: {
    id: string;
    title: string;
    content: string;
    displayAt: boolean;
    deleteAt: boolean;
    editAt: boolean;
    sendAt: string;
  }[];
}

const Post: NextPage<Props> = ({ requests }) => {
  const [user] = useAuthState(auth);

  const setRequest = async (uid: any) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      member: arrayUnion(user && user.uid),
    });
  };

  const removeRequest = async (uid: any) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      member: arrayRemove(user && user.uid),
    });
  };

  return (
    <>
      {requests.map((request: any) => (
        <Box key={request.id} style={{ width: '100%' }}>
          {request.displayAt === true && request.deleteAt === false ? (
            <Box
              maxW='sm'
              borderTop='none'
              overflow='hidden'
              margin={'0 auto 0'}
              padding={'20px 20px 10px'}
              minW={{ base: '100%' }}
              backgroundColor={'white'}
            >
              <Heading fontSize={'2xl'}>{request.title}</Heading>

              <Text padding={'10px 0'}>{request.content}</Text>

              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                marginTop={'10px'}
                padding={'5px 0 10px'}
              >
                <Flex flexWrap={'wrap'}>
                  {users.map((user: any) => (
                    <Box
                      key={user.uid}
                      padding={'5px'}
                      margin={'10px 10px 10px 0'}
                      borderRadius={'lg'}
                      backgroundColor={'gray.500'}
                      color={'white'}
                      fontSize={{ base: 'sm' }}
                      display={
                        !request.member.includes(user.uid) ? 'none' : 'block'
                      }
                    >
                      {request.member.includes(user.uid) && user.name}
                    </Box>
                  ))}
                </Flex>
                {request.member.includes(user?.uid) ? (
                  <Button
                    onClick={() => removeRequest(request.id)}
                    color='white'
                    bg='#17a6ca'
                    _hover={{ bg: '#17a6ca' }}
                    _focus={{ outline: 'none' }}
                    fontSize={{ base: 'sm' }}
                  >
                    参加を取り消す
                  </Button>
                ) : (
                  <Button
                    onClick={() => setRequest(request.id)}
                    color='white'
                    bg='orange'
                    _hover={{ bg: '##orange' }}
                    _focus={{ outline: 'none' }}
                    fontSize={{ base: 'sm' }}
                  >
                    参加する
                  </Button>
                )}
              </Flex>
              <hr />
            </Box>
          ) : (
            ''
          )}
        </Box>
      ))}
    </>
  );
};

export default Post;
