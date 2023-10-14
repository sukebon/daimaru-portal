/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEvent, useState, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import {
  Button,
  Box,
  Text,
  Container,
  Input,
  Flex
} from '@chakra-ui/react';
import { useLoadingStore } from '../../../store/useLoadingStore';
import Link from 'next/link';
import { db } from '../../../firebase';
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../../../store/useAuthStore';

type Item = {
  message: string;
  answer: string;
};

const ChatGpt = () => {
  // const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  // // const { getChatgpt } = useChat();
  // const currentUser = useAuthStore((state) => state.currentUser);
  // const [items, setItems] = useState<Item[]>([]);
  // const [message, setMessage] = useState('');
  // const [answer, setAnswer] = useState('');
  // const [conversation, setConversation] = useState<{
  //   'role': string,
  //   'content': string;
  // }[]>([]);

  // const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setMessage(e.target.value);
  // };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!message) return;
  //   const result = items.some((item => item.message === message));
  //   if (result) {
  //     alert("その質問は回答済みです");
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     // const responseText = await getChatgpt(message, conversation);
  //     // if (!responseText) return;
  //     // setAnswer(responseText);
  //     // setItems((prev) => [...prev, { message, answer: responseText }]);
  //   } catch (error) {
  //     console.log(error);
  //     alert("制限に到達した可能性があります。5分以上時間を置いてからお試しください");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const newConversation = [
  //     {
  //       'role': 'user',
  //       'content': message,
  //     },
  //     {
  //       'role': 'assistant',
  //       'content': answer,
  //     },
  //   ];

  //   if (newConversation[0].content === '' || newConversation[1].content === '') return;
  //   setConversation([...conversation, ...newConversation]);
  //   addChatGptContent(currentUser, message, answer);
  //   setMessage('');
  // }, [answer]);

  // const addChatGptContent = (currentUser: string, message: string, answer: string) => {
  //   try {
  //     const userRef = doc(db, 'authority', currentUser);
  //     addDoc(collection(db, 'chatGptContents'), {
  //       userRef,
  //       createUser: currentUser,
  //       message: message,
  //       answer: answer,
  //       createdAt: serverTimestamp()
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // return (
  //   <Container maxW="900px" p={6} rounded="md" bg="white" boxShadow="xs">
  //     <Flex mb={3} justify="space-between" alignItems='center'>
  //       <Text as='h1' fontWeight='bold' fontSize='3xl'>Chat GPT</Text>
  //       <Link href='/' passHref>
  //         <Button variant="outline">トップへ戻る</Button>
  //       </Link>
  //     </Flex>
  //     <form onSubmit={handleSubmit}>
  //       <Flex gap={3}>
  //         <Input value={message} onChange={handleMessageChange} placeholder='質問を入力してください' />
  //         <Button colorScheme='blue' type='submit'>送信</Button>
  //       </Flex>
  //     </form>

  //     {answer && (
  //       <>
  //         <Box mt={6} px={3} overflow='auto' maxH="calc(100vh - 280px)">
  //           <Box fontSize='md' whiteSpace="pre-wrap">
  //             {items.map((item, idx, array) => (
  //               <Box pb={array.length - 1 === idx ? 0 : 9} key={idx}>
  //                 <Box p={3} border="1px solid #f4f4f4" bg='gray.100' rounded='md'>
  //                   <Box as="span" mr="2">質問:</Box>{item.message}
  //                 </Box>
  //                 <Box p={3} mt={3} border="1px solid #f4f4f4" rounded='md'>
  //                   <Box mb="2">回答:</Box>
  //                   {item.answer}</Box>
  //               </Box>
  //             ))}
  //           </Box>
  //         </Box>
  //       </>
  //     )}

  //   </Container >
  // );
};

export default ChatGpt;