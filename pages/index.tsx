import type { NextPage } from 'next';
import Head from 'next/head';
import Information from '../components/Information';
import QuickLink from '../components/QuickLink';
import Slogan from '../components/Slogan';
import CatalogArea from '../components/CatalogArea';
import styles from '../styles/Home.module.css';
import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { auth } from '../firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

const Home: NextPage<any> = ({ sloganData, newsData, linkData }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  const logout = (event: any) => {
    event.preventDefault();
    auth.signOut();
  };

  return (
    <>
      {user && (
        <div style={{ backgroundColor: '#f7f7f7' }}>
          <div className={styles.container}>
            <Head>
              <title>大丸白衣ポータル</title>
              <meta name='description' content='大丸白衣ポータル' />
              <link rel='icon' href='/favicon.ico' />
            </Head>
            <main>
              <Box w={{ base: '100%', md: '800px' }} mx='auto' py='6'>
                <Flex justifyContent={'spaceBetween '} alignItems={'center'}>
                  <Spacer flex='1'></Spacer>
                  <Text flex='1' fontSize={'2xl'} fontWeight={800}>
                    社内用ポータルサイト
                  </Text>
                  <Flex flex='1' justifyContent={'end'}>
                    <Button onClick={logout}>ログアウト</Button>
                  </Flex>
                </Flex>
                <Slogan slogan={sloganData.slogan} />
                <Information news={newsData.contents} />
                <QuickLink link={linkData.contents} />
                <CatalogArea />
              </Box>
            </main>
          </div>
          <footer className={styles.footer}>&copy; daimaru-hakui</footer>
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
