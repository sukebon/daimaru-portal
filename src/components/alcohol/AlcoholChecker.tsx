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
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { memo, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { db } from '../../../firebase';
import { todayDate } from '../../../functions';
import { authState } from '../../../store';

const Alcohol = () => {
  const currentUser = useRecoilValue(authState);
  const [alcoholList, setAlcoholList] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  //アルコールチェック登録
  const setAlcoholCheckList = async () => {
    try {
      const docRef = doc(db, 'alcoholCheckList', `${todayDate()}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          member: arrayUnion(currentUser),
        });
      } else {
        await setDoc(docRef, {
          id: `${todayDate()}`,
          member: arrayUnion(currentUser),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const docRef = doc(db, 'alcoholCheckList', `${todayDate()}`);
    const unsub = onSnapshot(docRef, (querySnapshot) => {
      setAlcoholList(querySnapshot.data());
    });
  }, []);

  // const setAlcoholCheckList = async () => {
  //   try {
  //     const docRef = doc(db, 'alcoholCheckList', `${todayDate()}`);
  //     const docSnap = await getDoc(docRef);
  //     if (!docSnap.exists()) {
  //       await setDoc(docRef, {
  //         [currentUser]: {
  //           uid: currentUser,
  //           updatedAt: serverTimestamp(),
  //         },
  //       });
  //     } else {
  //       await updateDoc(docRef, {
  //         [currentUser]: {
  //           uid: currentUser,
  //           updatedAt: serverTimestamp(),
  //         },
  //       });
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <>
      {alcoholList &&
      alcoholList.member &&
      alcoholList.member.includes(currentUser) ? (
        ''
      ) : (
        <>
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
              アルコールチェックをしてください
            </Box>
            <Button colorScheme='blue' onClick={onOpen}>
              Click
            </Button>
          </Flex>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>アルコールチェック</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <Box>
                <Box>アルコールの検査はしましたか？</Box>
                <RadioGroup defaultValue='2'>
                  <Stack spacing={8} direction='row' mt={1}>
                    <Radio colorScheme='red' value='1'>
                      No
                    </Radio>
                    <Radio colorScheme='green' value='2'>
                      Yes
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Box mt={3}>
                <Box>酒気帯び</Box>
                <RadioGroup defaultValue='2' mt={1}>
                  <Stack spacing={9} direction='row'>
                    <Radio colorScheme='red' value='1'>
                      有
                    </Radio>
                    <Radio colorScheme='green' value='2'>
                      無
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            </>
          </ModalBody>

          <ModalFooter>
            <Button
              width='100px'
              colorScheme='facebook'
              onClick={() => {
                setAlcoholCheckList();
                onClose();
              }}
            >
              提出
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Alcohol;
