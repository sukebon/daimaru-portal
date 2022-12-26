import React, { useState } from "react";
import { NextPage } from "next";
import { Badge, Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Administrator } from "../../../data";
import { dayOfWeek, starLevel } from "../../../functions";
import { authState, usersState } from "../../../store";
import { RequestTypes } from "../../../types/RequestTypes";
import RecruitmentButton from "./RecruitmentButton";
import RecruitmentEditPost from "./RecruitmentEditPost";
import RecruitmentMemberList from "./RecruitmentMemberList";
import RecruitmentMenu from "./RecruitmentMenu";

type Props = {
  request: RequestTypes;
};

const RecruitmentPost: NextPage<Props> = ({ request }) => {
  const currentUser = useRecoilValue(authState);
  const users = useRecoilValue(usersState);
  const [edit, setEdit] = useState(false);

  // 作成者を表示;
  const authorDispay = (authorId: string) => {
    const usersfilter: any = users.filter(
      (user: { uid: string; name: string }) => user.uid === authorId
    );
    return usersfilter[0]?.name;
  };

  // newラベルを表示(期限三日)
  const newLabel = (time: any) => {
    const currentDay = new Date();
    const requestDay = new Date(time);
    const difference = currentDay.getTime() - requestDay.getTime();
    const date = difference / 86400000;
    return date <= 3 ? true : false;
  };

  return (
    <Box w="100%" p={3} bgColor={request.display === false ? "#999" : "white"}>
      <Flex justifyContent="space-between">
        <Flex flexDirection="column" width="100%">
          {!edit ? (
            <>
              {newLabel(request?.sendAt?.toDate()) && (
                <Badge colorScheme="red" w="100px" textAlign="center" p={1}>
                  New
                </Badge>
              )}
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="2xl">{starLevel(request.level)}</Text>
                {/* メニューボタン  投稿者と管理者のみ表示*/}
                {(currentUser === request.author ||
                  Administrator.includes(currentUser)) && (
                  <RecruitmentMenu
                    request={request}
                    edit={edit}
                    setEdit={setEdit}
                  />
                )}
              </Flex>

              <Heading fontSize="xl" pb={6} mt={2}>
                {request.title}
              </Heading>
              <Flex
                flexDirection={{
                  base: "column",
                  md: "row",
                  lg: "column",
                  "2xl": "row",
                }}
                fontSize="sm"
                gap={2}
              >
                <Text>
                  【開始】{request.startDay}
                  {request.startTime && `-${request.startTime}`}
                  {dayOfWeek(request.startDay)}
                </Text>
                <Text>
                  【終了】{request.endDay}
                  {request.endTime && `-${request.endTime}`}
                  {dayOfWeek(request.endDay)}
                </Text>
                <Text>
                  【募集人数】{request.applicant}人{request.moreless}
                </Text>
              </Flex>
              <Flex flexDirection={{ base: "column", md: "row" }} fontSize="sm">
                <Text>【責任者】{request.person}</Text>
                {Administrator.includes(currentUser) && (
                  <Text>【作成者】{authorDispay(request.author)}</Text>
                )}
              </Flex>
              <Text py={3} whiteSpace="pre-wrap" fontSize="sm">
                {request.content}
              </Text>
              <Flex
                flexDirection={{ base: "column", md: "row" }}
                justifyContent="space-between"
                alignItems="center"
                gap={3}
                py={3}
              >
                <Flex flexWrap="wrap">
                  <RecruitmentMemberList request={request} />
                </Flex>
                <RecruitmentButton request={request} />
              </Flex>
            </>
          ) : (
            //編集画面↓
            <RecruitmentEditPost request={request} setEdit={setEdit} />
          )}
        </Flex>
      </Flex>
      <Divider mb={3} />
    </Box>
  );
};

export default RecruitmentPost;
