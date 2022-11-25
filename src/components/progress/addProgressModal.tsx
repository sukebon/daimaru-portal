import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";

type Props = {
  progress: {
    title: string;
    startDate: string;
    endDate: string;
    contents: [{}];
  };
};

const AddProgressModal: NextPage<Props> = ({ progress }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [items, setItems] = useState({
    title: "",
    startDate: "",
    endDate: "",
    contents: [{}],
  });

  useEffect(() => {
    setItems({ ...progress });
  }, [progress]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleInputsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    result: boolean,
    index: number
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    items.contents[index] = { title: e.target.value, result };
    setItems({ ...items });
  };

  const addRow = () => {
    items.contents.push({ title: "", result: false });
    setItems({ ...items });
  };

  const reset = () => {
    setItems({ ...progress });
  };

  console.log(items);

  return (
    <>
      <Button size="sm" onClick={onOpen}>
        項目追加
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>追加</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mt={3}>項目</Text>
            <Flex gap={3}>
              <Input type="text" value="button" onChange={handleInputChange} />
              <Button onClick={addRow}>追加</Button>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                reset();
                onClose();
              }}
            >
              閉じる
            </Button>
            <Button colorScheme="blue">更新</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddProgressModal;
