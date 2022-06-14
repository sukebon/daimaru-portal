import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase/auth';
import { auth } from '../../../firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import RecruitmentForm from '../../components/recruitmentComp/RecruitmentForm';
import RecruitmentPost from '../../components/recruitmentComp/RecruitmentPost';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../store/authState.js';
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
          <Header />
          <Box
            width={'100%'}
            backgroundColor={'#f7f7f7'}
            paddingBottom={'50px'}
            minH={'100vh'}
          >
            <Flex
              flexDirection={'column'}
              alignItems={'center'}
              width={{ md: '800px' }}
              margin={'0 auto'}
            >
              <RecruitmentForm />

              {Administrator.includes(currentUser) ? (
                <RecruitmentPost requests={requests} />
              ) : (
                <RecruitmentPost requests={currentRequests} />
              )}
            </Flex>
          </Box>
        </>
      )}
    </>
  );
};

export default Recruitment;
