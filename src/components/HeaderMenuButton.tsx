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
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { NextPage } from 'next';

const HeaderMenuButton: NextPage = () => {
  const currentUser = useRecoilValue(authState);
  const [users, setUsers] = useState<any>([]);

  //users情報を取得
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
              currentUser === user.uid && <Box key={user.uid}>{user.name}</Box>
          )}
        </Box>
        <MenuDivider />
        <Link href='/'>
          <a>
            <MenuItem>トップページ</MenuItem>
          </a>
        </Link>
        <MenuDivider />
        <MenuGroup title='お手伝い依頼'></MenuGroup>
        <Link href='/recruitment'>
          <a>
            <MenuItem pl={6}>作成</MenuItem>
          </a>
        </Link>
        <MenuDivider />
        <MenuGroup title='クレーム報告書'></MenuGroup>

        <Link href='/claims/new'>
          <a>
            <MenuItem pl={6}>作成</MenuItem>
          </a>
        </Link>
        <Link href='/claims/'>
          <a>
            <MenuItem pl={6}>一覧</MenuItem>
          </a>
        </Link>
        <Link href='/claims/graph'>
          <a>
            <MenuItem pl={6}>集計（グラフ）</MenuItem>
          </a>
        </Link>

        <MenuDivider />
        {(currentUser === 'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3' ||
          currentUser === 'EVKsigM546MbnakzkDmG0QHlfmn2') && (
          <>
            <Link href='/admin/'>
              <a>
                <MenuItem>管理者ページ</MenuItem>
              </a>
            </Link>
            <MenuDivider />
          </>
        )}
        <MenuItem onClick={logout}>ログアウト</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HeaderMenuButton;
