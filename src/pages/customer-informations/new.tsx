import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { NextPage } from "next";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthStore } from "../../../store/useAuthStore";
import { useRouter } from "next/router";

type Inputs = {
  customer: string;
  title: string;
  emotion: string;
  content: string;
  link: string;
};

const CustomerInfoNew: NextPage = () => {
  const [fileUpload, setFileUpload] = useState<any>("");
  const currentUser = useAuthStore((state) => state.currentUser);
  const router = useRouter()

  const handleFile = (e: any) => {
    if (!e.target.files) return;
    console.log(e.target.files);
    Array.from(e.target.files).forEach((file: any, index) => {
      console.log(index, file?.name);
    });
    setFileUpload(e.target.files);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const addInformation = async (data: Inputs) => {
    try {
      const collectionRef = collection(db, "customerInformations");
      const userRef = doc(db, "authority", currentUser);
      const docRef = await addDoc(collectionRef, {
        customer: data.customer,
        title: data.title,
        emotion: data.emotion,
        content: data.content,
        link: data.link,
        author: currentUser,
        authorRef: userRef,
        createdAt: serverTimestamp(),
      });
      addImageFile(docRef.id, fileUpload);
      router.push('/customer-informations')
    } catch (error) {
      console.log(error);
    }
  };

  const addImageFile = (id: string, fileUpload: any) => {
    if (fileUpload.length === 0) return;
    Array.from(fileUpload)?.forEach((file: any) => {
      const storageRef = ref(
        storage,
        `images/customer-informations/${id}/${file.name}`
      );
      uploadBytes(storageRef, file).then(() => {
        getDownloadURL(
          ref(storage, `images/customer-informations/${id}/${file.name}`)
        ).then((url) => {
          const docRef = doc(db, "customerInformations", id);
          updateDoc(docRef, {
            images: arrayUnion({
              imageUrl: url,
              imagePath: storageRef.fullPath,
            }),
          });
        });
      });
    });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addInformation(data);
    reset();
  };

  return (
    <Container maxW="500px" bg="white" p={6} boxShadow="md" rounded="md">
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
          <Text>タイトル</Text>
          <Input
            placeholder="タイトル"
            {...register("title", { required: true })}
          />
        </Box>
        <Box mt={6}>
          <Text>感情</Text>
          <RadioGroup defaultValue="good">
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: 2, sm: 5 }}
            >
              <Radio value="good" {...register("emotion", { required: true })}>
                <Flex align="center" gap={1}>
                  <BsEmojiLaughing /> Good
                </Flex>
              </Radio>
              <Radio
                value="normal"
                {...register("emotion", { required: true })}
              >
                <Flex align="center" gap={1}>
                  <BsEmojiNeutral /> Normal
                </Flex>
              </Radio>
              <Radio value="bad" {...register("emotion", { required: true })}>
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
          <Input w="full" {...register("link")} />
        </Box>
        <Box mt={6}>
          <Input
            type="file"
            w="auto"
            multiple
            border="none"
            cursor="pointer"
            value={fileUpload?.name}
            onChange={handleFile}
          />
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

export default CustomerInfoNew;
