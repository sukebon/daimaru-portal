import React, { FC } from "react";
import Link from "next/link";
import {
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";

export const HeaderMenuList: FC = () => {
  const menu = [
    {
      title: "マイユニポータル",
      link: "https://myuni.vercel.app/catalog",
      blank: true,
    },
    {
      title: "WEB在庫",
      link: "https://daimaru-maker-zaiko.vercel.app/daimaru/",
      blank: true,
    },
    {
      title: "ホームページ",
      link: "https://www.daimaru-hakui.co.jp/",
      blank: true,
    },
    {
      title: "組織カレンダー",
      link: "https://calendar.nextset.jp/daimaruhakui/gp/calendar.html",
      blank: true,
    },
    {
      title: "生地在庫",
      link: "https://daimaru-kijizaiko.vercel.app/dashboard",
      blank: true,
    },
    {
      title: "裁断報告書",
      link: "https://daimaru-kijizaiko.vercel.app/tokushima/cutting-reports",
      blank: true,
    },
    {
      title: "売掛金情報",
      link: "/receivables",
    },
    {
      title: "会社カレンダー",
      link: "/calendar",
    },
    { title: "メーカーWEB", link: "/makerweb" },
  ];

  return (
    <>
      <Box display={{ base: "block", "2xl": "none" }}>
        <Menu>
          <MenuButton as={Button} colorScheme="blue" variant="outline" mr={3}>
            Menu
          </MenuButton>
          <MenuList>
            {menu.map((m) => (
              <Link
                key={m.title}
                href={m.link}
                target={m.blank ? "_blank" : ""}
                rel="noreferrer"
                passHref
              >
                <MenuItem>{m.title}</MenuItem>
              </Link>
            ))}
          </MenuList>
        </Menu>
      </Box>
      <HStack spacing={3} mr={3} display={{ base: "none", "2xl": "block" }}>
        {menu.map((m) => (
          <Link key={m.title} href={m.link} target={m.blank ? "_blank" : ""} passHref>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              fontWeight="bold"
            >
              {m.title}
            </Button>
          </Link>
        ))}
      </HStack>
    </>
  );
};
