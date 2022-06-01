/* eslint-disable react/display-name */
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { memo, useState } from "react";
import { starLevel, dayOfWeek } from "../functions.js";
import RecruitmentButton from "./RecruitmentButton";
import RecruitmentMemberList from "./RecruitmentMemberList";

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
    recruitment: boolean;
  }[];
  currentUser: string;
}

const RecruitmentPost: NextPage<Props> = memo(({ requests }) => {
  return (
    <Box
      mt={{ base: "0", lg: "6" }}
      padding={"20px"}
      border="1px"
      borderColor={"gray.200"}
      borderRadius={"lg"}
      backgroundColor={"white"}
    >
      <Text fontSize="2xl" mt="1" ml="1">
        お手伝い依頼一覧
      </Text>
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
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Text fontSize={"2xl"} paddingBottom={"5px"}>
                  {starLevel(request.level)}{" "}
                </Text>
              </Flex>
              <Heading fontSize={"2xl"} paddingBottom={"10px"}>
                {request.title}
              </Heading>
              <Flex flexDirection={{ base: "column", md: "row" }}>
                <Text marginRight={"10px"}>
                  【開始】{request.startDay}（{dayOfWeek(request.startDay)}）
                  {request.startTime}
                </Text>
                <Text marginRight={"10px"}>
                  【終了】{request.endDay}（{dayOfWeek(request.endDay)}）
                  {request.endTime}
                </Text>
                <Text marginRight={"10px"}>
                  【募集人数】{request.applicant}人{request.moreless}
                </Text>
              </Flex>
              <Flex flexDirection={{ base: "column", md: "row" }}>
                <Text>【責任者】{request.person}</Text>
              </Flex>
              <Text padding={"10px 0"} whiteSpace={"pre-wrap"}>
                {request.content}
              </Text>

              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                marginTop={"10px"}
                padding={"5px 0 10px"}
                flexDirection={{ base: "column", md: "row" }}
              >
                <Flex flexWrap={"wrap"}>
                  {/* 参加メンバー一覧 */}
                  <RecruitmentMemberList request={request} />
                </Flex>
                {/* 参加ボタン */}
                <RecruitmentButton request={request} />
              </Flex>
              <hr />
            </Box>
          ) : (
            ""
          )}
        </Box>
      ))}
    </Box>
  );
});

export default RecruitmentPost;
