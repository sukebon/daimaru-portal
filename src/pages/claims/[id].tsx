import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { auth, db } from '../../../firebase/auth';
import { authState } from '../../../store/authState';
import {
  taskflow,
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from '../../../data';
import { todayDate } from '../../../functions';

import ClaimSelectSendButton from '../../components/claimsComp/ClaimSelectSendButton';
import ClaimReport from '../../components/claimsComp/ClaimReport';
import ClaimEdit from '../../components/claimsComp/ClaimEdit';
import ClaimConfirmSendButton from '../../components/claimsComp/ClaimConfirmSendButton';

//クレーム報告書作成

const ClaimId = () => {
  const router = useRouter();
  const queryId = router.query.id;
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const [claim, setClaim] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [selectUser, setSelectUser] = useState(''); //送信先選択
  const [selectTask, setSelectTask] = useState(); //タスクの選択
  const [edit, setEdit] = useState(true); //編集画面切替
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);

  const [customer, setCustomer] = useState(''); //顧客名
  const [occurrenceDate, setOccurrenceDate] = useState(''); //発生日
  const [occurrenceSelect, setOccurrenceSelect] = useState(''); //発生選択
  const [occurrenceContent, setOccurrenceContent] = useState(''); //発生内容
  const [amendmentSelect, setAmendmentSelect] = useState(''); //修正処置選択
  const [amendmentContent, setAmendmentContent] = useState(''); //修正処置内容
  const [counterplanSelect, setCounterplanSelect] = useState(''); //対策選択
  const [counterplanContent, setCounterplanContent] = useState(''); //対策内容
  const [completionDate, setCompletionDate] = useState(''); //完了日

  const [receptionDate, setReceptionDate] = useState<any>(`${todayDate()}`); //受付日
  const [receptionist, setReceptionist] = useState(''); //受付者
  const [receptionNum, setReceptionNum] = useState(''); //受付NO.
  const [stampStaff, setStampStaff] = useState(''); //担当者ハンコ
  const [stampOffice, setStampOffice] = useState(''); //事務局ハンコ
  const [stampBoss, setStampBoss] = useState(''); //上司ハンコ
  const [stampManager, setStampManager] = useState(''); //管理者ハンコ
  const [stampTm, setStampTm] = useState(''); //TMハンコ
  const [status, setStatus] = useState(''); //ステータス
  const [deletedAt, setDeletedAt] = useState(null); //論理削除
  const [createdAt, setCreatedAt] = useState(null); //作成日

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  //クレーム報告書をステータスを変更
  const switchClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: selectTask,
      operator: selectUser,
    });
    router.push('/claims');
  };

  //クレーム報告書を更新
  const updateClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      customer: customer,
      occurrenceDate: occurrenceDate,
      occurrenceSelect: occurrenceSelect,
      occurrenceContent: occurrenceContent,
      amendmentSelect: amendmentSelect,
      amendmentContent: amendmentContent,
      counterplanSelect: counterplanSelect,
      counterplanContent: counterplanContent,
      receptionNum: receptionNum,
      receptionDate: receptionDate,
    });
  };

  //クレーム報告書を取得
  useEffect(() => {
    const getClaim = async () => {
      const claimsDoc = doc(db, 'claimList', `${queryId}`);
      const docSnap = await getDoc(claimsDoc);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        setClaim(docSnap.data());
      } else {
        console.log('ドキュメントがありません。');
      }
    };
    getClaim();
  }, [queryId, edit]);

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

  //ISO事務局一覧を取得
  useEffect(() => {
    const usersCollectionRef = collection(db, 'authority');
    const q = query(usersCollectionRef, where('isoOffice', '==', true));
    const unsub = onSnapshot(q, (querySnapshot: any) => {
      setIsoOfficeUsers(
        querySnapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);

  const isEdit = () => {
    setCustomer(claim.customer);
    setOccurrenceDate(claim.occurrenceDate);
    setOccurrenceSelect(claim.occurrenceSelect);
    setOccurrenceContent(claim.occurrenceContent);
    setAmendmentSelect(claim.amendmentSelect);
    setAmendmentContent(claim.amendmentContent);
    setCounterplanSelect(claim.counterplanSelect);
    setCounterplanContent(claim.counterplanContent);
    setReceptionNum(claim.receptionNum);
    setReceptionDate(claim.receptionDate);
  };

  const editCancel = () => {
    setCustomer('');
    setOccurrenceDate('');
    setOccurrenceSelect('');
    setOccurrenceContent('');
    setAmendmentSelect('');
    setAmendmentContent('');
    setCounterplanSelect('');
    setCounterplanContent('');
    setReceptionNum('');
    setReceptionDate('');
  };

  return (
    <>
      {currentUser && (
        <>
          <Header />
          <Box w='100%' p={6} backgroundColor={'#f7f7f7'}>
            <Link href={'/claims'}>
              <a>
                <Button>一覧へ戻る</Button>
              </a>
            </Link>
            <Flex
              w={{ base: '100%', md: '700px' }}
              mx='auto'
              py={6}
              justifyContent='space-between'
            >
              {taskflow.map((task, index) => (
                <Flex
                  key={task.id}
                  justifyContent='center'
                  alignItems='center'
                  py={3}
                  px={1}
                  w={'100%'}
                  borderLeft='1px'
                  borderLeftRadius={index === 0 ? 6 : 0}
                  borderRightRadius={index === taskflow.length - 1 ? 6 : 0}
                  backgroundColor={
                    task.id === Number(claim.status) ? '#ffc107' : 'gray'
                  }
                  color='white'
                  fontSize='xs'
                >
                  {task.status}
                </Flex>
              ))}
            </Flex>

            <Box
              w={{ base: '100%', md: '700px' }}
              mx='auto'
              p={6}
              backgroundColor='white'
              borderRadius={6}
            >
              {/* 編集ボタン */}
              <Flex justifyContent='flex-end'>
                {edit ? (
                  <Button
                    onClick={() => {
                      isEdit();
                      setEdit(false);
                    }}
                  >
                    編集
                  </Button>
                ) : (
                  <Flex justifyContent='space-between' w='100%'>
                    <Button
                      w='95%'
                      mx={1}
                      colorScheme='telegram'
                      onClick={() => {
                        updateClaim(queryId);
                        setEdit(true);
                      }}
                    >
                      OK
                    </Button>
                    <Button
                      w='95%'
                      mx={1}
                      colorScheme='gray'
                      onClick={() => {
                        setEdit(true);
                        editCancel();
                      }}
                    >
                      キャンセル
                    </Button>
                  </Flex>
                )}
              </Flex>

              {/* クレーム報告書タイトル */}
              <Box
                as='h1'
                w='100%'
                p={3}
                fontSize='28px'
                fontWeight='semibold'
                textAlign='center'
              >
                クレーム報告書
              </Box>
              {edit ? (
                <>
                  <ClaimReport claim={claim} />

                  {/*'受付日*/}
                  {Number(claim.status) === 0 ? (
                    <>
                      <Box>
                        <Box mt={10} fontSize='lg' fontWeight='semibold'>
                          受付NO
                        </Box>
                        <Input
                          type='text'
                          w='100%'
                          p={2}
                          mt={3}
                          placeholder='受付ナンバー 例 4-001'
                          value={receptionNum}
                          onChange={(e) => setReceptionNum(e.target.value)}
                        />
                      </Box>
                      <Box>
                        <Box mt={9} fontSize='lg' fontWeight='semibold'>
                          受付日
                        </Box>
                        <Input
                          type='date'
                          w='100%'
                          p={2}
                          mt={3}
                          value={receptionDate}
                          onChange={(e) => setReceptionDate(e.target.value)}
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box>
                        <Box mt={10} fontSize='lg' fontWeight='semibold'>
                          受付NO
                        </Box>
                        <Box w='100%' p={2} mt={3}>
                          {claim.receptionNum}
                        </Box>
                      </Box>
                      <Box>
                        <Box mt={9} fontSize='lg' fontWeight='semibold'>
                          受付日
                        </Box>
                        <Box w='100%' p={2} mt={3}>
                          {claim.receptionDate}
                        </Box>
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <>
                  <ClaimEdit
                    currentUser={currentUser}
                    claim={claim}
                    isoOfficeUsers={isoOfficeUsers}
                    customer={customer}
                    setCustomer={setCustomer}
                    occurrenceDate={occurrenceDate}
                    setOccurrenceDate={setOccurrenceDate}
                    occurrenceSelect={occurrenceSelect}
                    setOccurrenceSelect={setOccurrenceSelect}
                    occurrenceContent={occurrenceContent}
                    setOccurrenceContent={setOccurrenceContent}
                    amendmentSelect={amendmentSelect}
                    setAmendmentSelect={setAmendmentSelect}
                    amendmentContent={amendmentContent}
                    setAmendmentContent={setAmendmentContent}
                    counterplanSelect={counterplanSelect}
                    setCounterplanSelect={setCounterplanSelect}
                    counterplanContent={counterplanContent}
                    setCounterplanContent={setCounterplanContent}
                    receptionNum={receptionNum}
                    setReceptionNum={setReceptionNum}
                    receptionDate={receptionDate}
                    setReceptionDate={setReceptionDate}
                  />
                </>
              )}

              {/* OK キャンセルボタン */}
              {!edit && (
                <Flex justifyContent='space-between' w='100%' mt={6}>
                  <Button
                    w='95%'
                    mx={1}
                    colorScheme='telegram'
                    onClick={() => {
                      updateClaim(queryId);
                      setEdit(true);
                    }}
                  >
                    OK
                  </Button>
                  <Button
                    w='95%'
                    mx={1}
                    colorScheme='gray'
                    onClick={() => {
                      setEdit(true);
                      editCancel();
                    }}
                  >
                    キャンセル
                  </Button>
                </Flex>
              )}

              {/*受付ボタン OR クレームセレクトボタン*/}
              <ClaimConfirmSendButton
                claim={claim}
                currentUser={currentUser}
                receptionDate={receptionDate}
                receptionNum={receptionNum}
              />
              {/* {Number(claim.status) === 0 && (
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
              )} */}
              {Number(claim.status) !== 0 && (
                <ClaimSelectSendButton
                  claim={claim}
                  selectUser={selectUser}
                  setSelectUser={setSelectUser}
                  users={users}
                  selectTask={selectTask}
                  setSelectTask={setSelectTask}
                  taskflow={taskflow}
                  switchClaim={switchClaim}
                  queryId={queryId}
                />
              )}
            </Box>
          </Box>
          <Footer />
        </>
      )}
    </>
  );
};

export default ClaimId;
