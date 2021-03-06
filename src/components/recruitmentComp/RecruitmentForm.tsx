import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { dateTime } from '../../../functions';
// import { dateTime } from '../../../date';

const Form = () => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [startDay, setStartDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDay, setEndDay] = useState('');
  const [endTime, setEndTime] = useState('');
  const [applicant, setApplicant] = useState('1');
  const [person, setPerson] = useState('');
  const [moreless, setMoreless] = useState('');
  const [level, setLevel] = useState('');
  const [content, setContent] = useState('');

  const addRequest = async () => {
    try {
      const docRef = await addDoc(collection(db, 'requestList'), {
        title: title,
        startDay: startDay,
        startTime: startTime,
        endDay: endDay,
        endTime: endTime,
        applicant: applicant,
        person: person,
        moreless: moreless,
        level: level,
        content: content,
        member: [],
        deleteAt: false,
        display: true,
        editAt: false,
        sendAt: serverTimestamp(),
        author: user?.uid,
        recruitment: true,
      });
      console.log('Document written with ID: ', docRef.id);
      setTitle('');
      setStartDay('');
      setStartTime('');
      setEndDay('');
      setEndTime('');
      setApplicant('');
      setPerson('');
      setMoreless('');
      setLevel('');
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
          alignItems='center'
          padding={'0'}
          width={'100%'}
        >
          <Box minW='100%' marginTop={'50px'} marginBottom={'50px'}>
            <Flex
              alignItems={'center'}
              justifyContent={'space-between'}
              marginBottom={'20px'}
            >
              <Heading color='teal.400'>??????????????????</Heading>
              <Link href='./'>
                <a>
                  <Button>??????????????????</Button>
                </a>
              </Link>
            </Flex>
            <FormControl>
              <FormLabel htmlFor='title'>????????????</FormLabel>
              <Input
                id='title'
                type='text'
                value={title}
                placeholder='??????????????????????????????????????????'
                backgroundColor={'white'}
                marginBottom={'20px'}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Flex flexDirection={{ base: 'column', md: 'row' }}>
                <Flex flex={'1'}>
                  <Box flex={'1'} marginRight={'5px'}>
                    <FormLabel htmlFor='startDay'>????????????</FormLabel>
                    <Input
                      id='startDay'
                      type='date'
                      value={startDay}
                      placeholder='????????????'
                      backgroundColor={'white'}
                      marginBottom={'20px'}
                      onChange={(e) => setStartDay(e.target.value)}
                    />
                  </Box>
                  <Box flex={'1'} marginRight={{ base: '0', md: '5px' }}>
                    <FormLabel htmlFor='startTime'>???</FormLabel>
                    <Select
                      value={startTime}
                      placeholder='---'
                      backgroundColor={'white'}
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      {dateTime.map((d, index) => (
                        <option key={index} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
                <Flex flex={'1'}>
                  <Box flex={'1'} marginRight={'5px'}>
                    <FormLabel htmlFor='endDay'>????????????</FormLabel>
                    <Input
                      id='endDay'
                      type='date'
                      value={endDay}
                      placeholder='????????????'
                      backgroundColor={'white'}
                      marginBottom={'20px'}
                      onChange={(e) => setEndDay(e.target.value)}
                    />
                  </Box>
                  <Box flex={'1'} marginRight={{ base: '0', md: '5px' }}>
                    <FormLabel htmlFor='endTime'>???</FormLabel>
                    <Select
                      value={endTime}
                      placeholder='---'
                      backgroundColor={'white'}
                      onChange={(e) => setEndTime(e.target.value)}
                    >
                      {dateTime.map((d, index) => (
                        <option key={index} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
              </Flex>
              <Flex flexDirection={{ base: 'column', md: 'row' }}>
                <Flex flex={'1'}>
                  <Box flex={'1'} marginRight={'5px'}>
                    <FormLabel htmlFor='person'>??????????????????</FormLabel>
                    <Input
                      id='person'
                      type='string'
                      value={person}
                      placeholder='??????????????????'
                      backgroundColor={'white'}
                      marginBottom={'20px'}
                      onChange={(e) => setPerson(e.target.value)}
                    />
                  </Box>
                  <Box flex={'1'} marginRight={{ base: '0', md: '5px' }}>
                    <FormLabel htmlFor='level'>?????????</FormLabel>
                    <Select
                      value={level}
                      placeholder='---'
                      backgroundColor={'white'}
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      <option value='3'>?????????</option>
                      <option value='2'>??????</option>
                      <option value='1'>???</option>
                    </Select>
                  </Box>
                </Flex>
                <Flex flex={'1'}>
                  <Box
                    flex={'1'}
                    marginRight={'5px'}
                    marginBottom={{ base: '20px', md: '0' }}
                  >
                    <FormLabel htmlFor='applicant'>????????????</FormLabel>
                    <NumberInput
                      value={applicant}
                      placeholder='????????????'
                      backgroundColor={'white'}
                      onChange={(e) => setApplicant(e)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>
                  <Box flex={'1'} marginRight={{ base: '0', md: '5px' }}>
                    <FormLabel htmlFor='moreless'>???</FormLabel>
                    <Select
                      value={moreless}
                      placeholder='---'
                      backgroundColor={'white'}
                      onChange={(e) => setMoreless(e.target.value)}
                    >
                      <option value='??????'>??????</option>
                      <option value='??????'>??????</option>
                    </Select>
                  </Box>
                </Flex>
              </Flex>
              <FormLabel htmlFor='content'>??????</FormLabel>
              <Textarea
                id='content'
                value={content}
                placeholder='????????????????????????????????????'
                backgroundColor={'white'}
                marginBottom={'20px'}
                height={'200px'}
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
              disabled={title && content && person ? false : true}
            >
              ??????
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default Form;
