import { Box, Button, Container, Flex, Input, Text } from '@chakra-ui/react';
import { addDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { db } from '../../../firebase';
import { authState } from '../../../store';

const SalesNew = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(authState);
  const [salesObj, setSalesObj] = useState({
    currentSales: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSalesObj({ ...salesObj, [name]: value });
  };

  const addSales = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const result = year + '-' + month;

    const docRef = doc(db, 'sales', `${result}_${currentUser}`);
    await setDoc(docRef, {
      currentSales: salesObj.currentSales,
      currentUser,
      createdAt: serverTimestamp(),
      datetime: year + '-' + month + '-' + day,
    });
  };
  return (
    <Container>
      <Box my={6}>
        <Text>売上</Text>
        <Flex>
          <Input
            mr={2}
            name='currentSales'
            value={salesObj.currentSales}
            onChange={handleInputChange}
          />
          <Button onClick={addSales}>登録</Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default SalesNew;
