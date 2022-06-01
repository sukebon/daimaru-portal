import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Information from "../components/Information";
import QuickLink from "../components/QuickLink";
import Slogan from "../components/Slogan";
import CatalogArea from "../components/CatalogArea";
import RecruitmentPost from "../components/RecruitmentPost";
import styles from "../styles/Home.module.css";
import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { auth } from "../firebase/auth";
import { db } from "../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState.js";
import Header from "../components/Header";

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
            <Header />
            <main>
              <Flex
                w={{ base: "100%" }}
                mx="auto"
                p="6"
                flexDirection={{ base: "column", lg: "row" }}
              >
                <Box
                  w={{ base: "100%", lg: "800px" }}
                  mx="auto"
                  p="6"
                  flex={"1"}
                >
                  <Slogan slogan={sloganData.slogan} />
                  <Information news={newsData.contents} />
                  <QuickLink link={linkData.contents} />
                  <CatalogArea />
                </Box>
                <Box
                  w={{ base: "100%", md: "800px" }}
                  mx="auto"
                  p="6"
                  flex={"1"}
                >
                  <RecruitmentPost
                    requests={requests}
                    currentUser={currentUser}
                  />
                </Box>
              </Flex>
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

