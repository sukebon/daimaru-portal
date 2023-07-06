import { Box, Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, Textarea, useDisclosure } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { CustomerInfoForm } from './CustomerInfoForm';
import { CustomerInformation } from '../../../types';
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import useSWR from "swr";

type Customers = {
  contents: { name: string; }[];
};

type Prefecture = {
  contents: { prefecture: string; }[];
};

type Props = {
  data: CustomerInformation;
};

export const CustomerInfoModal: FC<Props> = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileUpload, setFileUpload] = useState<any>("");
  const { register, reset, getValues, formState: { errors }, handleSubmit } = useForm<CustomerInformation>(
    {
      defaultValues: {
        customer: data.customer,
        title: data?.title,
        prefecture: data?.prefecture,
        emotion: data?.emotion,
        content: data?.content,
        link: data?.link
      }
    }
  );

  const onSubmit: SubmitHandler<CustomerInformation> = async (data) => {

  };

  const handleFile = (e: any) => {
    if (!e.target.files) return;
    setFileUpload(e.target.files);
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
      <Button colorScheme='blue' size="sm" onClick={onOpen}>編集</Button>

      <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }}>
        <ModalOverlay />
        <ModalContent>

          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>編集</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mt={6}>
                <Text>顧客名</Text>
                <Input
                  autoComplete="off"
                  list="customer"
                  placeholder="顧客名"
                  {...register("customer")}
                />
                <datalist id="customer">
                  {customers?.contents.map(({ name }, index: number) => (
                    <option key={index}>{name}</option>
                  ))}
                </datalist>
                {errors.customer && <Box color="red">顧客名を入力してください。</Box>}
              </Box>
              <Box mt={6}>
                <Text>地域</Text>
                <Select placeholder="地域名"  {...register("prefecture")} value={getValues("prefecture")}>
                  {prefectures?.contents.map(({ prefecture }, index: number) => (
                    <option key={index}>{prefecture}</option>
                  ))}
                </Select>
              </Box>
              <Box mt={6}>
                <Text>タイトル</Text>
                <Input
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
            </ModalBody>
            <ModalFooter>
              <Button mr={3} variant='outline' onClick={() => { onClose(); reset(); }}>
                閉じる
              </Button>
              <Button type="submit" colorScheme='blue'>更新</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
