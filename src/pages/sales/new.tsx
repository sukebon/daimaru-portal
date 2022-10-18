import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { db } from "../../../firebase";
import { authState } from "../../../store";

const SalesNew = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(authState);
  const [salesObj, setSalesObj] = useState({
    currentTarget: "",
    currentAchieve: "",
    currentLanding: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSalesObj({ ...salesObj, [name]: value });
  };

  const addSales = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const result = year + "-" + month;

    const docRef = doc(db, "sales", `${result}_${currentUser}`);
    try {
      await setDoc(docRef, {
        currentTarget: salesObj.currentTarget,
        currentAchieve: salesObj.currentAchieve,
        currentLanding: salesObj.currentLanding,
        currentUser,
        createdAt: serverTimestamp(),
        datetime: `${year}-${month}-${day}`,
      });
    } catch (err) {
      console.log(err);
    } finally {
      router.push("/sales/");
    }
  };

  const dateTitle = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const result = year + "-" + month;
    return result;
  };

  return (
    <Box backgroundColor={"#f7f7f7"} pt={6} minH={"calc(100vh - 135px)"}>
      <Container bgColor="white" p={6} borderRadius={6}>
        <Box>
          <Stack spacing={6}>
            <Text>{dateTitle()}月 売上</Text>
            <Input
              mr={2}
              placeholder="予算を入力してください"
              name="currentTarget"
              value={salesObj.currentTarget}
              onChange={handleInputChange}
            />
            <Input
              mr={2}
              placeholder="実績を入力してください"
              name="currentAchieve"
              value={salesObj.currentAchieve}
              onChange={handleInputChange}
            />
            <Input
              mr={2}
              placeholder="着地を入力してください"
              name="currentLanding"
              value={salesObj.currentLanding}
              onChange={handleInputChange}
            />
            <Flex w="100%">
              <Box w="50%" mr={3}>
                <Link href="/sales/">
                  <a>
                    <Button w="100%">戻る</Button>
                  </a>
                </Link>
              </Box>
              <Button w="50%" colorScheme="blue" onClick={addSales}>
                登録
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default SalesNew;
