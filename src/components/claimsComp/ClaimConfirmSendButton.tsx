import { Button, Flex } from '@chakra-ui/react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { db, storage } from '../../../firebase';

type Props = {
  claim: {
    status: string;
    counterplanSelect: string;
    counterplanContent: string;
    completionDate: string;
    stampOffice: string;
    operator: string;
    imagePath: string;
  };
  currentUser: string;
  queryId: any;
  receptionDate: string;
  receptionNum: string;
  completionDate: string;
  counterplanSelect: string;
  counterplanContent: string;
  stampOffice: string;
  operator: string;
  enabledOffice: any;
  enabledBossAndOffice: any;
  enabledManager: any;
  enabledTopManegment: any;
};

const ClaimConfirmSendButton: NextPage<Props> = ({
  claim,
  currentUser,
  queryId,
  receptionNum,
  receptionDate,
  enabledOffice,
  enabledManager,
  enabledTopManegment,
}) => {
  const router = useRouter();

  //クレーム報告書を受付
  const acceptClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 1,
      receptionist: currentUser,
      receptionNum,
      receptionDate,
      stampOffice: currentUser,
    });
  };

  //クレーム報告書を削除
  const deleteClaim = async (id: any) => {
    const result = window.confirm('削除して宜しいでしょうか？');
    if (!result) return;

    await deleteDoc(doc(db, 'claimList', id));

    if (claim.imagePath === '') {
      router.push('/claims');
      return;
    }
    const imageRef = ref(storage, claim.imagePath);
    await deleteObject(imageRef)
      .then(() => {
        router.push(`/claims`);
        console.log('削除成功');
      })
      .catch((error) => {
        console.log(error);
      });
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

  //上司承認
  const bossApprovalClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 5,
      operator: '',
      stampBoss: currentUser,
    });
    router.push(`/claims`);
  };

  //上司却下
  const bossRejectedClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 3,
      operator: '',
      message: 'クレーム報告書が戻されました。',
    });
    router.push(`/claims`);
  };

  //管理者承認
  const managerApprovalClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 6,
      operator: '',
      stampManager: currentUser,
    });
    router.push(`/claims`);
  };

  //管理者却下
  const managerRejectedClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 3,
      operator: '',
      message: '管理者に却下されました',
    });
    router.push(`/claims`);
  };

  //TOP マネジメント承認
  const topManegmentApprovalClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 7,
      operator: '',
      stampTm: currentUser,
    });
    router.push(`/claims`);
  };

  //TOP マネジメント却下
  const topManegmentRejectedClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: 3,
      operator: '',
      message: 'トップマネジメントに却下されました',
    });
    router.push(`/claims`);
  };

  return (
    <>
      {/* 事務局が受け付ける */}
      {Number(claim.status) === 0 && enabledOffice() && (
        <Flex justifyContent='center'>
          <Button
            mt={12}
            mr={3}
            colorScheme='blue'
            onClick={() => {
              acceptClaim(queryId);
            }}
            disabled={receptionNum && receptionDate ? false : true}
          >
            受け付ける
          </Button>
          <Button
            mt={12}
            colorScheme='red'
            onClick={() => deleteClaim(queryId)}
          >
            削除する
          </Button>
        </Flex>
      )}

      {/* 対策を記入して事務局へ送信 */}
      {Number(claim.status) === 2 && claim.operator === currentUser && (
        <Flex justifyContent='center'>
          <Button
            mt={12}
            colorScheme='facebook'
            onClick={() => {
              counterplanClaim(queryId);
            }}
            disabled={!claim.counterplanContent}
          >
            事務局へ提出する
          </Button>
        </Flex>
      )}

      {/* 上司が完了日と対策selectを記入　承認して管理職へ提出　却下して事務局へ提出 */}
      {Number(claim.status) === 4 && claim.operator === currentUser && (
        <Flex justifyContent='center'>
          <Button
            mt={12}
            mr={3}
            colorScheme='blue'
            onClick={() => {
              bossApprovalClaim(queryId);
            }}
            disabled={!claim.completionDate || !claim.counterplanSelect}
          >
            承認する
          </Button>
          <Button
            mt={12}
            colorScheme='red'
            onClick={() => {
              bossRejectedClaim(queryId);
            }}
          >
            却下する
          </Button>
        </Flex>
      )}

      {/* 管理職が確認　承認してTMへ提出　却下して事務局へ提出 */}
      {Number(claim.status) === 5 && enabledManager() && (
        <Flex justifyContent='center'>
          <Button
            mt={12}
            mr={3}
            colorScheme='blue'
            onClick={() => {
              managerApprovalClaim(queryId);
            }}
          >
            承認する
          </Button>
          <Button
            mt={12}
            colorScheme='red'
            onClick={() => {
              managerRejectedClaim(queryId);
            }}
          >
            却下する
          </Button>
        </Flex>
      )}

      {/* TMが確認　承認して完了　却下して事務局へ提出 */}
      {Number(claim.status) === 6 && enabledTopManegment() && (
        <Flex justifyContent='center'>
          <Button
            mt={12}
            mr={3}
            colorScheme='blue'
            onClick={() => {
              topManegmentApprovalClaim(queryId);
            }}
          >
            承認する
          </Button>
          <Button
            mt={12}
            colorScheme='red'
            onClick={() => {
              topManegmentRejectedClaim(queryId);
            }}
          >
            却下する
          </Button>
        </Flex>
      )}
    </>
  );
};

export default ClaimConfirmSendButton;
