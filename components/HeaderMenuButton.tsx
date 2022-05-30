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
import { auth } from '../firebase/auth';

const HeaderMenuButton = () => {
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
        <Link href='./'>
          <a>
            <MenuItem>トップページ</MenuItem>
          </a>
        </Link>
        <Link href='./management'>
          <a>
            <MenuItem>依頼する</MenuItem>
          </a>
        </Link>
        <MenuItem onClick={logout}>ログアウト</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HeaderMenuButton;
