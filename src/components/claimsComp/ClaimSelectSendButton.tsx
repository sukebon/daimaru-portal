import { Box, Button, Flex, Select, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

const ClaimSelectSendButton: NextPage<any> = ({
  selectUser,
  setSelectUser,
  users,
  updateClaim,
  queryId,
}) => {
  return (
    <Box mt={12}>
      <Text w='100%' mx='auto' textAlign='center'>
        上記、必要な項目を記入してから宛先を指定して送信してください。
      </Text>
      <Flex justifyContent={'center'} mt={6}>
        <Select
          value={selectUser}
          onChange={(e) => setSelectUser(e.target.value)}
          placeholder='送信先を選択'
          w={48}
          mr={2}
        >
          {users.map((user: { uid: string; name: string }) => (
            <option key={user.uid} value={user.uid}>
              {user.name}
            </option>
          ))}
        </Select>
        <Button onClick={() => updateClaim(queryId)}>送信する</Button>
      </Flex>
    </Box>
  );
};

export default ClaimSelectSendButton;
