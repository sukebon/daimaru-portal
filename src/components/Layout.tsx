import React, { ReactNode, useEffect, useState } from "react";
import { Header } from "./Header";

import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { useAuthStore } from "../../store/useAuthStore";
import SpinnerLoading from "./SpinnerLoading";
import { useLoadingStore } from "../../store/useLoadingStore";
import { User } from "../../types";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const isLoading = useLoadingStore((state) => state.isLoading);
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state)=> state.users);
  const [belong,setBelong] = useState<User>()

  useEffect(()=> {
    const user =  users.find((user)=> user.uid === currentUser)
    if(!user) return
    setBelong(user)
  },[currentUser,users])

  return (
    <>
      {isLoading && <SpinnerLoading />}
      {router.pathname === "/login" ? (
        <Box bg="#f7f7f7" p={6} pb={6} minH="100vh">
          {children}
        </Box>
      ) : (
        currentUser && belong?.daimaru ? (
          <>
            <Header />
            <Box bg="#f7f7f7" p={6} pb={6} minH={{ base: "calc(100vh - 60px)" }}>
              {children}
            </Box>
          </>
        ) : (
          <Header />
        )
      )}
    </>
  );
};

export default Layout;
