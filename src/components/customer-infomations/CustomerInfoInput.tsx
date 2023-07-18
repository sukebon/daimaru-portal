import {
  Box,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import useSWR from "swr";
import { useFormContext } from "react-hook-form";
import { CustomerInformation } from "../../../types";
import { FaCircleXmark } from "react-icons/fa6";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "../../../store/useAuthStore";

type Customers = {
  contents: { name: string }[];
};

type Prefecture = {
  contents: { prefecture: string }[];
};

type Props = {
  data?: CustomerInformation;
  fileUpload: any;
  setFileUpload: (payload: any) => void;
};

export const CustomerInfoForm: FC<Props> = ({
  data,
  fileUpload,
  setFileUpload,
}) => {
  const users = useAuthStore((state) => state.users);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const handleFile = (e: any) => {
    if (!e.target.files) return;
    setFileUpload(e.target.files);
  };

  const deleteImage = async (
    data: CustomerInformation,
    path: string,
    index: number
  ) => {
    const result = confirm("削除して宜しいでしょうか");
    if (!result) return;
    const desertRef = ref(storage, path);
    deleteObject(desertRef);
    const docRef = doc(db, "customerInformations", data.id);
    const newArray = data.images
      ?.filter((_, i) => (index !== i ? true : false))
      .map((image) => ({
        imageUrl: image.imageUrl,
        imagePath: image.imagePath,
      }));

    await updateDoc(docRef, {
      images: newArray,
    });
    setFileUpload("");
  };

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

  return (
    <>
      <Box mt={6}>
        <Text>顧客名</Text>
        <Input
          autoComplete="off"
          list="customer"
          placeholder="顧客名"
          errorBorderColor="red.300"
          {...register("customer", { required: true })}
        />
        <datalist id="customer">
          {customers?.contents.map(({ name }, index: number) => (
            <option key={index}>{name}</option>
          ))}
        </datalist>
        {errors.customer && <Box color="red">顧客名を入力してください。</Box>}
        <Box mt={6}>
          <Text>担当者</Text>
          <Select placeholder="担当者" {...register("staff")}>
            {users
              ?.filter((user) => user.isoSalesStaff)
              .map(({ uid, name }) => (
                <option key={uid} value={uid}>{name}</option>
              ))}
          </Select>
        </Box>
        <Box mt={6}>
          <Text>地域名</Text>
          <Select placeholder="地域名" {...register("prefecture")}>
            {prefectures?.contents.map(({ prefecture }, index: number) => (
              <option key={index}>{prefecture}</option>
            ))}
          </Select>
        </Box>
      </Box>
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
        <RadioGroup defaultValue={data?.emotion}>
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: 2, sm: 5 }}
          >
            <Radio value="good" {...register("emotion")}>
              <Flex align="center" gap={1}>
                <BsEmojiLaughing color="orange" /> Good
              </Flex>
            </Radio>
            <Radio value="normal" {...register("emotion", { required: true })}>
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
      <Flex mt={6} direction="column" gap={6}>
        {data?.images?.map((image, index) => (
          <Box key={index} position="relative">
            <img src={image.imageUrl} alt="" width="100%" height="auto" />
            <Box
              position="absolute"
              top="-12px"
              right="-12px"
              bgColor="white"
              rounded="full"
              boxShadow="md"
              cursor="pointer"
            >
              <FaCircleXmark
                fontSize="26px"
                onClick={() => deleteImage(data, image.imagePath, index)}
              />
            </Box>
          </Box>
        ))}
      </Flex>
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
    </>
  );
};
