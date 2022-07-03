/* eslint-disable @next/next/no-img-element */
//クレーム報告書　個別ページ
import React, { useEffect, useState } from 'react';
import { Box, Flex, Input } from '@chakra-ui/react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { auth, db } from '../../../firebase';
import { authState } from '../../../store/authState';
import { taskflow } from '../../../data';
import { todayDate } from '../../../functions';

import ClaimSelectSendButton from '../../components/claims/button/ClaimSelectSendButton';
import ClaimReport from '../../components/claims/ClaimReport';
import ClaimConfirmSendButton from '../../components/claims/button/ClaimConfirmSendButton';
import ClaimEditButton from '../../components/claims/button/ClaimEditButton';
import ClaimProgress from '../../components/claims/ClaimProgress';
import ClaimMessage from '../../components/claims/ClaimMessage';
import ClaimEditReport from '../../components/claims/ClaimEditReport';

//クレーム報告書作成

const ClaimId = () => {
  const router = useRouter();
  const queryId = router.query.id;
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const [claim, setClaim] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [selectUser, setSelectUser] = useState(''); //送信先選択
  const [selectTask, setSelectTask] = useState<any>(); //タスクの選択
  const [edit, setEdit] = useState(false); //編集画面切替
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);
  const [isoManagerUsers, setIsoManagereUsers] = useState<any>([]);
  const [isoBossUsers, setIsoBossUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);

  const [customer, setCustomer] = useState(''); //顧客名
  const [occurrenceDate, setOccurrenceDate] = useState(''); //発生日
  const [occurrenceSelect, setOccurrenceSelect] = useState(''); //発生選択
  const [occurrenceContent, setOccurrenceContent] = useState(''); //発生内容
  const [amendmentSelect, setAmendmentSelect] = useState(''); //修正処置選択
  const [amendmentContent, setAmendmentContent] = useState(''); //修正処置内容
  const [counterplanSelect, setCounterplanSelect] = useState(''); //対策選択
  const [counterplanContent, setCounterplanContent] = useState(''); //対策内容
  const [completionDate, setCompletionDate] = useState(''); //完了日

  const [receptionDate, setReceptionDate] = useState(''); //受付日
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

  const [fileUpload, setFileUpload] = useState<any>({});
  const [imageUrl, setImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');

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
      message: '',
    });
    router.push('/claims');
  };

  //クレーム報告書を更新
  const updateClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      customer,
      receptionNum,
      receptionDate,
      occurrenceDate,
      occurrenceSelect,
      occurrenceContent,
      amendmentSelect,
      amendmentContent,
      counterplanSelect,
      counterplanContent,
      completionDate,
    });
  };

  //クレーム報告書の発生内容を更新
  const updateOccurrenceClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      occurrenceSelect,
      occurrenceContent,
    });
  };

  //クレーム報告書の修正処置を更新
  const updateAmendmentClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      amendmentSelect,
      amendmentContent,
    });
  };

  //クレーム報告書を担当者入力欄の更新
  const updateStaffClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      occurrenceSelect,
      occurrenceContent,
      amendmentSelect,
      amendmentContent,
    });
  };

  //クレーム報告書を対策者・上司入力欄の更新
  const updateCounterplanClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      counterplanSelect,
      counterplanContent,
      completionDate,
    });
  };

  // クレーム報告書を取得;
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'claimList', `${queryId}`), (doc) => {
      console.log('Current data: ', doc.data());
      setClaim(doc.data());
    });
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

  //各リストを取得
  useEffect(() => {
    //ISOマネージャーのリスト
    setIsoManagereUsers(
      users.filter((user: any) => {
        return user.isoManager === true;
      })
    );
    //ISO 上司のリスト
    setIsoBossUsers(
      users.filter((user: any) => {
        return user.isoBoss === true;
      })
    );
    //ISO トップマネジメントのリスト
    setIsoTopManegmentUsers(
      users.filter((user: any) => {
        return user.isoTopManegment === true;
      })
    );
    //ISO 事務局のリスト
    setIsoOfficeUsers(
      users.filter((user: any) => {
        return user.isoOffice === true;
      })
    );
  }, [users]);

  //事務局のみ編集可
  const enabledOffice = () => {
    const office = isoOfficeUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (office.includes(currentUser)) return true;
    return false;
  };

  //記入者と事務局のみ編集可
  const enabledAuthorAndOffice = () => {
    const office = isoOfficeUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (claim.author === currentUser || office.includes(currentUser))
      return true;
    return false;
  };

  //担当者と事務局のみ編集可
  const enabledStaffAndOffice = () => {
    const office = isoOfficeUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (claim.stampStaff === currentUser || office.includes(currentUser))
      return true;
    return false;
  };

  //対策記入者と事務局のみ編集可
  const enabledCounterplanAndOffice = () => {
    const office = isoOfficeUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (
      (claim.operator === currentUser && Number(claim.status) === 3) ||
      office.includes(currentUser)
    )
      return true;
    return false;
  };

  //上司と事務局のみ編集可
  const enabledBossAndOffice = () => {
    const office = isoOfficeUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    const boss = isoBossUsers.map((user: { uid: string }) => {
      return user.uid;
    });

    if (
      ((claim.operator === currentUser || boss.includes(currentUser)) &&
        Number(claim.status) === 5) ||
      office.includes(currentUser)
    )
      return true;
    return false;
  };

  //管理者のみ編集可
  const enabledManager = () => {
    const manager = isoManagerUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (
      (claim.operator === currentUser || manager.includes(currentUser)) &&
      Number(claim.status) === 6
    )
      return true;
    return false;
  };

  //Top Managementのみ編集可
  const enabledTopManegment = () => {
    const tm = isoTopManegmentUsers.map((user: { uid: string }) => {
      return user.uid;
    });
    if (
      (claim.operator === currentUser || tm.includes(currentUser)) &&
      Number(claim.status) === 7
    )
      return true;
    return false;
  };

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
    setImageUrl(claim.imageUrl);
    setImagePath(claim.imagePath);
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
    setImageUrl('');
    setImagePath('');
  };

  return (
    <>
      {claim && currentUser && (
        <>
          <Box w='100%' p={6} backgroundColor={'#f7f7f7'} position='relative'>
            {/* クレームメッセージ */}
            <ClaimMessage
              claim={claim}
              currentUser={currentUser}
              users={users}
              enabledOffice={enabledOffice}
              enabledManager={enabledManager}
              enabledTopManegment={enabledTopManegment}
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
              updateOccurrenceClaim={updateOccurrenceClaim}
              updateAmendmentClaim={updateAmendmentClaim}
              updateStaffClaim={updateStaffClaim}
              updateCounterplanClaim={updateCounterplanClaim}
              editCancel={editCancel}
              enabledOffice={enabledOffice}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              fileUpload={fileUpload}
            />

            {/* レポート部分メイン */}
            <Box
              w={{ base: '100%', md: '750px' }}
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
                  <ClaimEditReport
                    queryId={queryId}
                    currentUser={currentUser}
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
                    enabledOffice={enabledOffice}
                    enabledAuthorAndOffice={enabledAuthorAndOffice}
                    enabledStaffAndOffice={enabledStaffAndOffice}
                    enabledCounterplanAndOffice={enabledCounterplanAndOffice}
                    enabledBossAndOffice={enabledBossAndOffice}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    fileUpload={fileUpload}
                    setFileUpload={setFileUpload}
                    imagePath={imagePath}
                    setImagePath={setImagePath}
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
                    queryId={queryId}
                    receptionDate={receptionDate}
                    receptionNum={receptionNum}
                    counterplanSelect={counterplanSelect}
                    counterplanContent={counterplanContent}
                    completionDate={completionDate}
                    stampOffice={stampOffice}
                    operator={claim.operator}
                    enabledOffice={enabledOffice}
                    enabledBossAndOffice={enabledBossAndOffice}
                    enabledManager={enabledManager}
                    enabledTopManegment={enabledTopManegment}
                  />

                  {/* 担当者セレクトボタン　未処理以外　事務局のみ */}
                  {Number(claim.status) !== 0 && enabledOffice() && (
                    <ClaimSelectSendButton
                      queryId={queryId}
                      users={users}
                      selectUser={selectUser}
                      setSelectUser={setSelectUser}
                      selectTask={selectTask}
                      setSelectTask={setSelectTask}
                      taskflow={taskflow}
                      switchStatus={switchStatus}
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
              updateOccurrenceClaim={updateOccurrenceClaim}
              updateAmendmentClaim={updateAmendmentClaim}
              updateStaffClaim={updateStaffClaim}
              updateCounterplanClaim={updateCounterplanClaim}
              editCancel={editCancel}
              enabledOffice={enabledOffice}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              fileUpload={fileUpload}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default ClaimId;
