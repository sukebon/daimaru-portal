import {
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
import { useRecoilValue } from 'recoil';
import { auth } from '../../firebase/auth';
import { authState } from '../../store/authState';
import { Administrator } from '../../data';

const HeaderMenuButton = () => {
  const currentUser = useRecoilValue(authState);

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
        <Link href='/'>
          <a>
            <MenuItem>トップページ</MenuItem>
          </a>
        </Link>
        <Link href='/recruitment'>
          <a>
            <MenuItem>お手伝い依頼作成</MenuItem>
          </a>
        </Link>
        {/* {(currentUser === "MBTOK9Jr0eRWVuoT2YXgZNMoBQH3" ||
          currentUser === "Glkhk9WERWcEQWwdlfjD5a2jT6m1") && ( */}
        <>
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
          <Link href='/admin/'>
            <a>
              <MenuItem>管理者ページ</MenuItem>
            </a>
          </Link>
          <MenuDivider />
        </>
        {/* )} */}
        <MenuItem onClick={logout}>ログアウト</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HeaderMenuButton;
