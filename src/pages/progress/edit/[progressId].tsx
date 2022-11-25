import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Switch,
  Text,
} from '@chakra-ui/react';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';

const ProgressId = () => {
  const router = useRouter();
  const progressId = router.query.progressId;
  const [progress, setProgress] = useState<any>();
  const [items, setItems] = useState({
    title: '',
    startDate: '',
    endDate: '',
    contents: [{}],
  });

  useEffect(() => {
    const getProgress = async () => {
      const docRef = doc(db, 'progresses', `${progressId}`);
      const docSnap = await getDoc(docRef);
      setProgress({ ...docSnap.data(), id: docSnap.id });
    };
    getProgress();
  }, [progressId]);

  useEffect(() => {
    setItems({ ...progress });
  }, [progress]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleInputsChange = (e: any, rowIndex: number) => {
    const value = e.target.value;
    const name = e.target.name;
    setItems(() => {
      let newArray: any = [];
      newArray = items.contents.map((content: any, index) =>
        index === rowIndex ? { ...content, [name]: value } : content
      );
      return { ...items, contents: [...newArray] };
    });
  };

  const handleSwitchChange = (bool: boolean, rowIndex: number) => {
    const value = bool ? false : true;
    setItems(() => {
      let newArray: any = [];
      newArray = items.contents.map((content: any, index) =>
        index === rowIndex ? { ...content, result: value } : content
      );
      return { ...items, contents: [...newArray] };
    });
  };

  const addTitle = () => {
    setItems(() => {
      return {
        ...items,
        contents: [...(items?.contents || ''), { title: '', result: false }],
      };
    });
  };

  const updateProgress = async () => {
    const docRef = doc(db, 'progresses', `${progressId}`);
    try {
      await updateDoc(docRef, {
        title: items.title,
        startDate: items.startDate,
        endDate: items.endDate,
        contents: items?.contents || [],
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      router.push('/progress');
    }
  };

  const reset = () => {
    setItems({ ...progress });
    router.push('/progress');
  };

  return (
    <Box w='100%' bg='#f7f7f7' paddingBottom='50px' minH='100vh' p={6}>
      <Container bg='white' p={6}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Box>編集</Box>
        </Flex>
        <Box mt={12}>
          <Text>タイトル</Text>
          <Input
            type='text'
            name='title'
            value={items.title}
            onChange={handleInputChange}
          />
          <Flex mt={6} gap={6}>
            <Box w='100%'>
              <Text>開始日</Text>
              <Input
                type='date'
                name='startDate'
                value={items.startDate}
                onChange={handleInputChange}
              />
            </Box>
            <Box w='100%'>
              <Text>終了日</Text>
              <Input
                type='date'
                name='endDate'
                value={items.endDate}
                onChange={handleInputChange}
              />
            </Box>
          </Flex>
          <Text mt={3}>項目</Text>
          {items?.contents?.map((content: any, index) => (
            <Flex key={index} mt={1} gap={6} w='100%' alignItems='center'>
              <Input
                w='100%'
                type='text'
                name='title'
                value={content.title}
                onChange={(e) => handleInputsChange(e, index)}
              />

              <Switch
                id={content.title}
                value={content.result}
                isChecked={content.result}
                onChange={() => handleSwitchChange(content.result, index)}
              />
            </Flex>
          ))}
          <Button mt={6} onClick={addTitle}>
            追加
          </Button>
          <Flex mt={6} gap={3}>
            <Button
              w='100%'
              onClick={() => {
                reset();
              }}
            >
              キャンセル
            </Button>
            <Button w='100%' colorScheme='blue' onClick={updateProgress}>
              更新
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default ProgressId;
