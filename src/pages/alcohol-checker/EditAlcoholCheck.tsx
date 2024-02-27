import { FC } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { BiSolidEditAlt } from "react-icons/bi";
import { AlcoholCheckForm } from "@/components/alcohol-checker/AlcoholCheckForm";

type Inputs = {
  alcoholCheck1: string;
  alcoholCheck2: string;
  alcoholCheckValue: number;
};

type Props = {
  postId: string;
  defaultValues: Inputs;
};

const EditAlcoholCheckModal: FC<Props> = ({ postId, defaultValues }) => {
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
            userId={postId}
            defaultValues={defaultValues}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditAlcoholCheckModal;
