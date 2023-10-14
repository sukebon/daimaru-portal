import { FC } from "react";
import { AlcoholCheckForm } from "@/components/alcohol-checker/AlcoholCheckForm";
import {BiSolidEditAlt} from "react-icons/bi"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

type Inputs = {
  alcoholCheck1: string;
  alcoholCheck2: string;
  alcoholCheckValue: number;
};

type Props = {
    postId: string;
  defaultValues: Inputs;
};

export const EditAlcoholCheck: FC<Props> = ({ postId, defaultValues }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <BiSolidEditAlt fontSize={19} onClick={onOpen} cursor="pointer" />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          <AlcoholCheckForm
            onClose={onClose}
            pageType="EDIT"
            postId={postId}
            defaultValues={defaultValues}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
