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
import { Administrator } from '../../data';
import { HamburgerIcon } from '@chakra-ui/icons';

const HeaderMenuButton: NextPage = () => {
  const [currentUser, setCurrentUser] = useRecoilState(authState);
  const users = useRecoilValue(usersState); //ユーザー一覧リスト

  //アルコールチェック権限
  const userAlcoholAuthority = (userId: string) => {
    const newUsers = users.map(
      (user: { alcoholChecker: boolean; uid: string }) => {
        if (user.alcoholChecker == true) return user.uid;
      }
    );
    return newUsers.includes(userId);
  };

  //営業マン権限
  const userSalesAuthority = (userId: string) => {
    const newUsers = users.map(
      (user: { isoSalesStaff: boolean; uid: string }) => {
        if (user.isoSalesStaff == true) return user.uid;
      }
    );
    return newUsers.includes(userId);
  };

  const logout = (e: any) => {
    e.preventDefault();
    auth.signOut();
    // setCurrentUser("");
  };

  return (
    <Menu>
      <MenuButton as={Button} colorScheme='blue' pb={1}>
        <HamburgerIcon />
      </MenuButton>
      <MenuList fontSize='xs'>
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
        {currentUser && userAlcoholAuthority(currentUser) && (
          <>
            <MenuGroup title='アルコールチェック' fontSize='xs'></MenuGroup>
            <Link href='/alcohol-checker'>
              <a>
                <MenuItem pl={6}>一覧</MenuItem>
              </a>
            </Link>
            <MenuDivider />
          </>
        )}

        <MenuGroup title='クレーム報告書' fontSize='xs'></MenuGroup>

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

        <MenuGroup title='売上表(今月）' fontSize='xs'></MenuGroup>
        <Link href='/sales/'>
          <a>
            <MenuItem pl={6}>一覧・登録</MenuItem>
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
            <Link href='/progress'>
              <a>
                <MenuItem>進捗</MenuItem>
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
