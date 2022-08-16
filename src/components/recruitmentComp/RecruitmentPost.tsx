/* eslint-disable react/display-name */
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { db, auth } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Users, Administrator } from '../../../data.js';
import { starLevel, dayOfWeek, dateTime } from '../../../functions.js';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../store';
import RecruitmentButton from './RecruitmentButton';
import RecruitmentMemberList from './RecruitmentMemberList';
import RecruitmentMenu from './RecruitmentMenu';

interface Props {
  requests: {
    id: string;
    title: string;
    startDay: string;
    startTime: string;
    endEnd: string;
    endTime: string;
    applicant: string;
    person: string;
    moreless: string;
    member: string;
    level: string;
    content: string;
    display: boolean;
    deleteAt: boolean;
    editAt: boolean;
    sendAt: string;
    recruitment: boolean;
  }[];
}

const RecruitmentPost: NextPage<Props> = ({ requests }) => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const [editButton, setEditButton] = useState(true);
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
  const [cancelTitle, setCancelTitle] = useState('');
  const [cancelStartDay, setCancelStartDay] = useState('');
  const [cancelStartTime, setCancelStartTime] = useState('');
  const [cancelEndDay, setCancelEndDay] = useState('');
  const [cancelEndTime, setCancelEndTime] = useState('');
  const [cancelApplicant, setCancelApplicant] = useState('1');
  const [cancelPerson, setCancelPerson] = useState('');
  const [cancelMoreless, setCancelMoreless] = useState('');
  const [cancelLevel, setCancelLevel] = useState('');
  const [cancelContent, setCancelContent] = useState('');

  //リクエストを編集する
  const isEdit = async (uid: any) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
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
      editAt: true,
    });
    setEditButton(false);
  };

  //タイトルとコンテンツの値を保持する
  const oldTitleContent = (request: any) => {
    setTitle(request.title);
    setStartDay(request.startDay);
    setStartTime(request.startTime);
    setEndDay(request.endDay);
    setEndTime(request.endTime);
    setApplicant(request.applicant);
    setPerson(request.person);
    setMoreless(request.moreless);
    setLevel(request.level);
    setContent(request.content);
  };

  //「キャンセル用」タイトルとコンテンツの値を保持する
  const cancelTitleContent = (request: any) => {
    setCancelTitle(request.title);
    setCancelStartDay(request.startDay);
    setCancelStartTime(request.startTime);
    setCancelEndDay(request.endDay);
    setCancelEndTime(request.endTime);
    setCancelApplicant(request.applicant);
    setCancelPerson(request.person);
    setCancelMoreless(request.moreless);
    setCancelLevel(request.level);
    setCancelContent(request.content);
  };

  //編集を確定する
  const confirm = async (request: any) => {
    const docRef = doc(db, 'requestList', request.id);
    await updateDoc(docRef, {
      title: title,
      startDay: startDay || '未定',
      startTime: startTime,
      endDay: endDay || '未定',
      endTime: endTime,
      applicant: applicant,
      person,
      moreless,
      level: level,
      content: content,
      editAt: false,
    });
    setEditButton(true);
  };

  //編集をキャンセルする
  const cancel = async (request: any) => {
    const docRef = doc(db, 'requestList', request.id);
    await updateDoc(docRef, {
      title: cancelTitle,
      startDay: cancelStartDay || '未定',
      startTime: cancelStartTime,
      endDay: cancelEndDay || '未定',
      endTime: cancelEndTime,
      applicant: cancelApplicant,
      person: cancelPerson,
      moreless: cancelMoreless,
      level: cancelLevel,
      content: cancelContent,
      editAt: false,
    });
    setCancelTitle('');
    setCancelStartDay('');
    setCancelStartTime('');
    setCancelEndDay('');
    setCancelEndTime('');
    setCancelApplicant('');
    setCancelPerson('');
    setCancelMoreless('');
    setCancelLevel('');
    setCancelContent('');
    setEditButton(true);
  };

  // 作成者を表示;
  const authorDispay = (authorId: string) => {
    const usersfilter = Users.filter((user) => {
      return user.uid === authorId;
    });
    return usersfilter[0].name;
  };

  return (
    <>
      {requests.map((request: any) => (
        <Box
          key={request.id}
          style={{ width: '100%' }}
          display={request.deleteAt ? 'none' : 'block'}
        >
          {!request.deleteAt && (
            <Box
              maxW='sm'
              borderTop='none'
              overflow='hidden'
              margin={'0 auto 0'}
              padding={'20px 20px 0'}
              minW={{ base: '100%' }}
              backgroundColor={request.display === false ? '#999' : 'white'}
            >
              <Flex justifyContent={'space-between'}>
                <Flex
                  flexDirection={'column'}
                  marginRight={'10px'}
                  width={'100%'}
                >
                  {/* 編集画面を表示 */}
                  {!request.editAt ? (
                    <>
                      <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Text fontSize={'2xl'}>{starLevel(request.level)}</Text>
                        {/* メニューボタン */}
                        {editButton && (
                          <>
                            {currentUser === request.author ||
                            Administrator.includes(currentUser) ? (
                              <RecruitmentMenu
                                request={request}
                                isEdit={isEdit}
                                oldTitleContent={oldTitleContent}
                                cancelTitleContent={cancelTitleContent}
                              />
                            ) : (
                              ''
                            )}
                          </>
                        )}
                      </Flex>
                      <Heading fontSize={'xl'} paddingBottom={'10px'} mt={'2'}>
                        {request.title}
                      </Heading>
                      <Flex
                        flexDirection={{ base: 'column', md: 'row' }}
                        fontSize={'sm'}
                      >
                        <Text marginRight={'10px'}>
                          【開始】{request.startDay}
                          {request.startTime && `-${request.startTime}`}
                          {dayOfWeek(request.startDay)}
                        </Text>
                        <Text marginRight={'10px'}>
                          【終了】{request.endDay}
                          {request.endTime && `-${request.endTime}`}
                          {dayOfWeek(request.endDay)}
                        </Text>
                        <Text marginRight={'10px'}>
                          【募集人数】{request.applicant}人{request.moreless}
                        </Text>
                      </Flex>
                      <Flex
                        flexDirection={{ base: 'column', md: 'row' }}
                        fontSize={'sm'}
                      >
                        <Text>【責任者】{request.person}</Text>
                        {Administrator.includes(currentUser) ? (
                          <Text>【作成者】{authorDispay(request.author)}</Text>
                        ) : (
                          ''
                        )}
                      </Flex>
                      <Text
                        padding={'10px 0'}
                        whiteSpace={'pre-wrap'}
                        fontSize={'sm'}
                      >
                        {request.content}
                      </Text>
                    </>
                  ) : (
                    //編集画面↓
                    <>
                      <Input
                        value={title}
                        placeholder={'タイトル'}
                        onChange={(e) => setTitle(e.target.value)}
                        width={'100%'}
                        fontSize={'md'}
                        marginBottom={'10px'}
                      />
                      <Flex>
                        <Input
                          id='startDay'
                          type='date'
                          value={startDay}
                          placeholder='開始時刻'
                          marginRight={'10px'}
                          marginBottom={'10px'}
                          onChange={(e) => setStartDay(e.target.value)}
                        />
                        <Select
                          value={startTime}
                          placeholder='---'
                          onChange={(e) => setStartTime(e.target.value)}
                        >
                          {dateTime.map((d, index) => (
                            <option key={index} value={d}>
                              {d}
                            </option>
                          ))}
                        </Select>
                      </Flex>
                      <Flex>
                        <Input
                          id='endDay'
                          type='date'
                          value={endDay}
                          placeholder='終了時刻'
                          marginRight={'10px'}
                          marginBottom={'10px'}
                          onChange={(e) => setEndDay(e.target.value)}
                        />
                        <Select
                          value={endTime}
                          placeholder='---'
                          onChange={(e) => setEndTime(e.target.value)}
                        >
                          {dateTime.map((d, index) => (
                            <option key={index} value={d}>
                              {d}
                            </option>
                          ))}
                        </Select>
                      </Flex>
                      <Flex>
                        <Input
                          id='person'
                          type='string'
                          value={person}
                          placeholder='タスク責任者'
                          marginRight={'10px'}
                          marginBottom={'10px'}
                          onChange={(e) => setPerson(e.target.value)}
                        />
                        <Select
                          value={level}
                          placeholder='---'
                          marginBottom={'10px'}
                          onChange={(e) => setLevel(e.target.value)}
                        >
                          <option value='3'>★★★</option>
                          <option value='2'>★★</option>
                          <option value='1'>★</option>
                        </Select>
                      </Flex>
                      <Flex marginBottom={'10px'}>
                        <NumberInput
                          flex={'1'}
                          value={applicant}
                          placeholder='募集人数'
                          marginRight={'10px'}
                          onChange={(e) => setApplicant(e)}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Select
                          flex={'1'}
                          value={moreless}
                          placeholder='---'
                          onChange={(e) => setMoreless(e.target.value)}
                        >
                          <option value='以上'>以上</option>
                          <option value='まで'>まで</option>
                        </Select>
                      </Flex>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fontSize={'sm'}
                        marginBottom={'10px'}
                        whiteSpace={'pre-wrap'}
                      >
                        {content}
                      </Textarea>
                      <Flex marginBottom={'10px'}>
                        <Button
                          onClick={() => confirm(request)}
                          flex={'1'}
                          marginRight={'10px'}
                          colorScheme='blue'
                        >
                          OK
                        </Button>
                        <Button
                          onClick={() => cancel(request)}
                          flex={'1'}
                          colorScheme='red'
                        >
                          キャンセル
                        </Button>
                      </Flex>
                    </>
                  )}
                </Flex>
              </Flex>

              {/* 参加メンバー羅列 */}
              {!request.editAt && (
                <Flex
                  flexDirection={{ base: 'column', md: 'row' }}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  marginTop={{ base: '10px' }}
                  padding={'5px 0 10px'}
                >
                  <Flex flexWrap={'wrap'}>
                    {/* 参加メンバー一覧 */}
                    <RecruitmentMemberList request={request} />
                  </Flex>

                  {/* 参加ボタン */}
                  <RecruitmentButton request={request} />
                </Flex>
              )}
              <hr />
            </Box>
          )}
        </Box>
      ))}
    </>
  );
};

export default RecruitmentPost;
