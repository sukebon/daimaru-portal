import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Information from '../components/Information';
import QuickLink from '../components/QuickLink';
import Slogan from '../components/Slogan';
import CatalogArea from '../components/CatalogArea';
import RecruitmentPosts from '../components/recruitmentComp/RecruitmentPosts';
import styles from '../styles/Home.module.css';
import { Box, Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase';
import { db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/';
import CheckDrawer from '../components/alcohol/CheckDrawer';
import { todayDate } from '../../functions';
import Link from 'next/link';

const Home: NextPage<any> = ({ sloganData, newsData, linkData }) => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();
  const [requests, setRequests] = useState<any>([]);

  const [users, setUsers] = useState<any>([]);
  const [claims, setClaims] = useState<any>([]); //クレーム一覧リスト
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);
  const [isoManagerUsers, setIsoManagerUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);

  const [hideRequests, setHideRequests] = useState<any>([]);
  const [display, setDisplay] = useState<boolean>(true);
  const [alcoholObject, setAlcoholObject] = useState<any>({});
  const [alcoholArray, setAlcoholArray] = useState<any>([]);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  //掲載中（表示）案件
  useEffect(() => {
    const requestsCollectionRef = collection(db, 'requestList');
    const q = query(
      requestsCollectionRef,
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
    const requestCollectionRef = collection(db, 'requestList');
    const q = query(
      requestCollectionRef,
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

  //users情報
  useEffect(() => {
    const usersCollectionRef = collection(db, 'authority');
    const q = query(usersCollectionRef, orderBy('rank', 'asc'));
    getDocs(q).then((querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  //【クレーム】クレーム一覧リスト取得
  useEffect(() => {
    const claimsCollectionRef = collection(db, 'claimList');
    try {
      const unsub = onSnapshot(claimsCollectionRef, (querySnapshot) => {
        setClaims(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
      // getDocs(claimsCollectionRef).then((querySnapshot) => {
      //   setClaims(
      //     querySnapshot.docs.map((doc) => ({
      //       ...doc.data(),
      //       id: doc.id,
      //     }))
      //   );
      // });
    } catch (error) {
      console.log(error);
    }
  }, []);

  //各リストを取得
  useEffect(() => {
    //ISO 事務局のリスト(オブジェクト）
    setIsoOfficeUsers(
      users.filter((user: any) => {
        return user.isoOffice === true;
      })
    );
    //ISOマネージャーのリスト(オブジェクト）
    setIsoManagerUsers(
      users.filter((user: any) => {
        return user.isoManager === true;
      })
    );
    //ISO トップマネジメントのリスト(オブジェクト）
    setIsoTopManegmentUsers(
      users.filter((user: any) => {
        return user.isoTopManegment === true;
      })
    );
    //ISO 上司のリスト(オブジェクト）
  }, [users]);

  //【クレーム】iso（事務局・管理者・TM）のオブジェクトからuidのみ取り出して配列にする
  const searchUsers = (array: { uid: string }[]) => {
    const newUsers = array.map((user: { uid: string }) => {
      return user.uid;
    });
    return newUsers;
  };

  //【クレーム】各自クレーム処理件数
  const claimCount = () => {
    let result = 0;
    claims.forEach((claim: any) => {
      if (
        claim.operator == currentUser ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(0)) ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(2)) ||
        (searchUsers(isoOfficeUsers).includes(currentUser) &&
          claim.status === Number(4)) ||
        (searchUsers(isoManagerUsers).includes(currentUser) &&
          claim.status === Number(6)) ||
        (searchUsers(isoTopManegmentUsers).includes(currentUser) &&
          claim.status === Number(7))
      ) {
        result++;
      }
    });
    if (result === 0) return;
    return result;
  };

  //アルコールチェック
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'alcoholCheckList', `${todayDate()}`),
      (doc) => {
        setAlcoholObject(doc.data());
      }
    );
  }, [currentUser]);

  useEffect(() => {
    if (alcoholObject) {
      setAlcoholArray(Object.keys(alcoholObject).map((arr) => arr));
    }
  }, [alcoholObject]);

  const isDisplay = () => {
    setDisplay(true);
  };
  const isHide = () => {
    setDisplay(false);
  };

  return (
    <>
      <Head>
        <title>大丸白衣ポータル</title>
        <meta name='description' content='大丸白衣ポータル' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {currentUser && (
        <div style={{ backgroundColor: '#f7f7f7' }}>
          <div className={styles.container}>
            <main>
              <Flex
                w='100%'
                mx='auto'
                px={6}
                pb={6}
                flexDirection={{ base: 'column', lg: 'row' }}
              >
                {/* クレーム件数エリア */}
                <Box w={{ base: '100%', lg: '800px' }} mx='auto' flex={'1'}>
                  {claimCount() && (
                    <Box
                      width='100%'
                      boxShadow='xs'
                      mt='6'
                      p='6'
                      rounded='md'
                      bg='white'
                    >
                      <Text fontSize='md' mt='1' ml='1'>
                        クレーム報告書 未処理件数：
                        <Box as='span' color='red' fontWeight='bold'>
                          {claimCount()}
                        </Box>{' '}
                        件
                        <Box>
                          ※「Menu」にある
                          <Link href='/claims'>
                            <a>
                              <Text
                                as='span'
                                textDecoration='underline'
                                _hover={{
                                  textDecoration: 'none',
                                }}
                              >
                                クレーム報告書一覧
                              </Text>
                            </a>
                          </Link>
                          をcheckしてください。
                        </Box>
                      </Text>
                    </Box>
                  )}
                  <CheckDrawer />
                  <Slogan slogan={sloganData.slogan} />
                  <Information news={newsData.contents} />
                  <QuickLink link={linkData.contents} />
                  <CatalogArea />
                </Box>
                <Box
                  // w={{ base: '100%', md: '800px' }}
                  w='100%'
                  mt='6'
                  mx='auto'
                  ml={{ base: '0', lg: '6' }}
                  p='6'
                  rounded='md'
                  boxShadow='xs'
                  bg='white'
                  flex='1'
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
                    <RecruitmentPosts requests={requests} />
                  ) : (
                    <RecruitmentPosts requests={hideRequests} />
                  )}
                </Box>
              </Flex>
            </main>
          </div>
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
  const newsRes = await fetch(`${accessPoint}/news?limit=100`, options);
  const newsData = await newsRes.json();
  const linkRes = await fetch(`${accessPoint}/access-link?limit=100`, options);
  const linkData = await linkRes.json();

  return {
    props: {
      sloganData,
      newsData,
      linkData,
    },
  };
}
