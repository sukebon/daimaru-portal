import { Button } from '@chakra-ui/react';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import { auth, db } from '../../../firebase';
import { authState } from '../../../store';

interface Props {
  request: {
    id: string;
    title: string;
    startDay: string;
    startTime: string;
    endEnd: string;
    endTime: string;
    applicant: string;
    person: string;
    moreless: string;
    member: string[];
    level: string;
    content: string;
    display: boolean;
    deleteAt: boolean;
    editAt: boolean;
    sendAt: string;
    recruitment: boolean;
  };
}

const RecruitmentButton: NextPage<Props> = ({ request }) => {
  const [user] = useAuthState(auth);
  const currentUser: any = useRecoilValue(authState);

  //参加する
  const addRequest = async (uid: string) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      member: arrayUnion(user && user.uid),
    });
  };

  //参加を取り消す
  const removeRequest = async (uid: string) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      member: arrayRemove(user && user.uid),
    });
  };

  return (
    <>
      {request.recruitment && (
        <>
          {request.member.includes(currentUser) ? (
            <Button
              onClick={() => removeRequest(request.id)}
              color='white'
              bg='#17a6ca'
              _hover={{ bg: '#17a6ca' }}
              _focus={{ outline: 'none' }}
              fontSize={{ base: 'sm' }}
              marginTop={{ base: '10px', md: '0' }}
            >
              参加を取り消す
            </Button>
          ) : (
            <Button
              onClick={() => addRequest(request.id)}
              color='white'
              bg='orange'
              _hover={{ bg: '##orange' }}
              _focus={{ outline: 'none' }}
              fontSize={{ base: 'sm' }}
              marginTop={{ base: '10px', md: '0' }}
            >
              参加する
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default RecruitmentButton;
