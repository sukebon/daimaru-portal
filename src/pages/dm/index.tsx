import { Box, Button, Container, Input } from "@chakra-ui/react";
import { auth } from "firebase-admin";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { Document, Page } from "react-pdf";

const Dm = () => {
  //ファイルをアップロード
  const router = useRouter();
  const { id } = router.query;
  // const user = auth.currentUser;
  const [images, setImages] = useState<any>([]);
  const [fileUpload, setFileUpload] = useState<File | any>(null);

  const onfileUpload = async (e: any) => {
    e.preventDefault();
    if (!fileUpload) return;

    const file = fileUpload[0];
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join("");
    const fileName = randomChar + "_" + file.name; //保存するファイルの名前
    const imagePath = `/dmimages/${fileName}`; //保存するstorageのpath
    const storageRef = ref(storage, imagePath);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(ref(storage, imagePath));
      const path = storageRef.fullPath;
      await addDoc(collection(db, "dmImages"), {
        url,
        path,
        name: file.name,
        createdAt: serverTimestamp(),
      });
      setFileUpload("");
      console.log("upload success");
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

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
  console.log(images);

  return (
    <Box bg="#f7f7f7" minH="100vh" p={6}>
      <Container maxW="800px" p={6} bg="white" borderRadius={6}>
        <form onSubmit={(e) => onfileUpload(e)}>
          <Input
            type="file"
            accept="application/pdf"
            value={fileUpload ? fileUpload.name : ""}
            onChange={(e) => setFileUpload(e.target.files)}
          />
          <Button type="submit">アップロード</Button>
        </form>
        <Box>
          {images.map((image: any) => (
            <Box key={image.name}>
              <Document file={image.url}>
                <Page pageNumber={1} />
              </Document>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Dm;
