import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { auth, db } from '../../firebase';
import { authState } from '../../store/authState';
import { Administrator, Users } from '../../data';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { NextPage } from 'next';

const HeaderMenuButton: NextPage = () => {
  const currentUser = useRecoilValue(authState);
  const [users, setUsers] = useState<any>([]);
  //users情報
  useEffect(() => {
    const usersCollectionRef = collection(db, 'authority');
    const q = query(usersCollectionRef, orderBy('rank', 'asc'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, [currentUser]);

  const logout = (event: any) => {
    event.preventDefault();
    auth.signOut();
  };

  return (
    <Menu>
      <MenuButton as={Button} colore='#241749'>
        Menu
      </MenuButton>
      <MenuList>
        <Box mx='4'>
          <Box fontSize='xs'>ユーザー名</Box>
          {users.map(
            (user: { uid: string; name: string; email: string }) =>
              currentUser === user.uid && (
                <>
                  <Box>{user.name}</Box>
                </>
              )
          )}
        </Box>
        <MenuDivider />
        <Link href='/'>
          <a>
            <MenuItem>トップページ</MenuItem>
          </a>
        </Link>
        <MenuDivider />
        <Link href='/recruitment'>
          <a>
            <MenuItem>お手伝い依頼作成</MenuItem>
          </a>
        </Link>
        <MenuDivider />
        <Link href='/claims/new'>
          <a>
            <MenuItem>クレーム報告書作成</MenuItem>
          </a>
        </Link>
        <Link href='/claims/'>
          <a>
            <MenuItem>クレーム報告書一覧</MenuItem>
          </a>
        </Link>
        {(currentUser === 'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3' ||
          currentUser === 'Glkhk9WERWcEQWwdlfjD5a2jT6m1') && (
          <>
            <Link href='/admin/'>
              <a>
                <MenuItem>管理者ページ</MenuItem>
              </a>
            </Link>
          </>
        )}
        <MenuDivider />
        <MenuItem onClick={logout}>ログアウト</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HeaderMenuButton;
