import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import Header from "../../../components/Header";
import { auth } from "../../../../firebase";
import { authState } from "../../../../store";

const CalimPrint = () => {
  const currentUser = useRecoilValue(authState);

  return (
    <>
      {currentUser && (
        <>
          <Header />
          <Box w={{ base: "100%", md: "850px" }} mx="auto" p="6">
            <Flex display={`flex`} justifyContent={"flex-end"}>
              <Box p={2} border={"1px"}>
                管理番号
              </Box>
              <Box
                p={2}
                w={250}
                border="1px"
                borderLeft="none"
                textAlign="center"
              >
                DHHHK-82-R1
              </Box>
            </Flex>
            <Box
              as="h1"
              w="100%"
              mt="6"
              p={3}
              fontSize="24px"
              border="2px"
              textAlign="center"
            >
              クレーム報告書
            </Box>
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              justifyContent={{ md: "space-between" }}
            >
              <Flex>
                <Box
                  w={100}
                  h={10}
                  p={2}
                  mt={6}
                  border="1px"
                  textAlign="center"
                >
                  発生日
                </Box>
                <Input
                  type="date"
                  w={{ base: "100%", md: "290px" }}
                  h={10}
                  p={2}
                  mt={6}
                  border="1px"
                  borderLeft="none"
                  borderRadius={0}
                  borderColor="black"
                />
              </Flex>
              <Flex>
                <Box
                  w={100}
                  h={10}
                  p={2}
                  mt={6}
                  border="1px"
                  textAlign="center"
                >
                  顧客名
                </Box>
                <Input
                  type="text"
                  w={{ base: "100%", md: "290px" }}
                  h={10}
                  p={2}
                  mt={6}
                  border="1px"
                  borderLeft="none"
                  borderRadius={0}
                  borderColor="black"
                  placeholder="顧客名を入力"
                />
              </Flex>
            </Flex>

            {/* 1段目　発生内容 */}
            <Flex mt={6}>
              <Flex
                as="h2"
                w={100}
                minH={220}
                alignItems="center"
                justifyContent="center"
                border="1px"
              >
                発生内容
              </Flex>
              <Box w="100%" border="1px" borderLeft="none">
                <CheckboxGroup colorScheme="green">
                  <Flex>
                    <Box mr={6} p={2} w={100}>
                      ①製品起因
                    </Box>
                    <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                      <Checkbox value="1">製品不良</Checkbox>p={2}
                      <Checkbox value="2">納品書</Checkbox>
                      <Checkbox value="3">商品間違い</Checkbox>
                      <Checkbox value="0">その他</Checkbox>
                    </Stack>
                  </Flex>
                </CheckboxGroup>

                <CheckboxGroup colorScheme="green">
                  <Flex>
                    <Box mr={6} p={2} w={100}>
                      ②受発注
                    </Box>
                    <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                      <Checkbox value="1">住所等</Checkbox>
                      <Checkbox value="2">未納品</Checkbox>
                      <Checkbox value="0">その他</Checkbox>
                    </Stack>
                  </Flex>
                </CheckboxGroup>

                <CheckboxGroup colorScheme="green">
                  <Flex>
                    <Box mr={6} p={2} w={100}>
                      ③その他
                    </Box>
                    <Box>
                      <Stack
                        spacing={[1, 5]}
                        direction={["column", "row"]}
                        p={2}
                      >
                        <Checkbox value="0">その他</Checkbox>
                      </Stack>
                    </Box>
                  </Flex>
                </CheckboxGroup>

                <Textarea
                  m={2}
                  p={2}
                  w="95%"
                  h={150}
                  borderColor="gray"
                  placeholder="内容を入力"
                />
              </Box>
            </Flex>

            {/* 2段目　修正処置 */}
            <Flex mt={6}>
              <Flex
                as="h2"
                w={100}
                minH={220}
                alignItems="center"
                justifyContent="center"
                border="1px"
              >
                修正処置
              </Flex>
              <Box w="100%" border="1px" borderLeft="none">
                <CheckboxGroup colorScheme="green">
                  <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                    <Checkbox value="1">商品再手配</Checkbox>
                    <Checkbox value="2">顧客の説明・交渉</Checkbox>
                    <Checkbox value="3">伝票再発行</Checkbox>
                    <Checkbox value="0">その他</Checkbox>
                  </Stack>
                </CheckboxGroup>
                <Textarea
                  m={2}
                  p={2}
                  w="95%"
                  h={150}
                  borderColor="gray"
                  placeholder="内容を入力"
                />
              </Box>
            </Flex>

            {/* 3段目　対策 */}
            <Flex mt={6}>
              <Flex
                as="h2"
                w={100}
                minH={220}
                alignItems="center"
                justifyContent="center"
                border="1px"
              >
                対策
              </Flex>
              <Box w="100%" border="1px" borderLeft="none">
                <CheckboxGroup colorScheme="green">
                  <Stack spacing={[1, 5]} direction={["column", "row"]} p={2}>
                    <Checkbox value="1">修正処置のみ</Checkbox>
                    <Checkbox value="2">書面提出</Checkbox>
                    <Checkbox value="3">改善の機会</Checkbox>
                    <Checkbox value="0">是正処置</Checkbox>
                  </Stack>
                </CheckboxGroup>
                <Textarea
                  m={2}
                  p={2}
                  w="95%"
                  h={150}
                  borderColor="gray"
                  placeholder="内容を入力"
                />
              </Box>
            </Flex>

            {/* 完了確認欄 */}
            <Flex
              w={{ base: "100%", md: "300px" }}
              mt={6}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                w="100%"
                p={2}
                border="1px"
                borderBottom="none"
                textAlign="center"
              >
                完了確認欄
              </Box>
              <Flex w="100%" border="1px" borderBottom="none">
                <Box w={100} h={10} p={2} borderRight="1px" textAlign="center">
                  完了日
                </Box>
                <Input
                  type="date"
                  w={{ base: "100%", md: "200px" }}
                  borderRadius="none"
                  border="none"
                />
              </Flex>
              <Flex w="100%">
                <Box
                  w={100}
                  h={20}
                  p={2}
                  border="1px"
                  borderRight="none"
                  textAlign="center"
                >
                  確認者
                  <br />
                  グループ長
                </Box>
                <Box
                  w={{ base: "100%", md: "200px" }}
                  p={2}
                  border="1px"
                  borderRadius="none"
                ></Box>
              </Flex>
              <Flex w="100%" mt={6} border="1px">
                <Box w={100} p={2} textAlign="center" borderRight="1px">
                  添付書類
                </Box>
                <Flex
                  w={{ base: "100%", md: "200px" }}
                  p={2}
                  justifyContent="center"
                >
                  <RadioGroup defaultValue="1">
                    <Stack direction="row">
                      <Radio mr={8} value="0">
                        有
                      </Radio>
                      <Radio value="1">無</Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </>
      )}
    </>
  );
};

export default CalimPrint;
