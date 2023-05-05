/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { auth, db } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { useDataList } from "@/hooks/useDataList";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useClaimStore } from "../../store/useClaimStore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setUsers = useAuthStore((state) => state.setUsers);
  const setFullUsers = useAuthStore((state) => state.setFullUsers);
  const setClaims = useClaimStore((state) => state.setClaims);
  const { getUsers, getFullUsers, getClaims } = useDataList();
  const queryClient = new QueryClient();

  useEffect(() => {
    console.log("session");
    const getSession = async () => {
      if (auth.currentUser) {
        setSession(auth.currentUser);
        setCurrentUser(auth.currentUser?.uid);
      }
      onAuthStateChanged(auth, (session) => {
        if (session) {
          setSession(session);
          setCurrentUser(session?.uid);
          if (router.pathname === "/login") {
            router.push("/");
          }
        } else {
          setSession(null);
          setCurrentUser(undefined);
          router.push("/login");
        }
      });
    };
    getSession();
  }, [session]);

  // 未登録であればauthorityに登録
  useEffect(() => {
    console.log("authority");
    if (currentUser) {
      const docRef = doc(db, "authority", `${currentUser}`);
      const addAuthority = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return;
        await setDoc(docRef, {
          uid: currentUser,
          name: session?.email,
          rank: 1000,
        });
      };
      addAuthority();
    }
  }, [session]);

  // useEffect(() => {
  //   console.log("authority");
  //   if (currentUser) {
  //     const docRef = doc(db, "authority", `${currentUser}`);
  //     const updateAuthority = async () => {
  //       await updateDoc(docRef, {
  //         email: session?.email,
  //       });
  //     };
  //     updateAuthority();
  //   }
  // }, [session]);

  useEffect(() => {
    getUsers();
  }, [session, setUsers]);

  useEffect(() => {
    getFullUsers();
  }, [session, setFullUsers]);

  useEffect(() => {
    getClaims();
  }, [session, setClaims]);

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
