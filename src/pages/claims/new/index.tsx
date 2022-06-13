import { Box, Button } from '@chakra-ui/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import { auth, db } from '../../../../firebase/auth';
import { authState } from '../../../../store/authState';
import ClaimInputCustomer from '../../../components/claimsComp/ClaimInputCustomer';
import ClaimInputOccurrence from '../../../components/claimsComp/ClaimInputOccurrence';
import ClaimInputAmendment from '../../../components/claimsComp/ClaimInputAmendment';
import ClaimInputCounteClaim from '../../../components/claimsComp/ClaimInputCounterplan';

//クレーム報告書作成

const ClaimNew = () => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();
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

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  const AddClaim = async () => {
    try {
      const docRef = await addDoc(collection(db, 'claimList'), {
        customer, //顧客名
        occurrenceDate, //発生日
        occurrenceSelect, //発生選択
        occurrenceContent, //発生内容
        amendmentSelect, //修正処置選択
        amendmentContent, //修正処置内容
        counterplanSelect, //対策選択
        counterplanContent, //対策内容
        completionDate, //完了日
        receptionDate, //受付日
        receptionist, //受付者
        receptionNum, //受付NO.
        stampStaff: currentUser, //担当者ハンコ
        stampOffice, //事務局ハンコ
        stampBoss, //上司ハンコ
        stampManager, //管理者ハンコ
        stampTm, //TMハンコ
        status: '0', //ステータス
        deletedAt: null, //論理削除
        createdAt: serverTimestamp(), //作成日
      });
      console.log('Document written with ID: ', docRef.id);
      router.push('/claims');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <>
      {currentUser && (
        <>
          <Header />
          <Box w='100%' p={6} backgroundColor={'#f7f7f7'}>
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
                mt={9}
                p={3}
                fontSize='28px'
                fontWeight='semibold'
                textAlign='center'
              >
                クレーム報告書
              </Box>

              {/* 顧客名 */}
              <ClaimInputCustomer
                customer={customer}
                setCustomer={setCustomer}
                occurrenceDate={occurrenceDate}
                setOccurrenceDate={setOccurrenceDate}
              />

              {/* 発生内容 */}
              <ClaimInputOccurrence
                occurrenceSelect={occurrenceSelect}
                setOccurrenceSelect={setOccurrenceSelect}
                occurrenceContent={occurrenceContent}
                setOccurrenceContent={setOccurrenceContent}
              />

              {/* 修正処置 */}
              <ClaimInputAmendment
                amendmentSelect={amendmentSelect}
                setAmendmentSelect={setAmendmentSelect}
                amendmentContent={amendmentContent}
                setAmendmentContent={setAmendmentContent}
              />

              {/*対策 */}
              <ClaimInputCounteClaim
                counterplanSelect={counterplanSelect}
                setCounterplanSelect={setCounterplanSelect}
                counterplanContent={counterplanContent}
                setCounterplanContent={setCounterplanContent}
              />

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
                <Button onClick={AddClaim}>提出する</Button>
              </Box>
            </Box>
          </Box>
        </>
      )}
      <Footer />
    </>
  );
};

export default ClaimNew;
