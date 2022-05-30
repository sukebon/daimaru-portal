import { Text, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import HeaderMenuButton from './HeaderMenuButton';

const Header = () => {
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
        <Link href='./'>
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
        <HeaderMenuButton />
      </Flex>
    </>
  );
};

export default Header;
