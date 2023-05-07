import React, { FC } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { ProgressInpuArea } from './ProgressInpuArea';
import { ProgressData } from '../../../types';
import { FaEdit } from "react-icons/fa";

type Props = {
  progress: ProgressData;
};

export const ProgressEdit: FC<Props> = ({ progress }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <FaEdit color="gray" cursor="pointer" onClick={onOpen} />
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProgressInpuArea progress={progress} type="edit" onClose={onClose} />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant='ghost' onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
