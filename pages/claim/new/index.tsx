import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { auth, db } from "../../../firebase/auth";
import { authState } from "../../../store/authState";

//クレーム報告書作成

const ClaimNew = () => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [router, user]);

  const AddClaim = async () => {
    try {
      const docRef = await addDoc(collection(db, "claimList"), {
        customer: "customer",
        occurrenceDate: "",
        occurrenceNumber: "",
        occurrenceContent: "",
        amendmentNumber: "",
        amendmentContent: "",
        counterplanNumber: "",
        counterplanContent: "",
        completionDate: "",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      {currentUser && (
        <>
          <Header />
          <Box w={{ base: "100%", md: "700px" }} mx="auto" my={6} p={6}>
            <Box
              as="h1"
              w="100%"
              mt={9}
              p={3}
              fontSize="28px"
              fontWeight="semibold"
              textAlign="center"
            >
              クレーム報告書
            </Box>

            <Box>
              <Box mt={10} fontSize="lg" fontWeight="semibold">
                顧客名
              </Box>
              <Input
                type="text"
                w="100%"
                p={2}
                mt={3}
                placeholder="顧客名を入力"
              />
            </Box>
            <Box>
              <Box mt={9} fontSize="lg" fontWeight="semibold">
                発生日
              </Box>
              <Input type="date" w="100%" p={2} mt={3} />
            </Box>

            {/* 1段目　発生内容 */}
            <Box mt={10}>
              <Box as="h2" fontSize="lg" fontWeight="semibold">
                発生内容
              </Box>

              <Box w="100%" mt={6}>
                <RadioGroup colorScheme="green">
                  <Box mt={3}>①製品起因</Box>
                  <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                    <Radio value="1">製品不良</Radio>
                    <Radio value="2">納品書</Radio>
                    <Radio value="3">伝商品間違い</Radio>
                    <Radio value="4">その他</Radio>
                  </Stack>
                  <Box mt={3}>②受発注</Box>
                  <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                    <Radio value="5">住所等</Radio>
                    <Radio value="6">未納品</Radio>
                    <Radio value="7">その他</Radio>
                  </Stack>
                  <Box mt={3}>③その他</Box>
                  <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                    <Radio value="8">その他</Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              <Textarea mt={3} p={2} w="100%" placeholder="内容を入力" />
            </Box>

            {/* 2段目　修正処置 */}
            <Box mt={10}>
              <Flex as="h2" fontSize="lg" fontWeight="semibold">
                修正処置
              </Flex>
              <Box w="100%" mt={3}>
                <RadioGroup colorScheme="green" defaultValue="1">
                  <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                    <Radio value="1">商品再手配</Radio>
                    <Radio value="2">顧客の説明・交渉</Radio>
                    <Radio value="3">伝票再発行</Radio>
                    <Radio value="4">その他</Radio>
                  </Stack>
                </RadioGroup>
                <Textarea mt={3} p={2} w="100%" placeholder="内容を入力" />
              </Box>
            </Box>

            {/* 3段目　対策 */}
            <Box mt={9}>
              <Flex as="h2" fontSize="lg" fontWeight="semibold">
                対策
              </Flex>
              <Box w="100%" mt={3}>
                <RadioGroup colorScheme="green" defaultValue="1">
                  <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                    <Radio value="1">修正処置のみ</Radio>
                    <Radio value="2">書面提出</Radio>
                    <Radio value="3">改善の機会</Radio>
                    <Radio value="4">是正処置</Radio>
                  </Stack>
                </RadioGroup>
                <Textarea mt={3} p={2} w="100%" placeholder="内容を入力" />
              </Box>
            </Box>

            {/* 添付書類 */}
            <Box w="100%" mt={9}>
              <Box w="100%" mt={6}>
                <Box mr={3} fontSize="lg" fontWeight="semibold">
                  添付書類
                </Box>
                <Box mt={3}>
                  <input type="file" accept="image/png, image/jpeg" />
                </Box>
              </Box>
            </Box>

            {/*送信ボタン*/}
            <Box mt={12} textAlign="center">
              <Button>提出する</Button>
            </Box>
          </Box>
        </>
      )}
      <Footer />
    </>
  );
};

export default ClaimNew;
