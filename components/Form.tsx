import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

const Form = () => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addRequest = async () => {
    try {
      const docRef = await addDoc(collection(db, 'requestList'), {
        title: title,
        content: content,
        member: [],
        deleteAt: false,
        displayAt: true,
        editAt: false,
        sendAt: serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef.id);
      setTitle('');
      setContent('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <>
      {user && (
        <Flex
          flexDirection='column'
          backgroundColor='#f7f7f7'
          alignItems='center'
          padding={'0'}
          width={'100%'}
        >
          <Box
            minW={{ base: '90%', md: '700px' }}
            marginTop={'50px'}
            marginBottom={'50px'}
          >
            <Flex
              alignItems={'center'}
              justifyContent={'space-between'}
              marginBottom={'20px'}
            >
              <Heading color='teal.400'>協力依頼</Heading>
                <Link href='./'>         
                  <a><Button>トップへ戻る</Button></a>
                </Link>
            </Flex>
            <FormControl>
              <FormLabel htmlFor='email'>タイトル</FormLabel>
              <Input
                id='title'
                type='text'
                value={title}
                placeholder='タイトルを入力してください。'
                backgroundColor={'white'}
                marginBottom={'20px'}
                onChange={(e) => setTitle(e.target.value)}
              />
              <FormLabel htmlFor='email'>内容</FormLabel>
              <Textarea
                id='content'
                value={content}
                placeholder='内容を入力してください。'
                backgroundColor={'white'}
                marginBottom={'20px'}
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>
            <Button
              borderRadius={0}
              type='submit'
              variant='solid'
              colorScheme='teal'
              width='full'
              rounded='5'
              onClick={addRequest}
              disabled={title && content ? false : true}
            >
              登録
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default Form;
