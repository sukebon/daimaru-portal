import Link from 'next/link';
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
import React, { useEffect, useState } from 'react';
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
  const [isoOfficeUsers, setIsoOfficetUsers] = useState<any>([]);

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

  //クレーム報告書を更新
  const updateClaim = async (id: any) => {
    const docRef = doc(db, 'claimList', id);
    await updateDoc(docRef, {
      status: selectTask,
      operator: selectUser,
      receptionist: receptionist,
      receptionNum,
      receptionDate,
    });
    router.push('/claims');
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
  }, [queryId]);

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

  console.log(isoOfficeUsers);

  //ISO事務局一覧を取得
  useEffect(() => {
    const usersCollectionRef = collection(db, 'authority');
    const q = query(usersCollectionRef, where('isoOffice', '==', true));
    const unsub = onSnapshot(q, (querySnapshot: any) => {
      setIsoOfficetUsers(
        querySnapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);
  console.log(users);

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
                  p={2}
                  w={'100%'}
                  borderLeft='1px'
                  borderLeftRadius={index === 0 ? 6 : 0}
                  borderRightRadius={index === taskflow.length - 1 ? 6 : 0}
                  backgroundColor={
                    task.id === claim.status ? '#ffc107' : 'gray'
                  }
                  color='white'
                  fontSize='sm'
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

              {/* 顧客名 */}
              <Box>
                <Box mt={10} fontSize='lg' fontWeight='semibold'>
                  顧客名
                </Box>
                <Box w='100%' p={2} mt={3}>
                  <Box>{claim.customer}</Box>
                </Box>
              </Box>
              <Box>
                <Box mt={9} fontSize='lg' fontWeight='semibold'>
                  発生日
                </Box>
                <Box w='100%' p={2} mt={3}>
                  <Box>{claim.occurrenceDate}</Box>
                </Box>
              </Box>

              {/* 発生内容 */}
              <Box mt={10}>
                <Box as='h2' fontSize='lg' fontWeight='semibold'>
                  発生内容
                </Box>
                <Box w='100%' mt={6}>
                  {claimSelectList1.map((list) => (
                    <Box key={list.id}>
                      {list.id === claim.occurrenceSelect &&
                        `${list.headline}  ${list.title}`}
                    </Box>
                  ))}
                </Box>
                <Box>{claim.occurrenceContent}</Box>
              </Box>

              {/*修正処置 */}
              <Box mt={10}>
                <Flex as='h2' fontSize='lg' fontWeight='semibold'>
                  修正処置
                </Flex>
                <Box w='100%' mt={3}>
                  {claimSelectList2.map((list) => (
                    <Box key={list.id}>
                      {list.id === claim.amendmentSelect && list.title}
                    </Box>
                  ))}
                  <Box>{claim.amendmentContent}</Box>
                </Box>
              </Box>

              {/* 対策 */}
              <Box mt={9}>
                <Flex as='h2' fontSize='lg' fontWeight='semibold'>
                  対策
                </Flex>
                <Box w='100%' mt={3}>
                  {claimSelectList3.map((list) => (
                    <Box key={list.id}>
                      {list.id === claim.counterplanSelect && list.title}
                    </Box>
                  ))}
                  <Box>{claim.counterplanContent}</Box>
                </Box>
              </Box>

              {/* 添付書類 */}
              {/* <Box w='100%' mt={9}>
                <Box w='100%' mt={6}>
                  <Box mr={3} fontSize='lg' fontWeight='semibold'>
                    添付書類
                  </Box>
                  <Box mt={3}>
                    ①
                    <input type='file' accept='image/png, image/jpeg' />
                  </Box>
                  <Box mt={3}>
                    ②
                    <input type='file' accept='image/png, image/jpeg' />
                  </Box>
                  <Box mt={3}>
                    ③
                    <input type='file' accept='image/png, image/jpeg' />
                  </Box>
                </Box>
              </Box> */}

              {/*'受付日*/}
              {claim.status === '0' ? (
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
                      placeholder='受付ナンバー 例 R0-001'
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

              {/*送信ボタン*/}
              <ClaimSelectSendButton
                selectUser={selectUser}
                setSelectUser={setSelectUser}
                users={users}
                selectTask={selectTask}
                setSelectTask={setSelectTask}
                taskflow={taskflow}
                updateClaim={updateClaim}
                queryId={queryId}
              />
            </Box>
          </Box>
          <Footer />
        </>
      )}
    </>
  );
};

export default ClaimId;
