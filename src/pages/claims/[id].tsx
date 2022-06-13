import {
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

//クレーム報告書作成

const ClaimId = () => {
  const router = useRouter();
  const query = router.query;
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
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
  const [claims, setClaims] = useState<any>([]);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  useEffect(() => {
    const claimsCollectionRef = collection(db, 'claimList');
    const unsub = onSnapshot(claimsCollectionRef, (querySnapshot) => {
      setClaims(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);

  return (
    <>
      {currentUser && (
        <>
          <Header />
          <Box w='100%' p={6} backgroundColor={'#f7f7f7'}>
            {claims.map(
              (claim: any) =>
                claim.id === query.id && (
                  <Box
                    key={claim.id}
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
                    <Box w='100%' mt={9}>
                      <Box w='100%' mt={6}>
                        <Box mr={3} fontSize='lg' fontWeight='semibold'>
                          添付書類
                        </Box>
                        <Box mt={3}>
                          ①<input type='file' accept='image/png, image/jpeg' />
                        </Box>
                        <Box mt={3}>
                          ②<input type='file' accept='image/png, image/jpeg' />
                        </Box>
                        <Box mt={3}>
                          ③<input type='file' accept='image/png, image/jpeg' />
                        </Box>
                      </Box>
                    </Box>

                    {/*送信ボタン*/}
                    <Box mt={12} textAlign='center'>
                      <Button>提出する</Button>
                    </Box>
                  </Box>
                )
            )}
          </Box>
          <Footer />
        </>
      )}
    </>
  );
};

export default ClaimId;
