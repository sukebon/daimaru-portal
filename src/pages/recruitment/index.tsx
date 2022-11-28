import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { db } from "../../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import RecruitmentForm from "../../components/recruitmentComp/RecruitmentForm";
import RecruitmentPosts from "../../components/recruitmentComp/RecruitmentPosts";
import { useRecoilValue } from "recoil";
import { authState } from "../../../store";

const Recruitment = () => {
  const currentUser = useRecoilValue(authState);
  const [requests, setRequests] = useState<any>([]);
  const [currentRequests, setCurrentRequests] = useState<any>([]);

  //管理者用投稿リストを取得
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

  //作成者用投稿リストを取得
  useEffect(() => {
    setCurrentRequests(
      requests.filter(
        (request: { author: string }) => request.author === currentUser
      )
    );
  }, [currentUser, requests]);

  return (
    <>
      {currentUser && (
        <>
          <Flex flexDirection="column" alignItems="center">
            <Box
              w={{ base: "100%", md: "800px" }}
              p={6}
              bg="white"
              rounded="md"
            >
              <RecruitmentForm />
            </Box>
            <Box
              w={{ base: "100%", md: "800px" }}
              mt="6"
              p={3}
              bg="white"
              rounded="md"
            >
              <RecruitmentPosts requests={currentRequests} />
            </Box>
          </Flex>
        </>
      )}
    </>
  );
};

export default Recruitment;
