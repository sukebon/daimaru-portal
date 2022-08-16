import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import RecruitmentForm from '../../components/recruitmentComp/RecruitmentForm';
import RecruitmentPost from '../../components/recruitmentComp/RecruitmentPost';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../store';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { Administrator } from '../../../data';

const Recruitment = () => {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any>([]);
  const [currentRequests, setCurrentRequests] = useState<any>([]);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  //管理者用投稿リストを取得
  useEffect(() => {
    const usersCollectionRef = collection(db, 'requestList');
    const q = query(usersCollectionRef, orderBy('sendAt', 'desc'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);

  //作成者用投稿リストを取得
  useEffect(() => {
    const usersCollectionRef = collection(db, 'requestList');
    const q = query(
      usersCollectionRef,
      where('author', '==', currentUser)
      // orderBy('sendAt', 'desc')
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setCurrentRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, [currentUser]);

  return (
    <>
      {currentUser && (
        <>
          <Box
            width={'100%'}
            backgroundColor={'#f7f7f7'}
            paddingBottom={'50px'}
            minH={'100vh'}
            p={6}
          >
            <Flex
              flexDirection={'column'}
              alignItems={'center'}
              margin={'0 auto'}
            >
              <Box
                w={{ base: '100%', md: '800px' }}
                mx='auto'
                p={6}
                backgroundColor='white'
                borderRadius={6}
              >
                <RecruitmentForm />
              </Box>
              <Box
                w={{ base: '100%', md: '800px' }}
                mt='6'
                mx='auto'
                backgroundColor='white'
                borderRadius={6}
              >
                {Administrator.includes(currentUser) ? (
                  <RecruitmentPost requests={requests} />
                ) : (
                  <RecruitmentPost requests={currentRequests} />
                )}
              </Box>
            </Flex>
          </Box>
        </>
      )}
    </>
  );
};

export default Recruitment;
