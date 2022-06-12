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
          {claims.map(
            (claim: any) =>
              claim.id === query.id && (
                <Box
                  key={claim.id}
                  w={{ base: '100%', md: '700px' }}
                  mx='auto'
                  my={6}
                  p={6}
                >
                  <Box
                    as='h1'
                    w='100%'
                    mt={9}
                    p={3}
                    fontSize='28px'
                    fontWeight='semibold'
                    textAlign='center'
                  >
                    クレーム報告書
                  </Box>

                  <Box>
                    <Box mt={10} fontSize='lg' fontWeight='semibold'>
                      顧客名
                    </Box>
                    <Box w='100%' p={2} mt={3}>
                      <Box>{claim.id === query.id && claim.customer}</Box>
                    </Box>
                    {/* <Input
                type='text'
                w='100%'
                p={2}
                mt={3}
                placeholder='顧客名を入力'
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              /> */}
                  </Box>
                  <Box>
                    <Box mt={9} fontSize='lg' fontWeight='semibold'>
                      発生日
                    </Box>
                    <Box w='100%' p={2} mt={3}>
                      <Box>{claim.id === query.id && claim.occurrenceDate}</Box>
                    </Box>
                    {/* <Input
                type='date'
                w='100%'
                p={2}
                mt={3}
                value={occurrenceDate}
                onChange={(e) => setOccurrenceDate(e.target.value)}
              /> */}
                  </Box>

                  {/* 1段目　発生内容 */}
                  <Box mt={10}>
                    <Box as='h2' fontSize='lg' fontWeight='semibold'>
                      発生内容
                    </Box>

                    <Box w='100%' mt={6}>
                      {claimSelectList1.map((c) => (
                        <Box key={c.id}>
                          {c.id === claim.occurrenceSelect &&
                            `${c.Headline}  ${c.title}`}
                        </Box>
                      ))}

                      {/* <RadioGroup
                  colorScheme='green'
                  value={occurrenceSelect}
                  onChange={(e) => setOccurrenceSelect(e)}
                >
                  <Box mt={3}>①製品起因</Box>
                  <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
                    <Radio value='1'>製品不良</Radio>
                    <Radio value='2'>納品書</Radio>
                    <Radio value='3'>商品間違い</Radio>
                    <Radio value='4'>その他</Radio>
                  </Stack>
                  <Box mt={3}>②受発注</Box>
                  <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
                    <Radio value='5'>住所等</Radio>
                    <Radio value='6'>未納品</Radio>
                    <Radio value='7'>その他</Radio>
                  </Stack>
                  <Box mt={3}>③その他</Box>
                  <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
                    <Radio value='8'>その他</Radio>
                  </Stack>
                </RadioGroup> */}
                    </Box>
                    <Box>{claim.occurrenceContent}</Box>
                    {/* <Textarea
                      mt={3}
                      p={2}
                      w='100%'
                      placeholder='内容を入力'
                      value={occurrenceContent}
                      onChange={(e) => setOccurrenceContent(e.target.value)}
                    /> */}
                  </Box>

                  {/* 2段目　修正処置 */}
                  <Box mt={10}>
                    <Flex as='h2' fontSize='lg' fontWeight='semibold'>
                      修正処置
                    </Flex>
                    <Box w='100%' mt={3}>
                      <RadioGroup
                        colorScheme='green'
                        defaultValue='1'
                        value={amendmentSelect}
                        onChange={(e) => setAmendmentSelect(e)}
                      >
                        <Stack
                          spacing={[1, 5]}
                          direction={['column', 'row']}
                          p={2}
                        >
                          <Radio value='1'>商品再手配</Radio>
                          <Radio value='2'>顧客の説明・交渉</Radio>
                          <Radio value='3'>伝票再発行</Radio>
                          <Radio value='4'>その他</Radio>
                        </Stack>
                      </RadioGroup>
                      <Textarea
                        mt={3}
                        p={2}
                        w='100%'
                        placeholder='内容を入力'
                        value={amendmentContent}
                        onChange={(e) => setAmendmentContent(e.target.value)}
                      />
                    </Box>
                  </Box>

                  {/* 3段目　対策 */}
                  <Box mt={9}>
                    <Flex as='h2' fontSize='lg' fontWeight='semibold'>
                      対策
                    </Flex>
                    <Box w='100%' mt={3}>
                      <RadioGroup
                        colorScheme='green'
                        defaultValue='1'
                        value={counterplanSelect}
                        onChange={(e) => setCounterplanSelect(e)}
                      >
                        <Stack
                          spacing={[1, 5]}
                          direction={['column', 'row']}
                          p={2}
                        >
                          <Radio value='1'>修正処置のみ</Radio>
                          <Radio value='2'>書面提出</Radio>
                          <Radio value='3'>改善の機会</Radio>
                          <Radio value='4'>是正処置</Radio>
                        </Stack>
                      </RadioGroup>
                      <Textarea
                        mt={3}
                        p={2}
                        w='100%'
                        placeholder='内容を入力'
                        value={counterplanContent}
                        onChange={(e) => setCounterplanContent(e.target.value)}
                      />
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
        </>
      )}
      <Footer />
    </>
  );
};

export default ClaimId;
