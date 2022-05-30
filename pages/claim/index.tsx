import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import Header from '../../components/Header';
import { auth } from '../../firebase/auth';
import { authState } from '../../store/authState';

const Calim = () => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);
  return (
    <>
      {currentUser && (
        <>
          <Header />
          <Box w={{ base: '100%', md: '850px' }} mx='auto' p='6'>
            <Box as='h1'>クレーム報告書</Box>
            <Box as='h2'>発生内容</Box>
            <CheckboxGroup colorScheme='green' defaultValue={['1', '2']}>
              <Box>①製品起因</Box>
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='1'>製品不良</Checkbox>
                <Checkbox value='2'>納品書</Checkbox>
                <Checkbox value='3'>商品間違い</Checkbox>
                <Checkbox value='0'>その他</Checkbox>
              </Stack>
            </CheckboxGroup>
            <CheckboxGroup colorScheme='green'>
              <Box>②受発注</Box>
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='1'>住所等</Checkbox>
                <Checkbox value='2'>未納品</Checkbox>
                <Checkbox value='0'>その他</Checkbox>
              </Stack>
            </CheckboxGroup>
            <CheckboxGroup colorScheme='green'>
              <Box>③その他</Box>
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='0'>その他</Checkbox>
              </Stack>
            </CheckboxGroup>
            <Box as='h2'>修正処置</Box>
            <CheckboxGroup colorScheme='green' defaultValue={['1']}>
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='1'>商品再手配</Checkbox>
                <Checkbox value='2'>顧客の説明・交渉</Checkbox>
                <Checkbox value='3'>伝票再発行</Checkbox>
                <Checkbox value='0'>その他</Checkbox>
              </Stack>
            </CheckboxGroup>
            <Box as='h2'>対策</Box>
            <CheckboxGroup colorScheme='green' defaultValue={['1']}>
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='1'>修正処置のみ</Checkbox>
                <Checkbox value='2'>書面提出</Checkbox>
                <Checkbox value='3'>改善の機会</Checkbox>
                <Checkbox value='0'>是正処置</Checkbox>
              </Stack>
            </CheckboxGroup>
          </Box>
        </>
      )}
    </>
  );
};

export default Calim;
