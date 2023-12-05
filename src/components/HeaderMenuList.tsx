import React, { FC, useEffect, useState } from "react";
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
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "../../store/useAuthStore";
import { menu } from "@/utils/header-menu";

export const HeaderMenuList: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [isWillfit, setIsWillfit] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const getWillfituUser = async () => {
      const docRef = doc(db, "authority", `${currentUser}`);
      const snapShot = await getDoc(docRef);
      const bool = snapShot.data()?.willfit;
      setIsWillfit(bool);
    };
    getWillfituUser();
  }, [currentUser]);

  return (
    <>
      <Box display={{ base: "block", "2xl": "none" }}>
        <Menu>
          <MenuButton as={Button} colorScheme="blue" variant="outline" mr={3}>
            Menu
          </MenuButton>
          <MenuList>
            {isWillfit && (
              <Link
                href="https://willfit-portal.vercel.app/dashboard"
                rel="noreferrer"
                passHref
              >
                <MenuItem>ウィルフィット</MenuItem>
              </Link>
            )}
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
        {isWillfit && (
          <Link
            href="https://willfit-portal.vercel.app/dashboard"
            rel="noreferrer"
            passHref
          >
            <Button size="sm" colorScheme="blue" fontWeight="bold">
              ウィルフィット
            </Button>
          </Link>
        )}
        {menu.map((m) => (
          <Link
            key={m.title}
            href={m.link}
            target={m.blank ? "_blank" : ""}
            passHref
          >
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
