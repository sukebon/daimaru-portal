import { InfoOutlineIcon } from "@chakra-ui/icons";
import { AlertIcon, Box, Button, Flex } from "@chakra-ui/react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { db } from "../../../firebase/auth";
import { todayDate } from "../../../functions";
import { authState } from "../../../store/authState";

const AlcoholChecker = () => {
  const currentUser = useRecoilValue(authState);

  useEffect(() => {
    const setPopup = async () => {
      try {
        const docRef = doc(db, "alcoholList", `${todayDate()}`);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            members: [],
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    setPopup();
  }, []);

  const AddPopup = async () => {
    try {
      const docRef = doc(db, "alcoholList", `${todayDate()}`);
      await updateDoc(docRef, {
        members: arrayUnion(currentUser),
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
      bg="white"
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={{ base: "100%", md: "300px" }}
        height={{ base: "100%", md: "300px" }}
        borderRadius="15px"
        backgroundColor="tomato"
      >
        <Box textAlign="center" color="white">
          アルコールチェック
          <br />
          問題がなければクリック!!
        </Box>

        <Button mt={6} width="200px" colorScheme="facebook" onClick={AddPopup}>
          OK
        </Button>
      </Flex>
    </Flex>
  );
};

export default AlcoholChecker;
