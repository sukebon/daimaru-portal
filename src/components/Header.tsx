import { Text, Flex, Box, HStack, Button } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HeaderMenuButton from "./HeaderMenuButton";
import { authState } from "../../store";
import { useRecoilValue } from "recoil";
import { NextPage } from "next";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import HeaderMenuList from "./HeaderMenuList";

const Header: NextPage = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(authState);

  useEffect(() => {
    if (currentUser === "") {
      router.push("/login");
    }
  }, [router, currentUser]);

  return (
    <>
      {currentUser && (
        <Flex
          width={"100%"}
          height={"60px"}
          padding={"0 10px"}
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          boxShadow="sm"
          position="sticky"
          top={0}
          zIndex={100}
        >
          <Flex alignItems={"center"}>
            <Link href="/">
              <a>
                <Text fontSize={{ base: "large" }} fontWeight={"bold"}>
                  社内用ポータルサイト
                </Text>
              </a>
            </Link>
          </Flex>
          <Flex alignItems="center">
            <HeaderMenuList />
            <HeaderMenuButton />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Header;
