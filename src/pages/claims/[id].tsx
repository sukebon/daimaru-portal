//クレーム報告書　個別ページ
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, Box, Button, Flex, Input } from '@chakra-ui/react';
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
import ClaimEdit from '../../components/claimsComp/ClaimEditReport';
import ClaimConfirmSendButton from '../../components/claimsComp/ClaimConfirmSendButton';
import ClaimEditButton from '../../components/claimsComp/ClaimEditButton';
import ClaimProgress from '../../components/claimsComp/ClaimProgress';
import ClaimMessage from '../../components/claimsComp/ClaimMessage';

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
  const [edit, setEdit] = useState(false); //編集画面切替
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

  //クレーム報告書のステータスを変更
  const switchStatus = async (id: any) => {
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
      completionDate: completionDate,
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

  //事務局
  const enabledOffice = () => {
    const users = isoOfficeUsers.map((user: any) => {
      return user.uid;
    });
    if (users.includes(currentUser)) return true;
    return false;
  };
  console.log(isoOfficeUsers);

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
    setCompletionDate(claim.completionDate);
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
    setCompletionDate('');
  };

  return (
    <>
      {currentUser && (
        <>
          <Header />
          <Box w='100%' p={6} backgroundColor={'#f7f7f7'} position='relative'>
            {/* クレームメッセージ */}
            <ClaimMessage
              claim={claim}
              currentUser={currentUser}
              users={users}
            />
            {/* ステータスの進捗 */}
            <ClaimProgress claim={claim} />

            {/* 編集ボタン 未処理以外「担当者」と「事務局」と「作業者」のみ*/}
            <ClaimEditButton
              claim={claim}
              currentUser={currentUser}
              queryId={queryId}
              edit={edit}
              isEdit={isEdit}
              setEdit={setEdit}
              updateClaim={updateClaim}
              editCancel={editCancel}
              enabledOffice={enabledOffice}
            />

            {/* レポート部分 */}
            <Box
              w={{ base: '100%', md: '700px' }}
              mx='auto'
              p={6}
              backgroundColor='white'
              borderRadius={6}
            >
              {/* 受付ナンバー　受付日 */}
              {Number(claim.status) > 0 && (
                <>
                  {!edit && (
                    <Flex
                      alignItems='center'
                      justifyContent='space-between'
                      w='100%'
                    >
                      <Flex mr={1} alignItems='center'>
                        <Box fontSize='lg' fontWeight='semibold' mr={1}>
                          受付NO
                        </Box>
                        <Box>{claim.receptionNum}</Box>
                      </Flex>
                      <Flex alignItems='center'>
                        <Box fontSize='lg' fontWeight='semibold' mr={1}>
                          受付日
                        </Box>
                        <Box>{claim.receptionDate}</Box>
                      </Flex>
                    </Flex>
                  )}
                </>
              )}

              {/* 通常画面 */}
              {!edit && <ClaimReport claim={claim} />}

              {/* 編集画面 */}
              {edit && (
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
                    completionDate={completionDate}
                    setCompletionDate={setCompletionDate}
                  />
                </>
              )}

              {/*'未処理 受付NO. 受付日 入力欄*/}
              {Number(claim.status) === 0 && enabledOffice() && (
                <Flex alignItems='center' w='100%' mt={10}>
                  <Flex mr={5} alignItems='center'>
                    <Box fontSize='lg' fontWeight='semibold' minW='70px'>
                      受付NO
                    </Box>
                    <Input
                      type='text'
                      placeholder='例 4-001'
                      value={receptionNum}
                      onChange={(e) => setReceptionNum(e.target.value)}
                    />
                  </Flex>
                  <Flex mr={1} alignItems='center'>
                    <Box fontSize='lg' fontWeight='semibold' minW='70px'>
                      受付日
                    </Box>
                    <Input
                      type='date'
                      value={receptionDate}
                      onChange={(e) => setReceptionDate(e.target.value)}
                    />
                  </Flex>
                </Flex>
              )}

              {!edit && (
                <>
                  {/*決定ボタン*/}
                  <ClaimConfirmSendButton
                    claim={claim}
                    currentUser={currentUser}
                    receptionDate={receptionDate}
                    receptionNum={receptionNum}
                    counterplanSelect={counterplanSelect}
                    counterplanContent={counterplanContent}
                    completionDate={completionDate}
                  />

                  {/* 担当者セレクトボタン　未処理以外　事務局のみ */}
                  {Number(claim.status) !== 0 && enabledOffice() && (
                    <ClaimSelectSendButton
                      claim={claim}
                      selectUser={selectUser}
                      setSelectUser={setSelectUser}
                      users={users}
                      selectTask={selectTask}
                      setSelectTask={setSelectTask}
                      taskflow={taskflow}
                      switchStatus={switchStatus}
                      queryId={queryId}
                    />
                  )}
                </>
              )}
            </Box>

            {/* 編集ボタン 未処理以外「担当者」と「事務局」と「作業者」のみ*/}
            <ClaimEditButton
              claim={claim}
              currentUser={currentUser}
              queryId={queryId}
              edit={edit}
              isEdit={isEdit}
              setEdit={setEdit}
              updateClaim={updateClaim}
              editCancel={editCancel}
              enabledOffice={enabledOffice}
            />
          </Box>
          <Footer />
        </>
      )}
    </>
  );
};

export default ClaimId;
