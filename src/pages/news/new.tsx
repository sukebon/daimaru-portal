import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { NextPage } from "next";
import { useAuthStore } from "../../../store/useAuthStore";
import { useRouter } from "next/router";

type Inputs = {
  content: string;
  calendar: string;
};

const NewsNew: NextPage = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const addINews = async (data: Inputs) => {
    try {
      const collectionRef = collection(db, "news");
      const userRef = doc(db, "authority", currentUser);
      await addDoc(collectionRef, {
        content: data.content,
        calendar: data.calendar,
        author: currentUser,
        authorRef: userRef,
        createdAt: serverTimestamp(),
      });
      router.push("/news");
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addINews(data);
    reset();
  };
  
  return (
    <Container maxW="500px" bg="white" p={6} boxShadow="md" rounded="md">
      <Flex w="full" justifyContent="space-between" align="center">
        <Box as="h1" fontSize="lg" fontWeight="bold">
          News
        </Box>
        <Link href="/customer-informations" passHref>
          <Button colorScheme="blue" variant="outline" size="sm">
            一覧へ戻る
          </Button>
        </Link>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={6}>
          <Text>日付</Text>
          <Input
            type="date"
            placeholder="内容"
            isInvalid={errors.calendar ? true : false}
            errorBorderColor="red.300"
            {...register("calendar", { required: true })}
          />
          {errors.content && <Box color="red">内容を入力してください。</Box>}
        </Box>
        <Box mt={6}>
          <Text>内容</Text>
          <Textarea
            minH="30vh"
            placeholder="内容"
            resize="vertical"
            whiteSpace="pre-wrap"
            isInvalid={errors.content ? true : false}
            errorBorderColor="red.300"
            {...register("content", { required: true })}
          ></Textarea>
          {errors.content && <Box color="red">内容を入力してください。</Box>}
        </Box>

        <Box mt={6} textAlign="right">
          <Button type="submit" colorScheme="blue">
            登録
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default NewsNew;
