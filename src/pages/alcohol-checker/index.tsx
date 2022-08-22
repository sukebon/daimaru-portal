import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';

const Alcohol = () => {
  const [items, setItems] = useState<any>([]);
  useEffect(() => {
    const collectionRef = collection(db, 'alcoholCheckList');
    getDocs(collectionRef).then((querySnapshot) => {
      setItems(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);
  console.log(items);
  return (
    <Box
      p={6}
      backgroundColor={'#f7f7f7'}
      paddingBottom={'50px'}
      minH={'100vh'}
    >
      <Flex flexDirection={'column'} alignItems={'center'}>
        <TableContainer backgroundColor='white' borderRadius={6} p={6}>
          <Flex mb={6} justifyContent='space-between'>
            <Box fontSize='lg'>全10件</Box>
          </Flex>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th minW='80px'>日付</Th>
                <Th minW='95px'>ステータス</Th>
                <Th minW='105px'>受付日</Th>
                <Th minW='80px'>受付NO.</Th>
              </Tr>
            </Thead>
            <Tbody></Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Box>
  );
};

export default Alcohol;
