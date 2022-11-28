import React, { ReactNode, useEffect, useState } from "react";
import Header from "./Header";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/router";
import Footer from "./Footer";
import { Box } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/login" && <Header />}
      <Box bg="#f7f7f7" p={6} pb={6} minH="100vh">
        {children}
      </Box>
      {router.pathname !== "/claims" && <Footer />}
    </>
  );
};

export default Layout;
