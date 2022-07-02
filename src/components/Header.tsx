import { Text, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React, { useState } from 'react';
import HeaderMenuButton from './HeaderMenuButton';
import { authState } from '../../store/authState';
import { useRecoilValue } from 'recoil';
import { NextPage } from 'next';

const Header: NextPage = () => {
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
        </Flex>
        <HeaderMenuButton />
      </Flex>
    </>
  );
};

export default Header;
