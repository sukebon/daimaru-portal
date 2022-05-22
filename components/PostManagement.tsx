import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { DragHandleIcon } from '@chakra-ui/icons';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { db, auth } from '../firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { users } from '../data.js';

interface Props {
  requests: {
    id: string;
    title: string;
    content: string;
    displayAt: boolean;
    deleteAt: boolean;
    editAt: boolean;
    sendAt: string;
  }[];
}

const PostManagement: NextPage<Props> = ({ requests }) => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cancelTitle, setCancelTitle] = useState('');
  const [cancelContent, setCancelContent] = useState('');

  //リクエストを非表示
  const hideRequest = async (uid: string) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      displayAt: false,
    });
  };

  //リクエストを表示
  const displayRequest = async (uid: string) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      displayAt: true,
    });
  };

  //リクエストを編集する
  const isEdit = async (uid: any) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      title: title,
      content: content,
      editAt: true,
    });
  };

  //タイトルとコンテンツの値を保持する
  const oldTitleContent = (request: any) => {
    setTitle(request.title);
    setContent(request.content);
  };

  //「キャンセル用」タイトルとコンテンツの値を保持する
  const cancelTitleContent = (request: any) => {
    setCancelTitle(request.title);
    setCancelContent(request.content);
  };

  //編集を確定する
  const confirm = async (request: any) => {
    const docRef = doc(db, 'requestList', request.id);
    await updateDoc(docRef, {
      title: title,
      content: content,
      editAt: false,
    });
  };

  //編集をキャンセルする
  const cancel = async (request: any) => {
    const docRef = doc(db, 'requestList', request.id);
    await updateDoc(docRef, {
      title: cancelTitle,
      content: cancelContent,
      editAt: false,
    });
    setCancelTitle('');
    setCancelContent('');
  };

  //リクエストを削除
  const deleteAt = async (uid: string) => {
    const res = window.confirm('削除してよろしいでしょうか？');
    if (res) {
      const docRef = doc(db, 'requestList', uid);
      await updateDoc(docRef, {
        deleteAt: true,
      });
    }
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
              backgroundColor={request.displayAt === false ? '#999' : 'white'}
            >
              <Flex justifyContent={'space-between'}>
                <Flex
                  flexDirection={'column'}
                  marginRight={'10px'}
                  width={'100%'}
                >
                  {!request.editAt ? (
                    <>
                      <Heading fontSize={'2xl'}>{request.title}</Heading>
                      <Text padding={'10px 0'}>{request.content}</Text>
                    </>
                  ) : (
                    <>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        width={'100%'}
                        fontSize={'2xl'}
                        marginBottom={'10px'}
                      />
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fontSize={'2xl'}
                        marginBottom={'10px'}
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

                {/* メニューボタン */}
                {!request.editAt && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label='Options'
                      icon={<DragHandleIcon />}
                      variant='outline'
                    />
                    <MenuList>
                      {request.displayAt === true ? (
                        <MenuItem onClick={() => hideRequest(request.id)}>
                          非表示
                        </MenuItem>
                      ) : (
                        <MenuItem onClick={() => displayRequest(request.id)}>
                          表示
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          isEdit(request.id);
                          oldTitleContent(request);
                          cancelTitleContent(request);
                        }}
                      >
                        編集
                      </MenuItem>
                      <MenuItem onClick={() => deleteAt(request.id)}>
                        削除
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Flex>

              {/* 参加メンバー羅列 */}
              {!request.editAt && (
                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  marginTop={'10px'}
                  padding={'5px 0 10px'}
                >
                  <Flex flexWrap={'wrap'}>
                    {users.map((user: any) => (
                      <Box
                        key={user.uid}
                        padding={'5px'}
                        margin={'5px 10px 5px 0'}
                        borderRadius={'lg'}
                        backgroundColor={'gray.500'}
                        color={'white'}
                        display={
                          !request.member.includes(user.uid) ? 'none' : 'block'
                        }
                      >
                        {request.member.includes(user.uid) && user.name}
                      </Box>
                    ))}
                  </Flex>
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

export default PostManagement;
