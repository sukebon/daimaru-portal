/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Input,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState, spinnerAtom } from "../../../store";
import DmDrawer from "../../components/dm/DmDrawer";
import Styles from "./Dm.module.css";
import SpinnerLoading from "../../components/SpinnerLoading";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const Dm = () => {
  //ファイルをアップロード
  const currentUser = useRecoilValue(authState);
  const router = useRouter();
  const [images, setImages] = useState<any>([]);
  const [title, setTitle] = useState("");
  const [fileUploadImg, setFileUploadImg] = useState<File | any>(null);
  const [fileUploadPdf, setFileUploadPdf] = useState<File | any>(null);

  const [display, setDisplay] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef(null);
  const [spinner, setSpinner] = useRecoilState(spinnerAtom);

  //チラシ・リーフレット一覧を取得
  useEffect(() => {
    const getImages = async () => {
      try {
        const unsub = onSnapshot(
          collection(db, "dmImages"),
          (querySnapshot) => {
            setImages(
              querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }))
            );
          }
        );
      } catch (err) {
        console.log(err);
      }
    };
    getImages();
  }, []);

  const deleteImage = async (post: {
    id: string;
    pathImg: string;
    pathPdf: string;
  }) => {
    const result = window.confirm("削除して宜しいでしょうか？");
    if (!result) return;
    setSpinner(true);
    try {
      await deleteDoc(doc(db, "dmImages", `${post.id}`));
      imagesStorageDelete(post.pathImg, post.pathPdf);
      console.log("success");
    } catch (err) {
      console.log(err);
    } finally {
      setSpinner(false);
    }
  };

  const imagesStorageDelete = async (img: any, pdf: any) => {
    try {
      const desertRefImg = ref(storage, img);
      const desertRefPdf = ref(storage, pdf);
      await deleteObject(desertRefImg);
      await deleteObject(desertRefPdf);
    } catch (err) {
      console.log(err);
    }
  };

  const onfileUpload = async () => {
    if (!fileUploadImg) return;
    if (!fileUploadPdf) return;
    setSpinner(true);
    const fileImg = fileUploadImg[0];
    const filePdf = fileUploadPdf[0];
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join("");
    const fileNameImg = randomChar + "_" + fileImg.name; //保存するファイルの名前
    const fileNamePdf = randomChar + "_" + filePdf.name; //保存するファイルの名前
    const imagePathImg = `/dmImages/${fileNameImg}`; //保存するstorageのpath
    const imagePathPdf = `/dmImages/${fileNamePdf}`; //保存するstorageのpath
    const storageRefImg = ref(storage, imagePathImg);
    const storageRefPdf = ref(storage, imagePathPdf);
    try {
      await uploadBytes(storageRefImg, fileImg);
      await uploadBytes(storageRefPdf, filePdf);
      const urlImg = await getDownloadURL(ref(storage, imagePathImg));
      const urlPdf = await getDownloadURL(ref(storage, imagePathPdf));
      const pathImg = storageRefImg.fullPath;
      const pathPdf = storageRefPdf.fullPath;
      await addDoc(collection(db, "dmImages"), {
        title,
        urlImg,
        pathImg,
        nameImg: fileImg.name,
        urlPdf,
        pathPdf,
        namePdf: filePdf.name,
        user: currentUser,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setFileUploadImg("");
      setFileUploadPdf("");
      console.log("upload success");
    } catch (error) {
      console.log(error);
    } finally {
      setSpinner(false);
    }
  };

  const timestamp = (time: any) => {
    if (!time) return;
    const date = new Date(time.toDate());
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `登録日：${year}/${month}/${day}`;
  };

  return (
    <>
      {currentUser && (
        <>
          <SpinnerLoading />
          <Container maxW="1145px" p={6} pr={0} bg="white" borderRadius={6}>
            <Flex justifyContent="right">
              <Button
                leftIcon={<AddIcon />}
                colorScheme="teal"
                onClick={onOpen}
                mr={6}
              >
                チラシを登録する
              </Button>
            </Flex>
            {images.length >= 1 ? (
              <Flex flexDirection="row" flexWrap="wrap" justifyContent="center">
                {images.map((image: any) => (
                  <Box key={image.id} mt={12} w="200px" mr={6}>
                    <a href={image.urlPdf} target="_blanck" rel="noopener">
                      <Box as="figure">
                        <img
                          src={image.urlImg}
                          alt={image.nameImg}
                          className={Styles.img}
                        />
                      </Box>
                    </a>
                    <Text whiteSpace="pre-wrap">{image.title}</Text>
                    <Box whiteSpace="pre-wrap">
                      {timestamp(image.createdAt)}
                    </Box>
                    {currentUser === image.user && (
                      <Button
                        colorScheme="red"
                        size="sm"
                        w="100%"
                        mt={1}
                        onClick={() => deleteImage(image)}
                      >
                        削除
                      </Button>
                    )}
                  </Box>
                ))}
              </Flex>
            ) : (
              <Box
                textAlign="center"
                py={12}
                fontSize={{ base: "xs", md: "2xl" }}
              >
                現在登録されているチラシはありません。
              </Box>
            )}
          </Container>

          <Drawer
            isOpen={isOpen}
            placement="right"
            initialFocusRef={firstField}
            onClose={onClose}
            size="sm"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">登録</DrawerHeader>

              <DrawerBody>
                <Stack spacing="24px">
                  <Box>
                    <FormLabel htmlFor="title" mt={3}>
                      ■見出し
                    </FormLabel>
                    <Input
                      ref={firstField}
                      id="title"
                      value={title}
                      placeholder="見出しを入力してください"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Box>
                </Stack>

                <Box mt={6}>■サムネイルを選択してください（jpeg.jpg.png）</Box>
                {fileUploadImg ? (
                  <Box mt={3}>
                    <img
                      src={
                        fileUploadImg[0] &&
                        window.URL.createObjectURL(fileUploadImg[0])
                      }
                    />
                  </Box>
                ) : (
                  <Input
                    type="file"
                    width="auto"
                    mt={3}
                    border="none"
                    accept="image/*"
                    onChange={(e) => setFileUploadImg(e.target.files)}
                    _focus={{ border: "none" }}
                  />
                )}

                <Box mt={6}>■資料を選択してください。（PDF）</Box>
                {fileUploadPdf ? (
                  <Box mt={3}>⇒{fileUploadPdf[0] && fileUploadPdf[0].name}</Box>
                ) : (
                  <Input
                    type="file"
                    width="auto"
                    mt={3}
                    border="none"
                    accept="application/pdf"
                    onChange={(e) => setFileUploadPdf(e.target.files)}
                    _focus={{ border: "none" }}
                  />
                )}

                <Flex mt={8} justifyContent="center"></Flex>

                <Flex justifyContent="center" pb={9}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTitle("");
                      setFileUploadImg("");
                      setFileUploadPdf("");
                    }}
                  >
                    リセット
                  </Button>
                </Flex>
              </DrawerBody>

              <DrawerFooter borderTopWidth="1px">
                <Flex justifyContent="center" w="100%">
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="facebook"
                    disabled={!title || !fileUploadImg || !fileUploadPdf}
                    onClick={() => onfileUpload()}
                  >
                    アップロード
                  </Button>
                </Flex>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
};

export default Dm;
