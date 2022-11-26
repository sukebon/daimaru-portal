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
import ProgressInpuArea from '../../../components/progress/ProgressInpuArea';

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
        <ProgressInpuArea
          progress={progress}
          pageTitle={'編集'}
          items={items}
          setItems={setItems}
        />
        <Flex mt={12} gap={3}>
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
      </Container>
    </Box>
  );
};

export default ProgressId;
