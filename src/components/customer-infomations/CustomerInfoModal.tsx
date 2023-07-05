import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React, { FC } from 'react';
import { CustomerInfoForm } from './CustomerInfoForm';
import { CustomerInformation } from '../../../types';
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  customer: string;
  title: string;
  prefecture: string;
  emotion: "good" | "normal" | "bad";
  content: string;
  link: string;
};

type Props = {
  data?: CustomerInformation;
};

export const CustomerInfoModal: FC<Props> = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const methods = useForm({
    defaultValues: {
      customer: data?.customer || '',
      title: data?.title || '',
      prefecture: data?.prefecture || '',
      emotion: data?.emotion || 'good',
      content: data?.content || '',
      link: data?.link || '',
    }
  });
  const { handleSubmit, reset } = methods;
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

  };

  return (
    <>
      <Button colorScheme='blue' size="sm" onClick={onOpen}>編集</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>編集</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CustomerInfoForm data={data} methods={methods} />
            </ModalBody>

            <ModalFooter>
              <Button mr={3} variant='outline' onClick={onClose}>
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
