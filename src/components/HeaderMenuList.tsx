import React from "react";
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

const HeaderMenuList = () => {
  const menu = [
    {
      title: "マイユニポータル",
      link: "https://myuni.vercel.app/catalog",
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
      title: "会社カレンダー",
      link: "/calendar",
      blank: false,
    },
    { title: "メーカーWEB", link: "/makerweb", blank: false },
  ];

  return (
    <>
      <Box display={{ base: "block", lg: "none" }}>
        <Menu>
          <MenuButton as={Button} colorScheme="blue" variant="outline" mr={3}>
            Menu
          </MenuButton>
          <MenuList>
            {menu.map((m) => (
              <Link key={m.title} href={m.link}>
                {m.blank === true ? (
                  <a target="_blank">
                    <MenuItem>{m.title}</MenuItem>
                  </a>
                ) : (
                  <a>
                    <MenuItem>{m.title}</MenuItem>
                  </a>
                )}
              </Link>
            ))}
          </MenuList>
        </Menu>
      </Box>
      <HStack spacing={3} mr={3} display={{ base: "none", lg: "block" }}>
        {menu.map((m) => (
          <Link key={m.title} href={m.link}>
            {m.blank === true ? (
              <a target="_blank">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  fontWeight="bold"
                >
                  {m.title}
                </Button>
              </a>
            ) : (
              <a>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  fontWeight="bold"
                >
                  {m.title}
                </Button>
              </a>
            )}
          </Link>
        ))}
      </HStack>
    </>
  );
};

export default HeaderMenuList;
