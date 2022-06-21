import { Box, Button, Flex } from '@chakra-ui/react';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { db } from '../../../firebase/auth';
import { authState } from '../../../store/authState';

const AlcoholChecker = () => {
  const currentUser = useRecoilValue(authState);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const d = year + '-' + month + '-' + day;
    const setPopup = async () => {
      try {
        const docRef = doc(db, 'alcoholList', `${d}`);
        await setDoc(docRef, {
          member: arrayUnion(currentUser),
        });
      } catch (e) {
        console.error(e);
      }
    };
    setPopup();
  }, []);
  const AddPopup = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const d = year + '-' + month + '-' + day;
    try {
      const docRef = doc(db, 'alcoholList', `${d}`);
      await updateDoc(docRef, {
        member: arrayUnion(currentUser),
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Flex
      position='absolute'
      top='0'
      left='0'
      w='100%'
      h='100vh'
      bgColor='gray'
      justifyContent='center'
      alignItems='center'
    >
      <Button onClick={AddPopup}>AlcoholChecker</Button>
    </Flex>
  );
};

export default AlcoholChecker;
