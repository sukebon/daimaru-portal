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
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { auth } from '../../firebase';
import { authState, usersState } from '../../store';
import { NextPage } from 'next';

const HeaderMenuButton: NextPage = () => {
  const [currentUser, setCurrentUser] = useRecoilState(authState);
  const users = useRecoilValue(usersState); //ユーザー一覧リスト

  //アルコールチェック権限
  const userAuthority = (userId: string) => {
    const newUsers = users.map(
      (user: { alcoholChecker: boolean; uid: string }) => {
        if (user.alcoholChecker == true) {
          return user.uid;
        }
      }
    );
    return newUsers.includes(userId);
  };

  const logout = (event: any) => {
    event.preventDefault();
    auth.signOut();
    setCurrentUser('');
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
        {currentUser && userAuthority(currentUser) && (
          <>
            <MenuGroup title='アルコールチェック'></MenuGroup>
            <Link href='/alcohol-checker'>
              <a>
                <MenuItem pl={6}>一覧</MenuItem>
              </a>
            </Link>
            <MenuDivider />
          </>
        )}
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
        <MenuGroup title='メーカー情報'></MenuGroup>
        <Link href='/makerweb'>
          <a>
            <MenuItem pl={6}>WEB発注リスト</MenuItem>
          </a>
        </Link>
        {currentUser === 'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3' && (
          <>
            {/* <Link href='/dm'>
              <a>
                <MenuItem pl={6}>チラシ・リーフレット</MenuItem>
              </a>
            </Link> */}
          </>
        )}
        <MenuDivider />
        {(currentUser === 'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3' ||
          currentUser === 'EVKsigM546MbnakzkDmG0QHlfmn2') && (
          <>
            <Link href='/admin/'>
              <a>
                <MenuItem>管理者ページ</MenuItem>
              </a>
            </Link>
            <Link href='/sales/'>
              <a>
                <MenuItem>売上一覧</MenuItem>
              </a>
            </Link>
            <Link href='/sales/new'>
              <a>
                <MenuItem>売上登録</MenuItem>
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
