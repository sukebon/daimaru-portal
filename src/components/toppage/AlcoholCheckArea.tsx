/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, onSnapshot } from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useUtils } from "../../hooks/useUtils";
import { useAuthStore } from "../../../store/useAuthStore";
import { AlcoholCheckForm } from "../alcohol-checker/AlcoholCheckForm";

export const AlcoholCheckArea: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [flag, setFlag] = useState(false);
  const { todayDate } = useUtils();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const defaultValues = {
    alcoholCheck1: "1",
    alcoholCheck2: "1",
    alcoholCheckValue: 0,
  };

  useEffect(() => {
    const docRef = doc(db, "alcoholCheckList", `${todayDate()}`);
    onSnapshot(docRef, (querySnapshot) => {
      setFlag(!{ ...querySnapshot.data() }?.member?.includes(currentUser));
    });
  }, []);

  return (
    <>
      {flag && (
        <Flex
          align="center"
          justify="center"
          p={6}
          w="100%"
          rounded="md"
          bg="white"
          boxShadow="xs"
        >
          <Box textAlign="center" mr={6}>
            アルコールチェックをしてください
          </Box>
          <Button colorScheme="blue" onClick={onOpen}>
            Click
          </Button>
        </Flex>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>アルコールチェック</ModalHeader>
          <ModalCloseButton />
          <AlcoholCheckForm
            onClose={onClose}
            pageType="NEW"
            defaultValues={defaultValues}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
