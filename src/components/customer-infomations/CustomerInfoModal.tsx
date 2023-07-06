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
  data?: CustomerInformation;
};

export const CustomerInfoModal: FC<Props> = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileUpload, setFileUpload] = useState<any>("");
  const methods = useForm<CustomerInformation>(
    {
      defaultValues: {
        customer: data?.customer,
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

      <Modal isOpen={isOpen} onClose={() => { onClose(); }}>
        <ModalOverlay />
        <ModalContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ModalHeader>編集</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <CustomerInfoForm />
              </ModalBody>
              <ModalFooter>
                <Button mr={3} variant='outline' onClick={() => { onClose(); }}>
                  閉じる
                </Button>
                <Button type="submit" colorScheme='blue'>更新</Button>
              </ModalFooter>
            </form>
          </FormProvider>
        </ModalContent>
      </Modal>
    </>
  );
};
