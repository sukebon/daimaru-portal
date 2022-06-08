import { Text, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import HeaderMenuButton from './HeaderMenuButton';
import { Users } from '../../data';
import { authState } from '../../store/authState';
import { useRecoilValue } from 'recoil';

const Header = () => {
  const currentUser = useRecoilValue(authState);
  return (
    <>
      <Flex
        width={'100%'}
        height={'60px'}
        padding={'0 10px'}
        justifyContent={'space-between'}
        alignItems={'center'}
        backgroundColor={'#38b2ac'}
      >
        <Flex alignItems={'center'} color={'white'}>
          <Link href='/'>
            <a>
              <Text
                color={'white'}
                fontSize={{ base: 'large', md: '2xl' }}
                fontWeight={'bold'}
              >
                社内用ポータルサイト
              </Text>
            </a>
          </Link>
          {/* <Text>
            ログイン：
            {Users.map((user) => user.uid === currentUser && user.name)}
          </Text> */}
        </Flex>
        <HeaderMenuButton />
      </Flex>
    </>
  );
};

export default Header;
