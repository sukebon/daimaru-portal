import {
    Box,
    Button,
    Flex,
    Input,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Textarea,
  } from "@chakra-ui/react";
  import Link from "next/link";
  import React from "react";
  import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
  import { FaRegFaceTired } from "react-icons/fa6";
  import { useForm, SubmitHandler } from "react-hook-form";
  
  type Inputs = {
    customer: string;
    date: string;
    emotion: string;
    content: string;
    link: string;
  };
  
  const CustomerInfoNew = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Inputs>();
  
    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
    return (
      <Flex direction="column" align="center">
        <Box w="full" maxW="500px" p={6} rounded="md" bg="white">
          <Flex w="full" justifyContent="space-between" align="center">
            <Box as="h1" fontSize="lg" fontWeight="bold">
              お客様情報入力
            </Box>
            <Link href="/" passHref>
              <Button size="sm">戻る</Button>
            </Link>
          </Flex>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt={6}>
              <Text>顧客名</Text>
              <Input
                placeholder="顧客名"
                {...register("customer", { required: true })}
              />
            </Box>
            <Box mt={6}>
              <Text>日付</Text>
              <Input type="date" placeholder="日付" {...register("date")} />
            </Box>
            <Box mt={6}>
              <Text>感情</Text>
              <RadioGroup>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  spacing={{ base: 2, sm: 5 }}
                >
                  <Radio value="good" {...register("emotion")}>
                    <Flex align="center" gap={1}>
                      <BsEmojiLaughing /> Good
                    </Flex>
                  </Radio>
                  <Radio value="normal" {...register("emotion")}>
                    <Flex align="center" gap={1}>
                      <BsEmojiNeutral /> Normal
                    </Flex>
                  </Radio>
                  <Radio value="bad" {...register("emotion")}>
                    <Flex align="center" gap={1}>
                      <FaRegFaceTired /> Bad
                    </Flex>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
            <Box mt={6}>
              <Text>内容</Text>
              <Textarea
                minH="30vh"
                placeholder="内容"
                resize="vertical"
                whiteSpace="pre-wrap"
                {...register("content", { required: true })}
              ></Textarea>
            </Box>
            <Box mt={6}>
              <Text>リンク先</Text>
              <Input w="full" {...register('link')} />
            </Box>
            <Box mt={6}>
              <Input type="file" w="auto" border="none" cursor="pointer" />
            </Box>
            <Box mt={6} textAlign="right">
              <Button type="submit" colorScheme="blue">
                登録
              </Button>
            </Box>
          </form>
        </Box>
      </Flex>
    );
  };
  
  export default CustomerInfoNew;
  