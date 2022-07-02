import React, { ReactNode, useEffect, useState } from 'react';
import Header from './Header';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useRouter } from 'next/router';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== '/login' && <Header />}
      <div>{children}</div>
    </>
  );
};

export default Layout;
