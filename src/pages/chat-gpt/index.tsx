import React, { FormEvent, useState } from 'react';
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

const ChatGpt = () => {
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const { getChatgpt } = useChat();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const responseText = await getChatgpt(message);
    if (!responseText) return;
    setAnswer((prev) => prev + responseText + '\n');
    setMessage('');
    setIsLoading(false);
  };

  return (
    <Container maxW="900px" p={6} rounded="md" bg="white" boxShadow="xs">
      <Flex mb={3} justify="space-between" alignItems='center'>
        <Text as='h1' fontWeight='bold' fontSize='3xl'>Chat GPT</Text>
        <Link href='/' passHref>
          <Button variant="outline">トップへ戻る</Button>
        </Link>
      </Flex>
      <form onSubmit={handleSubmit}>
        <Flex gap={3}>
          <Input value={message} onChange={handleMessageChange} placeholder='質問を入力してください' />
          <Button colorScheme='blue' type='submit'>送信</Button>
        </Flex>
      </form>
      {answer && (
        <Box mt={6} overflow='auto' maxH="calc(100vh - 300px)">
          <Box mt={3}>回答：</Box>
          <Box fontSize='md' whiteSpace="pre-wrap">{answer.split(/\n/).filter((text => text !== '')).map((text, idx) => (
            <Text p={3} key={idx}>
              {text}<br />
            </Text>
          ))}
          </Box>
        </Box>
      )}
    </Container >
  );
};

export default ChatGpt;