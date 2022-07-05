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
        w={{ base: '100%', md: '700px' }}
        mx='auto'
        p={6}
        backgroundColor='white'
        borderRadius={6}
      >
        <Flex flexDirection='column' alignItems='center'>
          <Flex w='full' fontSize='xl'>
            <Box mr='2'>集計期間：</Box>
            <Box>クレーム数 {claims.length} 件</Box>
          </Flex>
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            mt={3}
            w='full'
            justifyContent='space-between'
          >
            <Box mt='2' mr={3} w={{ base: '100%', md: '50%' }}>
              <Box>開始日</Box>
              <Input
                type='date'
                value={startAtDate}
                onChange={(e) => setStartAtDate(e.target.value)}
              />
            </Box>
            <Box mt='2' mr={3} w={{ base: '100%', md: '50%' }}>
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

      {/* 起因部署 */}
      <Flex
        w={{ base: '100%', md: '700px' }}
        mt='6'
        mx='auto'
        p={6}
        backgroundColor='white'
        borderRadius={6}
        justifyContent='space-between'
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th fontSize='sm'>■起因部署</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>R&D事業部</Td>
                <Td>{countClaims('causeDepartmentSelect', 1)}</Td>
              </Tr>
              <Tr>
                <Td>他社・メーカー</Td>
                <Td>{countClaims('causeDepartmentSelect', 2)}</Td>
              </Tr>
              <Tr>
                <Td>徳島工場</Td>
                <Td>{countClaims('causeDepartmentSelect', 3)}</Td>
              </Tr>
              <Tr>
                <Td>営業部</Td>
                <Td>{countClaims('causeDepartmentSelect', 4)}</Td>
              </Tr>
              <Tr>
                <Td>配送センター</Td>
                <Td>{countClaims('causeDepartmentSelect', 5)}</Td>
              </Tr>
              <Tr>
                <Td>経理部</Td>
                <Td>{countClaims('causeDepartmentSelect', 6)}</Td>
              </Tr>
              <Tr>
                <Td>顧客</Td>
                <Td>{countClaims('causeDepartmentSelect', 7)}</Td>
              </Tr>
              <Tr>
                <Td>不明</Td>
                <Td>{countClaims('causeDepartmentSelect', 8)}</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th fontSize='sm' py='2'>
                  合計
                </Th>
                <Th fontSize='sm'>
                  {countClaims('causeDepartmentSelect', 1) +
                    countClaims('causeDepartmentSelect', 2) +
                    countClaims('causeDepartmentSelect', 3) +
                    countClaims('causeDepartmentSelect', 4) +
                    countClaims('causeDepartmentSelect', 5) +
                    countClaims('causeDepartmentSelect', 6) +
                    countClaims('causeDepartmentSelect', 7) +
                    countClaims('causeDepartmentSelect', 8)}
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
        <Box mt={{ base: 6, md: '0' }}>
          <PieChart
            values={[
              countClaims('causeDepartmentSelect', 1),
              countClaims('causeDepartmentSelect', 2),
              countClaims('causeDepartmentSelect', 3),
              countClaims('causeDepartmentSelect', 4),
              countClaims('causeDepartmentSelect', 5),
              countClaims('causeDepartmentSelect', 6),
              countClaims('causeDepartmentSelect', 7),
              countClaims('causeDepartmentSelect', 8),
            ]}
            labels={[
              'R&D事業部',
              '他社・メーカー',
              '徳島工場',
              '営業部',
              '配送センター',
              '経理部',
              '顧客',
              '不明',
            ]}
          />
        </Box>
      </Flex>

      {/* 発生内容 */}
      <Flex
        w={{ base: '100%', md: '700px' }}
        mx='auto'
        mt='6'
        p={6}
        backgroundColor='white'
        borderRadius={6}
        justifyContent='space-between'
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th fontSize='sm'>■発生内容</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>製品不良</Td>
                <Td>{countClaims('occurrenceSelect', 1)}</Td>
              </Tr>
              <Tr>
                <Td>納品書</Td>
                <Td>{countClaims('occurrenceSelect', 2)}</Td>
              </Tr>
              <Tr>
                <Td>商品間違い</Td>
                <Td>{countClaims('occurrenceSelect', 3)}</Td>
              </Tr>
              <Tr>
                <Td>住所等</Td>
                <Td>{countClaims('occurrenceSelect', 5)}</Td>
              </Tr>
              <Tr>
                <Td>未納品</Td>
                <Td>{countClaims('occurrenceSelect', 6)}</Td>
              </Tr>
              <Tr>
                <Td>その他</Td>
                <Td>
                  {countClaims('occurrenceSelect', 4) +
                    countClaims('occurrenceSelect', 7) +
                    countClaims('occurrenceSelect', 8)}
                </Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th fontSize='sm' py='2'>
                  合計
                </Th>
                <Th fontSize='sm'>
                  {countClaims('occurrenceSelect', 1) +
                    countClaims('occurrenceSelect', 2) +
                    countClaims('occurrenceSelect', 3) +
                    countClaims('occurrenceSelect', 4) +
                    countClaims('occurrenceSelect', 5) +
                    countClaims('occurrenceSelect', 6) +
                    countClaims('occurrenceSelect', 7) +
                    countClaims('occurrenceSelect', 8)}
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
        <Box mt={{ base: 6, md: '0' }}>
          <PieChart
            values={[
              countClaims('occurrenceSelect', 1),
              countClaims('occurrenceSelect', 2),
              countClaims('occurrenceSelect', 3),
              countClaims('occurrenceSelect', 5),
              countClaims('occurrenceSelect', 6),

              countClaims('occurrenceSelect', 4) +
                countClaims('occurrenceSelect', 7) +
                countClaims('occurrenceSelect', 8),
            ]}
            labels={[
              '製品不良',
              '納品書',
              '商品間違い',
              '住所等',
              '未納品',
              'その他',
            ]}
          />
        </Box>
      </Flex>

      {/* 対策 */}
      <Flex
        w={{ base: '100%', md: '700px' }}
        mx='auto'
        mt='6'
        p={6}
        backgroundColor='white'
        borderRadius={6}
        justifyContent='space-between'
        flexDirection={{ base: 'column', md: 'row' }}
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
                <Th fontSize='sm' py='2'>
                  合計
                </Th>
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
        <Box mt={{ base: 6, md: '0' }}>
          <PieChart
            values={[
              countClaims('counterplanSelect', 1),
              countClaims('counterplanSelect', 2),
              countClaims('counterplanSelect', 3),
              countClaims('counterplanSelect', 4),
            ]}
            labels={['修正処置', '書面提出', '改善の機会', '是正処置']}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default GraphClaim;
