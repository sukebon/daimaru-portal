import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase/auth';
import Header from '../../components/Header';
import { Users } from '../../../data';
import {
  taskflow,
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from '../../../data';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../store/authState';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

const Claim: NextPage = () => {
  const currentUser = useRecoilValue(authState);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [claims, setClaims] = useState<any>([]); //クレーム一覧リスト

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  useEffect(() => {
    const claimsCollectionRef = collection(db, 'claimList');
    const q = query(
      claimsCollectionRef,
      // where('deletedAt', '==', null),
      orderBy('receptionNum', 'desc')
    );
    const unsub: any = onSnapshot(q, (querySnapshot) => {
      setClaims(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      return unsub;
    });
  }, []);
  return (
    <>
      {currentUser && (
        <>
          <Header />
          <Box
            width={'100%'}
            p={6}
            backgroundColor={'#f7f7f7'}
            paddingBottom={'50px'}
            minH={'100vh'}
          >
            <Flex
              flexDirection={'column'}
              alignItems={'center'}
              width={{ md: '1300px' }}
              p={6}
              mx='auto'
              backgroundColor='white'
              borderRadius={6}
            >
              <TableContainer>
                <Table size='sm'>
                  <Thead>
                    <Tr>
                      <Th>ステータス</Th>
                      <Th>受付日</Th>
                      <Th>受付NO.</Th>
                      <Th>担当</Th>
                      <Th>顧客名</Th>
                      <Th>発生日</Th>
                      <Th>発生内容</Th>
                      <Th>修正処置</Th>
                      <Th>対策</Th>
                      <Th>完了日</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {claims.map((claim: any) => (
                      <Tr key={claim.id}>
                        <Td>
                          {taskflow.map(
                            (task) => task.id == claim.status && task.status
                          )}
                        </Td>
                        <Td>{claim.receptionDate}</Td>
                        <Td>{claim.receptionNum}</Td>
                        <Td>
                          {Users.map(
                            (user) => user.uid == claim.stampStaff && user.name
                          )}
                        </Td>
                        <Td>{claim.customer}</Td>
                        <Td>{claim.occurrenceDate}</Td>
                        <Td>
                          {claimSelectList1.map(
                            (c) =>
                              c.id == claim.occurrenceSelect &&
                              `${c.headline} ${c.title}`
                          )}
                        </Td>
                        <Td>
                          {claimSelectList2.map(
                            (c) => c.id == claim.amendmentSelect && c.title
                          )}
                        </Td>
                        <Td>
                          {claimSelectList3.map(
                            (c) => c.id == claim.counterplanSelect && c.title
                          )}
                        </Td>
                        <Td>{claim.completionDate}</Td>
                        <Td>
                          <Link href={`/claims/${claim.id}`}>
                            <a>
                              <Button>詳細</Button>
                            </a>
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          </Box>
        </>
      )}
    </>
  );
};

export default Claim;
