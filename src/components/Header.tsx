import { Text, Flex, Box } from '@chakra-ui/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import HeaderMenuButton from './HeaderMenuButton';
import { authState } from '../../store/authState';
import { useRecoilValue } from 'recoil';
import { NextPage } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';

const Header: NextPage = () => {
  const currentUser = useRecoilValue(authState);
  const [users, setUsers] = useState<any>([]);
  const [claims, setClaims] = useState<any>([]); //クレーム一覧リスト
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);
  const [isoManagerUsers, setIsoManagerUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);

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
