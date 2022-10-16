import { Box, Container, Flex } from '@chakra-ui/react';
import {
  collection,
  endAt,
  onSnapshot,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { db } from '../../../firebase';
import { usersState } from '../../../store';

const Sales = () => {
  const [users, setUsers] = useRecoilState<any>(usersState); //ユーザー一覧リスト
  const [sales, setSeles] = useState<any>();
  const [sum, setSum] = useState<number>();
  const [recentAtDate, setRecentAtDate] = useState('2022-10-1');
  const [sinceAtDate, setSinceAtDate] = useState('2022-10-31');

  useEffect(() => {
    const salesCollectionRef = collection(db, 'sales');
    const q = query(
      salesCollectionRef,
      orderBy('datetime'),
      startAt(recentAtDate),
      endAt(sinceAtDate)
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setSeles(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, [recentAtDate, sinceAtDate]);

  const dispName = (uid: string) => {
    const userName = users.find((user: any) => {
      if (user.uid === uid) return true;
    });
    return userName?.name;
  };

  useEffect(() => {
    let sum = 0;
    sales?.forEach((sale: any) => {
      sum += Number(sale.currentSales);
    });
    setSum(sum);
  }, [sales]);

  return (
    <Container>
      <Box my={6}>
        {sales?.map((sale: any) => (
          <Flex key={sale.id}>
            <Box mr={6}>{dispName(sale.currentUser)}</Box>
            <Box>{sale.currentSales}</Box>
          </Flex>
        ))}
        <Flex mt={6}>
          <Box>合計</Box>
          <Box>{sum}</Box>
        </Flex>
      </Box>
    </Container>
  );
};

export default Sales;
