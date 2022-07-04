import {
  Box,
  Flex,
  Input,
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
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import { todayDate } from '../../../../functions';
import PieChart from '../../../components/claims/chart/PieChart';

const GraphClaim = () => {
  const [claims, setClaims] = useState<any>([]); //クレーム一覧リスト
  const [startAtDate, setStartAtDate] = useState('2022-01-01');
  const [endAtDate, setEndAtDate] = useState(todayDate());

  //クレーム一覧を取得
  useEffect(() => {
    const claimsCollectionRef = collection(db, 'claimList');
    const q = query(
      claimsCollectionRef,
      orderBy('receptionDate'),
      startAt(startAtDate),
      endAt(endAtDate)
    );
    getDocs(q).then((querySnapshot) => {
      setClaims(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, [startAtDate, endAtDate]);

  const countClaims = (str: any, num: number) => {
    let count: string[] = [];
    claims.forEach((claim: any) => {
      if (Number(claim[str]) === num) count.push(claim[str]);
    });
    return count.length;
  };

  return (
    <Box w='100%' p={6} backgroundColor={'#f7f7f7'}>
      <Box
        w={{ base: '100%', md: '380px' }}
        mx='auto'
        p={6}
        backgroundColor='white'
        borderRadius={6}
      >
        <Flex flexDirection='column' alignItems='center'>
          <Flex w='full' justifyContent='space-between'>
            <Box>集計期間</Box>
            <Box>クレーム件数：{claims.length}</Box>
          </Flex>
          <Flex mt={3} w='full' justifyContent='space-between'>
            <Box mr={3}>
              <Box>開始日</Box>
              <Input
                type='date'
                value={startAtDate}
                onChange={(e) => setStartAtDate(e.target.value)}
              />
            </Box>
            <Box>
              <Box>終了日</Box>
              <Input
                type='date'
                value={endAtDate}
                onChange={(e) => setEndAtDate(e.target.value)}
              />
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Box
        w={{ base: '100%', md: '380px' }}
        mx='auto'
        mt='6'
        p={6}
        backgroundColor='white'
        borderRadius={6}
      >
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th fontSize='sm'>■対策</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>修正処置のみ</Td>
                <Td>{countClaims('counterplanSelect', 1)}</Td>
              </Tr>
              <Tr>
                <Td>書面提出</Td>
                <Td>{countClaims('counterplanSelect', 2)}</Td>
              </Tr>
              <Tr>
                <Td>改善の機会</Td>
                <Td>{countClaims('counterplanSelect', 3)}</Td>
              </Tr>
              <Tr>
                <Td>是正処置</Td>
                <Td>{countClaims('counterplanSelect', 4)}</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th fontSize='sm'>合計</Th>
                <Th fontSize='sm'>
                  {countClaims('counterplanSelect', 1) +
                    countClaims('counterplanSelect', 2) +
                    countClaims('counterplanSelect', 3) +
                    countClaims('counterplanSelect', 4)}
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
        <PieChart
          value1={countClaims('counterplanSelect', 1)}
          value2={countClaims('counterplanSelect', 2)}
          value3={countClaims('counterplanSelect', 3)}
          value4={countClaims('counterplanSelect', 4)}
        />
      </Box>
    </Box>
  );
};

export default GraphClaim;
