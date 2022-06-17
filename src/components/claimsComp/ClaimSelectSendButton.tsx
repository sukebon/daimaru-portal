import { Box, Button, Flex, Select, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { claimSelectList3 } from '../../../data';

const ClaimSelectSendButton: NextPage<any> = ({
  claim,
  selectUser,
  setSelectUser,
  users,
  selectTask,
  setSelectTask,
  taskflow,
  switchClaim,
  queryId,
}) => {
  const [isoManagerUsers, setIsoManagereUsers] = useState<any>([]);
  const [isoBossUsers, setIsoBossUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);

  useEffect(() => {
    setIsoManagereUsers(
      users.filter((user: any) => {
        return user.isoManager === true;
      })
    );
    setIsoBossUsers(
      users.filter((user: any) => {
        return user.isoBoss === true;
      })
    );
    setIsoTopManegmentUsers(
      users.filter((user: any) => {
        return user.isoTopManegment === true;
      })
    );
    setIsoOfficeUsers(
      users.filter((user: any) => {
        return user.isoOffice === true;
      })
    );
  }, [users]);

  return (
    <>
      <Box mt={12}>
        <Text w='100%' mx='auto' textAlign='center'>
          タスクと送信先を選択して送信してください。
        </Text>
        <Flex justifyContent={'center'} mt={6}>
          <Select
            value={selectTask}
            onChange={(e) => setSelectTask(e.target.value)}
            placeholder='タスクを選択'
            w={48}
            mr={2}
          >
            {taskflow.map(
              (task: { id: number; status: string; index: number }) =>
                1 < task.id && (
                  <option key={task.id} value={task.id}>
                    {task.status}
                  </option>
                )
            )}
          </Select>

          <Select
            value={selectUser}
            onChange={(e) => setSelectUser(e.target.value)}
            placeholder='送信先を選択'
            w={48}
            mr={2}
          >
            {selectTask == 1 &&
              users.map((user: { uid: string; name: string }) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            {selectTask == 2 &&
              users.map((user: { uid: string; name: string }) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            {selectTask == 3 &&
              isoBossUsers.map((user: { uid: string; name: string }) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            {selectTask == 4 &&
              isoManagerUsers.map((user: { uid: string; name: string }) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            {selectTask == 5 &&
              isoTopManegmentUsers.map(
                (user: { uid: string; name: string }) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                )
              )}
          </Select>
          <Button
            onClick={() => switchClaim(queryId)}
            disabled={selectTask && selectUser ? false : true}
          >
            送信する
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default ClaimSelectSendButton;
