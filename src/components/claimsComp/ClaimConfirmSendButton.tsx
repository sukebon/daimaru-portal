import { Button, Flex } from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { db } from '../../../firebase/auth';
import { todayDate } from '../../../functions';

type Props = {
  claim: {
    status: string;
  };
  currentUser: string;
  receptionDate: string;
  receptionNum: string;
  completionDate: string;
  counterplanSelect: string;
  counterplanContent: string;
};

const ClaimConfirmSendButton: NextPage<Props> = ({
  claim,
  currentUser,
  receptionNum,
  receptionDate,
  completionDate,
  counterplanSelect,
  counterplanContent,
}) => {
  const router = useRouter();
  const queryId = router.query.id;

  //クレーム報告書を受付
  const acceptClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 1,
      receptionist: currentUser,
      receptionNum,
      receptionDate,
    });
    router.push(`/claims`);
  };

  //対策完了 事務局へ渡す
  const counterplanClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 3,
      operator: '',
    });
    router.push(`/claims`);
  };

  //上司確認完了 事務局へ渡す
  const completionClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 3,
      operator: '',
      stampBoss: currentUser,
    });
    router.push(`/claims`);
  };

  return (
    <>
      {/* 事務局が受け付ける */}
      {Number(claim.status) === 0 && (
        <Flex justifyContent='center'>
          <Button
            mt={12}
            onClick={() => {
              acceptClaim(queryId);
            }}
            disabled={receptionNum && receptionDate ? false : true}
          >
            受け付ける
          </Button>
        </Flex>
      )}
      {/* 対策を記入して事務局へ送信 */}
      {Number(claim.status) === 2 && (
        <Flex justifyContent='center'>
          <Button
            mt={12}
            colorScheme='facebook'
            onClick={() => {
              counterplanClaim(queryId);
            }}
            disabled={!counterplanContent}
          >
            対策内容を記入したので事務局へ送信する
          </Button>
        </Flex>
      )}
      {/* 上司が確認して完了日を記入　事務局へ送信 */}
      {Number(claim.status) === 4 && (
        <Flex justifyContent='center'>
          <Button
            mt={12}
            onClick={() => {
              completionClaim(queryId);
            }}
            disabled={!completionDate || !counterplanSelect}
          >
            対策の処置選択・完了日を記入したので事務局へ送信する
          </Button>
        </Flex>
      )}
    </>
  );
};

export default ClaimConfirmSendButton;
