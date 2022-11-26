import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Box, Button, Container } from '@chakra-ui/react';
import ProgressInpuArea from '../../../components/progress/ProgressInpuArea';

const ProgressNew = () => {
  const router = useRouter();
  const [items, setItems] = useState({
    title: '',
    startDate: '',
    endDate: '',
    contents: [{ title: '', result: false }],
  });

  const addProgress = async () => {
    const result = window.confirm('登録して宜しいでしょうか');
    if (!result) return;
    const docsRef = collection(db, 'progresses');
    try {
      const unsub = await addDoc(docsRef, {
        title: items.title,
        startDate: items.startDate,
        endDate: items.endDate,
        contents: items?.contents || [],
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      router.push('/progress');
    }
  };

  return (
    <Box w='100%' bg='#f7f7f7' paddingBottom='50px' minH='100vh' p={6}>
      <Container bg='white' p={6}>
        <ProgressInpuArea
          progress={{}}
          pageTitle={'新規登録'}
          items={items}
          setItems={setItems}
        />
        <Box mt={12}>
          <Button w='100%' colorScheme='blue' onClick={addProgress}>
            登録
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProgressNew;
