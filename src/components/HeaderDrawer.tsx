import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, MenuDivider, Stack, useDisclosure } from "@chakra-ui/react";
import { useAuthStore } from "../../store/useAuthStore";
import { useDisp } from "@/hooks/useDisp";
import { auth } from "../../firebase";
import Link from "next/link";
import { useAuthManagement } from "@/hooks/useAuthManegement";
import { FC } from "react";

export const HeaderDrawer: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { getUserName } = useDisp();
  const { isAuth, isAdminAuth } = useAuthManagement();


  const logout = (e: any) => {
    e.preventDefault();
    auth.signOut();
  };

  const MenuItemEL = (title: string, href: string) => (
    <Link href={href} passHref>
      <Box pl={6} fontSize='sm' onClick={onClose}>{title}</Box>
    </Link>
  );

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>
        <HamburgerIcon />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <Stack>
              <Box fontSize="xs" fontWeight="bold">ユーザー名</Box>
              <Box mx="4">
                {getUserName(currentUser)}
              </Box>
              <Divider />
              <Link href='/' passHref>
                <Box fontSize='sm' onClick={onClose}>トップページ</Box>
              </Link>
              <Divider />
              <Box fontSize="xs" fontWeight="bold">クレーム報告書</Box>
              {MenuItemEL("作成", "/claims/new")}
              {MenuItemEL("一覧", "/claims")}
              {MenuItemEL("集計（グラフ）", "/claims/graph")}
              <Divider />
              <Box fontSize="xs" fontWeight="bold">お手伝い依頼</Box>
              {MenuItemEL("作成", "/requests/new")}
              {MenuItemEL("一覧", "/requests")}
              <Divider />
              <Box fontSize="xs" fontWeight="bold">お客様情報</Box>
              {MenuItemEL("作成", "/customer-informations/new")}
              {MenuItemEL("一覧", "/customer-informations")}
              <Divider />
              <Box fontSize="xs" fontWeight="bold">売掛金チェック</Box>
              {MenuItemEL("一覧", "/payment-confirms")}
              <Divider />
              <Box fontSize="xs" fontWeight="bold">売上表(今月)</Box>
              {MenuItemEL("一覧・登録", "/sales")}
              <Divider />
              <Box fontSize="xs" fontWeight="bold">NEWS 速報</Box>
              {MenuItemEL("作成", "/news/new")}
              {MenuItemEL("一覧", "/news")}
              <Divider />
              {isAuth('alcoholChecker') && (
                <>
                  <Box fontSize="xs" fontWeight="bold">アルコールチェック</Box>
                  {MenuItemEL("一覧", "/alcohol-checker")}
                  <Divider />
                </>
              )}
              <Box fontSize="xs" fontWeight="bold">デジタルマーケティング</Box>
              {/* {MenuItemEL('Chat GPT', '/chat-gpt')} */}
              {MenuItemEL("進捗", "/progress")}
              {isAdminAuth() && (
                <>
                  {MenuItemEL("管理者ページ", "/admin")}
                  <Divider />
                </>
              )}
              <Box fontSize='sm' cursor="pointer" onClick={logout}>ログアウト</Box>
            </Stack>
          </DrawerBody >

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              閉じる
            </Button>
          </DrawerFooter>
        </DrawerContent >
      </Drawer >
    </>
  );
};