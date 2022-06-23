import { InfoOutlineIcon } from '@chakra-ui/icons';
import { AlertIcon, Box, Button, Flex } from '@chakra-ui/react';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Users } from '../../../data';
import { db } from '../../../firebase';
import { todayDate } from '../../../functions';
import { authState } from '../../../store/authState';

const AlcoholChecker = () => {
  const currentUser = useRecoilValue(authState);

  const setAlcoholCheckList = async () => {
    try {
      const docRef = doc(db, 'alcoholCheckList', `${todayDate()}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          [currentUser]: {
            uid: currentUser,
            createdAt: serverTimestamp(),
          },
        });
      } else {
        await updateDoc(docRef, {
          [currentUser]: {
            uid: currentUser,
            updatedAt: serverTimestamp(),
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Flex
      alignItems='center'
      justifyContent='center'
      mt={6}
      p={6}
      width={{ base: '100%' }}
      rounded='md'
      backgroundColor='white'
      boxShadow='xs'
    >
      <Box textAlign='center' mr={6}>
        アルコールチェック
        <br />
        問題がなければクリック!!
      </Box>
      <Box>
        <Button
          width='100px'
          colorScheme='facebook'
          onClick={() => {
            setAlcoholCheckList();
          }}
        >
          OK
        </Button>
      </Box>
    </Flex>
  );
};

export default AlcoholChecker;
