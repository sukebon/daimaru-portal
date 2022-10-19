import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Information from "../components/Information";
import QuickLink from "../components/QuickLink";
import Slogan from "../components/Slogan";
import CatalogArea from "../components/CatalogArea";
import RecruitmentPosts from "../components/recruitmentComp/RecruitmentPosts";
import styles from "../styles/Home.module.css";
import { Box, Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  authState,
  claimsState,
  hideRequestsState,
  requestsState,
  usersState,
} from "../../store/";
import CheckDrawer from "../components/alcohol/CheckDrawer";
import { datetime, todayDate } from "../../functions";
import Link from "next/link";
import ClaimArea from "../components/ClaimArea";

const Home: NextPage<any> = ({ sloganData, newsData, linkData }) => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();
  // const [requests, setRequests] = useState<any>([]);
  const [users, setUsers] = useRecoilState<any>(usersState); //ユーザー一覧リスト
  const [claims, setClaims] = useRecoilState<any>(claimsState); //クレーム一覧リスト
  const [requests, setRequests] = useRecoilState<any>(requestsState); //リクエスト一覧リスト
  const [hideRequests, setHideRequests] =
    useRecoilState<any>(hideRequestsState); //リクエスト一覧リスト

  const [display, setDisplay] = useState<boolean>(true);
  const [alcoholObject, setAlcoholObject] = useState<any>({});
  const [alcoholArray, setAlcoholArray] = useState<any>([]);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [router, user]);

  //掲載中（表示）案件
  useEffect(() => {
    const requestsCollectionRef = collection(db, "requestList");
    const q = query(
      requestsCollectionRef,
      where("display", "==", true),
      orderBy("sendAt", "desc")
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
  }, [setRequests]);

  //終了（非表示）案件
  useEffect(() => {
    const requestCollectionRef = collection(db, "requestList");
    const q = query(
      requestCollectionRef,
      where("display", "==", false),
      orderBy("sendAt", "desc")
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
  }, [setHideRequests]);

  //users情報
  useEffect(() => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    getDocs(q).then((querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, [setUsers]);

  // 未登録であればauthorityに登録
  useEffect(() => {
    const docRef = doc(db, "authority", `${currentUser}`);
    const addAuthority = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return;
      await setDoc(docRef, {
        uid: currentUser,
        name: user?.email,
        rank: 1000,
      });
    };
    addAuthority();
  }, [currentUser, user]);

  //【クレーム】クレーム一覧リスト取得
  useEffect(() => {
    const claimsCollectionRef = collection(db, "claimList");
    const q = query(claimsCollectionRef, orderBy("receptionNum", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setClaims(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, [setClaims]);

  //アルコールチェックLIST取得
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "alcoholCheckList", `${todayDate()}`),
      (doc) => {
        setAlcoholObject(doc.data());
      }
    );
  }, [currentUser]);

  // アルコールKEYを取得して配列を作成
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
        <meta name="description" content="大丸白衣ポータル" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {currentUser && (
        <div style={{ backgroundColor: "#f7f7f7" }}>
          <div className={styles.container}>
            <main>
              <Flex
                w="100%"
                mx="auto"
                px={6}
                pb={6}
                flexDirection={{ base: "column", lg: "row" }}
              >
                {/* クレーム件数エリア */}

                <Box w={{ base: "100%", lg: "800px" }} mx="auto" flex={"1"}>
                  <CheckDrawer />
                  <ClaimArea />
                  <Slogan slogan={sloganData.slogan} />
                  <Information news={newsData.contents} />
                  <QuickLink link={linkData.contents} />
                  <CatalogArea />
                </Box>
                <Box
                  // w={{ base: '100%', md: '800px' }}
                  w="100%"
                  mt="6"
                  mx="auto"
                  ml={{ base: "0", lg: "6" }}
                  p="6"
                  rounded="md"
                  boxShadow="xs"
                  bg="white"
                  flex="1"
                  borderRadius={"lg"}
                >
                  <Flex
                    flexDirection={{ base: "column", lg: "row" }}
                    alignItems={"center"}
                    mt="1"
                    mb="2"
                  >
                    <Text fontSize="2xl" mb="2" mr="3">
                      お手伝い依頼一覧
                    </Text>
                    <Tabs
                      size="sm"
                      variant="soft-rounded"
                      colorScheme="gray"
                      mb="2"
                    >
                      <TabList>
                        <Tab onClick={isDisplay} _focus={{ outline: "none" }}>
                          掲載中
                        </Tab>
                        <Tab onClick={isHide} _focus={{ outline: "none" }}>
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
  const accessPoint = "https://portal-site.microcms.io/api/v1";
  const options = {
    headers: {
      "X-MICROCMS-API-KEY": "5c23d3e8eaa0448388ca527e0e00c829611f",
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
