import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Information from "../components/Information";
import QuickLink from "../components/QuickLink";
import Slogan from "../components/Slogan";
import CatalogArea from "../components/CatalogArea";
import Post from "../components/Post";
import styles from "../styles/Home.module.css";
import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { auth } from "../firebase/auth";
import { db } from "../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState.js";

const Home: NextPage<any> = ({ sloganData, newsData, linkData }) => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();
  const [requests, setRequests] = useState<any>([]);

  useEffect(() => {
    const usersCollectionRef = collection(db, "requestList");
    const q = query(usersCollectionRef, orderBy("sendAt", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [router, user]);

  //ログアウト
  const logout = (event: any) => {
    event.preventDefault();
    auth.signOut();
  };

  return (
    <>
      {currentUser && (
        <div style={{ backgroundColor: "#f7f7f7" }}>
          <div className={styles.container}>
            <Head>
              <title>大丸白衣ポータル</title>
              <meta name="description" content="大丸白衣ポータル" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
              <Box w={{ base: "100%", md: "850px" }} mx="auto" py="6">
                <Flex justifyContent={"spaceBetween "} alignItems={"center"}>
                  <Spacer flex={{ base: "0", md: "1" }}></Spacer>
                  <Text
                    flex={{ base: "2", md: "1" }}
                    fontSize={{ base: "large", md: "2xl" }}
                    fontWeight={800}
                  >
                    社内用ポータルサイト
                  </Text>
                  <Flex flex="1" justifyContent={"end"}>
                    {currentUser !== "fIwZyubjTfgr0lbRb9VjIkOjKTB2" && (
                      <Link href="./management">
                        <a>
                          <Button marginRight={"10px"}>依頼する</Button>
                        </a>
                      </Link>
                    )}
                    <Button onClick={logout}>ログアウト</Button>
                  </Flex>
                </Flex>

                <Slogan slogan={sloganData.slogan} />
                <Information news={newsData.contents} />
                <QuickLink link={linkData.contents} />
                <CatalogArea />

                {currentUser !== "fIwZyubjTfgr0lbRb9VjIkOjKTB2" && (
                  <Post requests={requests} />
                )}
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
  const accessPoint = "https://portal-site.microcms.io/api/v1";
  const options = {
    headers: {
      "X-MICROCMS-API-KEY": "5c23d3e8eaa0448388ca527e0e00c829611f",
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
