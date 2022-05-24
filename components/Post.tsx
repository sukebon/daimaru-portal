import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextPage } from "next";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase/auth";
import { users } from "../data.js";
import { starLevel, dayOfWeek } from "../functions.js";

interface Props {
  requests: {
    id: string;
    title: string;
    startDay: string;
    startTime: string;
    endEnd: string;
    endTime: string;
    applicant: string;
    person: string;
    moreless: string;
    level: string;
    content: string;
    displayAt: boolean;
    deleteAt: boolean;
    editAt: boolean;
    sendAt: string;
  }[];
}

const Post: NextPage<Props> = ({ requests }) => {
  const [user] = useAuthState(auth);

  //参加する
  const setRequest = async (uid: string) => {
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      member: arrayUnion(user && user.uid),
    });
  };

  //参加を取り消す
  const removeRequest = async (uid: string) => {
    const docRef = doc(db, "requestList", uid);
    await updateDoc(docRef, {
      member: arrayRemove(user && user.uid),
    });
  };

  return (
    <>
      {requests.map((request: any) => (
        <Box key={request.id} style={{ width: "100%" }}>
          {request.displayAt === true && request.deleteAt === false ? (
            <Box
              maxW="sm"
              borderTop="none"
              overflow="hidden"
              margin={"0 auto 0"}
              padding={"20px 0 10px"}
              minW={{ base: "100%" }}
              backgroundColor={"white"}
            >
              <Text fontSize={"2xl"} paddingBottom={"5px"}>
                {starLevel(request.level)}{" "}
              </Text>
              <Heading fontSize={"2xl"} paddingBottom={"10px"}>
                {request.title}
              </Heading>
              <Flex flexDirection={{ base: "column", md: "row" }}>
                <Text marginRight={"10px"}>
                  【開始】{request.startDay}
                  {dayOfWeek(request.startDay)}-{request.startTime}
                </Text>
                <Text marginRight={"10px"}>
                  【終了】{request.endDay}
                  {dayOfWeek(request.endDay)}-{request.endTime}
                </Text>
                <Text marginRight={"10px"}>
                  【募集人数】{request.applicant}人{request.moreless}
                </Text>
                <Text>【責任者】{request.person}</Text>
              </Flex>
              <Text padding={"10px 0"}>{request.content}</Text>

              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                marginTop={"10px"}
                padding={"5px 0 10px"}
              >
                <Flex flexWrap={"wrap"}>
                  {users.map((user: any) => (
                    <Box
                      key={user.uid}
                      padding={"5px"}
                      margin={"10px 10px 10px 0"}
                      borderRadius={"lg"}
                      backgroundColor={"gray.500"}
                      color={"white"}
                      fontSize={{ base: "sm" }}
                      display={
                        !request.member.includes(user.uid) ? "none" : "block"
                      }
                    >
                      {request.member.includes(user.uid) && user.name}
                    </Box>
                  ))}
                </Flex>
                {request.member.includes(user?.uid) ? (
                  <Button
                    onClick={() => removeRequest(request.id)}
                    color="white"
                    bg="#17a6ca"
                    _hover={{ bg: "#17a6ca" }}
                    _focus={{ outline: "none" }}
                    fontSize={{ base: "sm" }}
                  >
                    参加を取り消す
                  </Button>
                ) : (
                  <Button
                    onClick={() => setRequest(request.id)}
                    color="white"
                    bg="orange"
                    _hover={{ bg: "##orange" }}
                    _focus={{ outline: "none" }}
                    fontSize={{ base: "sm" }}
                  >
                    参加する
                  </Button>
                )}
              </Flex>
              <hr />
            </Box>
          ) : (
            ""
          )}
        </Box>
      ))}
    </>
  );
};

export default Post;
