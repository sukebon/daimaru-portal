import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
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
import useSWR from "swr";

type Inputs = {
  customer: string;
  title: string;
  prefecture: string;
  staff: string;
  emotion: string;
  content: string;
  link: string;
};

type Customers = {
  contents: { name: string }[];
};

type Prefecture = {
  contents: { prefecture: string }[];
};

const CustomerInfoNew: NextPage = () => {
  const [fileUpload, setFileUpload] = useState<any>("");
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const router = useRouter();

  const fetcher = async (url: string) =>
    await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SPREADSHEET_APIKEY as string,
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error("error fetching the data.");
      }
      return res.json();
    });
  const { data: customers } = useSWR<Customers>(
    "/api/customer-informations/customers",
    fetcher
  );

  const { data: prefectures } = useSWR<Prefecture>(
    "/api/customer-informations/prefectures",
    fetcher
  );

  const handleFile = (e: any) => {
    if (!e.target.files) return;
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
        staff: data.staff || "",
        prefecture: data.prefecture,
        emotion: data.emotion,
        content: data.content,
        link: data.link,
        author: currentUser,
        authorRef: userRef,
        createdAt: serverTimestamp(),
      });
      addImageFile(docRef.id, fileUpload);
      router.push("/customer-informations");
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
          console.log(storageRef.fullPath);
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
        <Link href="/customer-informations" passHref>
          <Button colorScheme="blue" variant="outline" size="sm">
            一覧へ戻る
          </Button>
        </Link>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={6}>
          <Text>顧客名</Text>
          <Input
            autoComplete="off"
            list="customer"
            placeholder="顧客名"
            isInvalid={errors.customer ? true : false}
            errorBorderColor="red.300"
            {...register("customer", { required: true })}
          />
          <datalist id="customer">
            {customers?.contents.map(({ name }, index: number) => (
              <option key={index}>{name}</option>
            ))}
          </datalist>
          {errors.customer && <Box color="red">顧客名を入力してください。</Box>}
        </Box>
        <Flex mt={6} gap={6} direction={{ base: "column", md: "row" }}>
          <Box w="full">
            <Text>担当者</Text>
            <Select placeholder="担当者" {...register("staff")}>
              {users
                ?.filter((user) => user.isoSalesStaff)
                .map(({ uid, name }) => (
                  <option key={uid} value={uid}>
                    {name}
                  </option>
                ))}
            </Select>
          </Box>
          <Box w="full">
            <Text>地域</Text>
            <Select placeholder="地域名" {...register("prefecture")}>
              {prefectures?.contents.map(({ prefecture }, index: number) => (
                <option key={index}>{prefecture}</option>
              ))}
            </Select>
          </Box>
        </Flex>
        <Box mt={6}>
          <Text>タイトル</Text>
          <Input
            isInvalid={errors.title ? true : false}
            errorBorderColor="red.300"
            placeholder="タイトル"
            {...register("title", { required: true })}
          />
          {errors.title && <Box color="red">タイトルを入力してください。</Box>}
        </Box>
        <Box mt={6}>
          <Text>受けた印象</Text>
          <RadioGroup defaultValue="good">
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: 2, sm: 5 }}
            >
              <Radio value="good" {...register("emotion")}>
                <Flex align="center" gap={1}>
                  <BsEmojiLaughing color="orange" /> Good
                </Flex>
              </Radio>
              <Radio
                value="normal"
                {...register("emotion", { required: true })}
              >
                <Flex align="center" gap={1}>
                  <BsEmojiNeutral color="blue" /> Normal
                </Flex>
              </Radio>
              <Radio value="bad" {...register("emotion", { required: true })}>
                <Flex align="center" gap={1}>
                  <FaRegFaceTired color="red" /> Bad
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
            isInvalid={errors.content ? true : false}
            errorBorderColor="red.300"
            {...register("content", { required: true })}
          ></Textarea>
          {errors.content && <Box color="red">内容を入力してください。</Box>}
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
