import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "../../../store/useAuthStore";

type Inputs = {
  comment: string;
};

type Props = {
  pathname?: string;
};

export const CustomerCommentForm: FC<Props> = ({ pathname }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, register, reset } = useForm<Inputs>({
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    addComment(data, pathname);
  };

  const addComment = async (data: Inputs, pathname: string | undefined) => {
    if (!pathname) return;
    const result = confirm("登録して宜しいでしょうか");
    if (!result) return;
    try {
      const docRef = collection(
        db,
        "customerInformations",
        pathname,
        "comments"
      );
      const userRef = doc(db, "authority", currentUser);
      await addDoc(docRef, {
        comment: data?.comment,
        author: currentUser,
        authorRef: userRef,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
    reset();
    onClose();
  };

  return (
    <>
      <Button colorScheme="blue" size="sm" onClick={onOpen}>
        コメントを書く
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>コメント</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea {...register("comment", { required: true })}></Textarea>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                variant="outline"
                onClick={() => {
                  onClose();
                }}
              >
                閉じる
              </Button>
              <Button type="submit" colorScheme="blue">
                登録
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
