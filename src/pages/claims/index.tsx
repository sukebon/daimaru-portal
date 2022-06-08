import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
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
import { db } from '../../../firebase/auth';
import Header from '../../components/Header';
import { Users } from '../../../data';
import {
  taskflow,
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from '../../../data';

const Claim: NextPage = () => {
  const [claims, setClaims] = useState<any>([]); //クレーム一覧リスト

  useEffect(() => {
    const claimsCollectionRef = collection(db, 'claimList');
    const q = query(
      claimsCollectionRef,
      // where('deletedAt', '==', null),
      orderBy('createdAt', 'desc')
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
      <Header />
      <Box
        width={'100%'}
        backgroundColor={'#f7f7f7'}
        paddingBottom={'50px'}
        minH={'100vh'}
      >
        <Flex
          flexDirection={'column'}
          alignItems={'center'}
          width={{ md: '1500px' }}
          pt={24}
          mx='auto'
        >
          <TableContainer>
            <Table size='md'>
              <Thead>
                <Tr>
                  <Th>ステータス</Th>
                  <Th>受付日</Th>
                  <Th>担当</Th>
                  <Th>顧客名</Th>
                  <Th>発生日</Th>
                  <Th>発生内容</Th>
                  <Th>修正処置</Th>
                  <Th>対策</Th>
                  <Th>完了日</Th>
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
                    <Td></Td>
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
                          `${c.Headline} ${c.title}`
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
                    <Td></Td>
                    <Td>
                      <Button>詳細</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              {/* <Tfoot>
                <Tr>
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Tfoot> */}
            </Table>
          </TableContainer>
          <div></div>
        </Flex>
      </Box>
    </>
  );
};

export default Claim;
