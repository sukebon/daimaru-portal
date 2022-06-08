import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";
import { auth } from "../firebase/auth";
import { authState } from "../store/authState";

const HeaderMenuButton = () => {
  const currentUser = useRecoilValue(authState);

  const logout = (event: any) => {
    event.preventDefault();
    auth.signOut();
  };

  return (
    <Menu>
      <MenuButton as={Button} colore="#241749">
        Menu
      </MenuButton>
      <MenuList>
        <Link href="/">
          <a>
            <MenuItem>トップページ</MenuItem>
          </a>
        </Link>
        <Link href="/recruitment">
          <a>
            <MenuItem>お手伝い依頼</MenuItem>
          </a>
        </Link>
        {currentUser === "MBTOK9Jr0eRWVuoT2YXgZNMoBQH3" ||
        currentUser === "EVKsigM546MbnakzkDmG0QHlfmn2" ? (
          <Link href="/claim/new">
            <a>
              <MenuItem>クレーム報告書</MenuItem>
            </a>
          </Link>
        ) : (
          ""
        )}
        <MenuItem onClick={logout}>ログアウト</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HeaderMenuButton;
