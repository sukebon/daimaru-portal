import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Information from '../components/Information';
import QuickLink from '../components/QuickLink';
import Slogan from '../components/Slogan';
import CatalogArea from '../components/CatalogArea';
import RecruitmentPost from '../components/RecruitmentPost';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import { Box, Button, Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/auth';
import { db } from '../../firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/authState.js';
import Footer from '../components/Footer';

const Home: NextPage<any> = ({ sloganData, newsData, linkData }) => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();
  const [requests, setRequests] = useState<any>([]);
  const [hideRequests, setHideRequests] = useState<any>([]);
  const [display, setDisplay] = useState<boolean>(true);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  //掲載中（表示）案件
  useEffect(() => {
    const usersCollectionRef = collection(db, 'requestList');
    const q = query(
      usersCollectionRef,
      where('display', '==', true),
      orderBy('sendAt', 'desc')
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, [currentUser]);

  //終了（非表示）案件
  useEffect(() => {
    const usersCollectionRef = collection(db, 'requestList');
    const q = query(
      usersCollectionRef,
      where('display', '==', false),
      orderBy('sendAt', 'desc')
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setHideRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, [currentUser]);

  const isDisplay = () => {
    setDisplay(true);
  };
  const isHide = () => {
    setDisplay(false);
  };

  return (
    <>
      {currentUser && (
        <div style={{ backgroundColor: '#f7f7f7' }}>
          <div className={styles.container}>
            <Head>
              <title>大丸白衣ポータル</title>
              <meta name='description' content='大丸白衣ポータル' />
              <link rel='icon' href='/favicon.ico' />
            </Head>
            <Header />
            <main>
              <Flex
                w={{ base: '100%' }}
                mx='auto'
                p={'6'}
                flexDirection={{ base: 'column', lg: 'row' }}
              >
                <Box w={{ base: '100%', lg: '800px' }} mx='auto' flex={'1'}>
                  <Slogan slogan={sloganData.slogan} />
                  <Information news={newsData.contents} />
                  <QuickLink link={linkData.contents} />
                  <CatalogArea />
                </Box>
                <Box
                  w={{ base: '100%', md: '800px' }}
                  mt='6'
                  mx='auto'
                  ml={{ base: '0', lg: '6' }}
                  p='6'
                  rounded='md'
                  boxShadow='xs'
                  bg='white'
                  flex={'1'}
                  borderRadius={'lg'}
                >
                  <Flex
                    flexDirection={{ base: 'column', lg: 'row' }}
                    alignItems={'center'}
                    mt='1'
                    mb='2'
                  >
                    <Text fontSize='2xl' mb='2' mr='3'>
                      お手伝い依頼一覧
                    </Text>
                    <Tabs
                      size='sm'
                      variant='soft-rounded'
                      colorScheme='gray'
                      mb='2'
                    >
                      <TabList>
                        <Tab onClick={isDisplay} _focus={{ outline: 'none' }}>
                          掲載中
                        </Tab>
                        <Tab onClick={isHide} _focus={{ outline: 'none' }}>
                          掲載終了
                        </Tab>
                      </TabList>
                    </Tabs>
                  </Flex>
                  {display ? (
                    <RecruitmentPost requests={requests} />
                  ) : (
                    <RecruitmentPost requests={hideRequests} />
                  )}
                </Box>
              </Flex>
            </main>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const accessPoint = 'https://portal-site.microcms.io/api/v1';
  const options = {
    headers: {
      'X-MICROCMS-API-KEY': '5c23d3e8eaa0448388ca527e0e00c829611f',
    },
  };
  const sloganRes = await fetch(`${accessPoint}/slogan`, options);
  const sloganData = await sloganRes.json();
  const newsRes = await fetch(`${accessPoint}/news`, options);
  const newsData = await newsRes.json();
  const linkRes = await fetch(`${accessPoint}/access-link`, options);
  const linkData = await linkRes.json();

  return {
    props: {
      sloganData,
      newsData,
      linkData,
    },
  };
}
