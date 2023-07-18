import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { CustomerInfoForm } from "./CustomerInfoInput";
import { CustomerInformation } from "../../../types";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type Props = {
  data?: CustomerInformation;
};

export const CustomerInfoModal: FC<Props> = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileUpload, setFileUpload] = useState<any>("");
  const methods = useForm<CustomerInformation>({
    defaultValues: {
      id: data?.id,
      customer: data?.customer,
      staff:data?.staff,
      title: data?.title,
      prefecture: data?.prefecture,
      emotion: data?.emotion,
      content: data?.content,
      link: data?.link,
    },
  });

  const onSubmit: SubmitHandler<CustomerInformation> = async (data) => {
    updateInformation(data);
  };

  const updateInformation = async (data: CustomerInformation) => {
    const result = confirm("更新して宜しいでしょうか");
    if (!result) return;
    const docRef = doc(db, "customerInformations", data.id);
    await updateDoc(docRef, {
      customer: data?.customer,
      staff:data?.staff,
      title: data?.title,
      prefecture: data?.prefecture,
      emotion: data?.emotion,
      content: data?.content,
      link: data?.link,
    });
    addImageFile(data.id, fileUpload);
    setFileUpload('')
    onClose();
  };

  const addImageFile = (id: string, fileUpload: any) => {
    if (fileUpload.length === 0) return;
    Array.from(fileUpload)?.forEach((file: any) => {
      const storageRef = ref(
        storage,
        `images/customer-informations/${id}/${file.name}`
      );
      uploadBytes(storageRef, file).then(() => {
        getDownloadURL(
          ref(storage, `images/customer-informations/${id}/${file.name}`)
        ).then((url) => {
          const docRef = doc(db, "customerInformations", id);
          console.log(storageRef.fullPath);
          updateDoc(docRef, {
            images: arrayUnion({
              imageUrl: url,
              imagePath: storageRef.fullPath,
            }),
          });
        });
      });
    });
  };

  return (
    <>
      <Button colorScheme="blue" size="sm" onClick={onOpen}>
        編集
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ModalHeader>編集</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <CustomerInfoForm
                  data={data}
                  fileUpload={fileUpload}
                  setFileUpload={setFileUpload}
                />
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
                  更新
                </Button>
              </ModalFooter>
            </form>
          </FormProvider>
        </ModalContent>
      </Modal>
    </>
  );
};
