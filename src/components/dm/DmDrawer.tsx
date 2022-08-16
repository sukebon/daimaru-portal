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
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

import { auth } from 'firebase-admin';
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextPage } from 'next';
import { useRecoilState } from 'recoil';
import { db, storage } from '../../../firebase';
import { spinnerAtom } from '../../../store';
import Styles from '../../pages/dm/Dm.module.css';

type Props = {
  display: boolean;
  setDisplay: any;
  isOpen: any;
  onOpen: any;
  onClose: any;
};

const DmDrawer: NextPage<Props> = ({
  display,
  setDisplay,
  isOpen,
  onOpen,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [fileUploadImg, setFileUploadImg] = useState<File | any>(null);
  const [fileUploadPdf, setFileUploadPdf] = useState<File | any>(null);
  const [spinner, setSpinner] = useRecoilState(spinnerAtom);
  const firstField = React.useRef(null);

  const onfileUpload = async (e: any) => {
    e.preventDefault();
    if (!fileUploadImg) return;
    if (!fileUploadPdf) return;
    setSpinner(true);
    const fileImg = fileUploadImg[0];
    const filePdf = fileUploadPdf[0];
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join('');
    const fileNameImg = randomChar + '_' + fileImg.name; //保存するファイルの名前
    const fileNamePdf = randomChar + '_' + filePdf.name; //保存するファイルの名前
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
      await addDoc(collection(db, 'dmImages'), {
        title,
        urlImg,
        pathImg,
        nameImg: fileImg.name,
        urlPdf,
        pathPdf,
        namePdf: filePdf.name,
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setFileUploadImg('');
      setFileUploadPdf('');
      console.log('upload success');
    } catch (error) {
      console.log(error);
    } finally {
      setSpinner(false);
    }
  };
  return (
    <>
      <Box position='fixed' w='100%' minH='100vh' zIndex={100} bg='#0e0e0ea3'>
        <Container
          maxW='500px'
          w='95%'
          p={6}
          borderRadius={6}
          position='absolute'
          top='40%'
          left='50%'
          transform='translate(-50%,-50%)'
          bg='white'
          className={Styles.drawer}
        >
          <Box height='100%'>
            <Flex justifyContent='space-between'>
              <Box as='h1' fontSize='2xl'>
                DMを登録する
              </Box>
              {/* <Button onClick={() => setDisplay(false)}>閉じる</Button> */}
            </Flex>
            <Flex flexDirection='column' mt={6}></Flex>
          </Box>
        </Container>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='right'
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            Create a new account
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing='24px'>
              <Box>
                <FormLabel htmlFor='username'>Name</FormLabel>
                <Input
                  ref={firstField}
                  id='username'
                  placeholder='Please enter user name'
                />
              </Box>
            </Stack>
            <form onSubmit={(e) => onfileUpload(e)}>
              <FormControl mt={6}>
                <FormLabel>■タイトル</FormLabel>
                <Input
                  type='text'
                  width='100%'
                  mt={1}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <Box mt={6}>■サムネイル画像を選択してください。</Box>
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
                  type='file'
                  width='auto'
                  mt={1}
                  border='none'
                  accept='image/*'
                  onChange={(e) => setFileUploadImg(e.target.files)}
                  _focus={{ border: 'none' }}
                />
              )}

              <Box mt={6}>■ダウンロードするファイルを選択してください。</Box>
              {fileUploadPdf ? (
                <Box mt={3}>⇒{fileUploadPdf[0] && fileUploadPdf[0].name}</Box>
              ) : (
                <Input
                  type='file'
                  width='auto'
                  mt={1}
                  border='none'
                  accept='application/pdf'
                  onChange={(e) => setFileUploadPdf(e.target.files)}
                  _focus={{ border: 'none' }}
                />
              )}

              <Flex mt={8} justifyContent='center'></Flex>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              mr={2}
              onClick={() => {
                setTitle('');
                setFileUploadImg('');
                setFileUploadPdf('');
              }}
            >
              リセット
            </Button>
            <Button
              type='submit'
              colorScheme='facebook'
              disabled={!title || !fileUploadImg || !fileUploadPdf}
            >
              アップロード
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DmDrawer;
