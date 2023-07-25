import React, { FC } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  Textarea,
  Text,
  Input,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

type Inputs = {
  content: string;
  calendar: string;
};

type Props = {
  id: string;
  calendar: string;
  content: string;
};

export const NewsEditModal: FC<Props> = ({ id, calendar, content }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      calendar: calendar,
      content: content,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateNews(id, data);
    reset();
  };

  const updateNews = async (id: string, data: Inputs) => {
    const docRef = doc(db, "news", id);
    await updateDoc(docRef, {
      calendar: data.calendar,
      content: data.content,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <>
      <Button size="xs" variant="outline" onClick={onOpen}>編集</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                {errors.content && (
                  <Box color="red">内容を入力してください。</Box>
                )}
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
                {errors.content && (
                  <Box color="red">内容を入力してください。</Box>
                )}
              </Box>

              <Box mt={6} textAlign="right">
                <Button type="submit" w="full" colorScheme="blue">
                  更新
                </Button>
              </Box>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
