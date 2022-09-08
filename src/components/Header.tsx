import { Text, Flex, Box } from '@chakra-ui/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import HeaderMenuButton from './HeaderMenuButton';
import { authState } from '../../store';
import { useRecoilValue } from 'recoil';
import { NextPage } from 'next';
import { db } from '../../firebase';
import { useRouter } from 'next/router';

const Header: NextPage = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(authState);

  useEffect(() => {
    if (currentUser === '') {
      router.push('/login');
    }
  }, [router, currentUser]);

  return (
    <>
      {currentUser && (
        <Flex
          width={'100%'}
          height={'60px'}
          padding={'0 10px'}
          justifyContent='space-between'
          alignItems='center'
          backgroundColor='#38b2ac'
          position='sticky'
          top={0}
          zIndex={100}
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
      )}
    </>
  );
};

export default Header;
