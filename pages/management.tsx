import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/auth";
import { auth } from "../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Form from "../components/Form";
import PostManagement from "../components/PostManagement";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState.js";

const Management = () => {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any>([]);
  const currentUser = useRecoilValue(authState);

  useEffect(() => {
    const usersCollectionRef = collection(db, "requestList");
    const q = query(usersCollectionRef, orderBy("sendAt", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);

  return (
    <>
      {currentUser && (
        <Box
          width={"100%"}
          backgroundColor={"#f7f7f7"}
          paddingBottom={"50px"}
          minH={"100vh"}
        >
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            width={{ md: "800px" }}
            margin={"0 auto"}
          >
            <Form />
            {currentUser === "MBTOK9Jr0eRWVuoT2YXgZNMoBQH3" ||
            currentUser === "EVKsigM546MbnakzkDmG0QHlfmn2" ? (
              <PostManagement requests={requests} />
            ) : (
              ""
            )}
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Management;
