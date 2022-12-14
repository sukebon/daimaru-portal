import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { Administrator } from "../../../data";
import { db } from "../../../firebase";
import { dateTime, dayOfWeek, starLevel } from "../../../functions";
import { authState, usersState } from "../../../store";
import { RequestTypes } from "../../../types/RequestTypes";
import RecruitmentButton from "./RecruitmentButton";
import RecruitmentMemberList from "./RecruitmentMemberList";
import RecruitmentMenu from "./RecruitmentMenu";

type Props = {
  request: RequestTypes;
};

const RecruitmentPost: NextPage<Props> = ({ request }) => {
  const currentUser = useRecoilValue(authState);
  const users = useRecoilValue(usersState);
  const [edit, setEdit] = useState(false);
  const [inputs, setInputs] = useState({});

  const [title, setTitle] = useState("");
  const [startDay, setStartDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endTime, setEndTime] = useState("");
  const [applicant, setApplicant] = useState("1");
  const [person, setPerson] = useState("");
  const [moreless, setMoreless] = useState("");
  const [level, setLevel] = useState("");
  const [content, setContent] = useState("");

  //タイトルとコンテンツの値を保持する
  const oldTitleContent = (request: any) => {
    setTitle(request.title);
    setStartDay(request.startDay);
    setStartTime(request.startTime);
    setEndDay(request.endDay);
    setEndTime(request.endTime);
    setApplicant(request.applicant);
    setPerson(request.person);
    setMoreless(request.moreless);
    setLevel(request.level);
    setContent(request.content);
  };

  //編集を確定する
  const confirm = async (request: any) => {
    const docRef = doc(db, "requestList", request.id);
    await updateDoc(docRef, {
      title: title,
      startDay: startDay || "未定",
      startTime: startTime,
      endDay: endDay || "未定",
      endTime: endTime,
      applicant: applicant,
      person,
      moreless,
      level: level,
      content: content,
    });
    setEdit(false);
  };

  // 編集をキャンセルする;
  const cancel = (request: any) => {
    setTitle(request.title);
    setStartDay(request.startDay);
    setStartTime(request.startTime);
    setEndDay(request.endDay);
    setEndTime(request.endTime);
    setApplicant(request.applicant);
    setPerson(request.person);
    setMoreless(request.moreless);
    setLevel(request.level);
    setContent(request.content);
    setEdit(false);
  };

  // 作成者を表示;
  const authorDispay = (authorId: string) => {
    const usersfilter: any = users.filter(
      (user: { uid: string; name: string }) => user.uid === authorId
    );
    return usersfilter[0]?.name;
  };

  // newラベルを表示
  const newLabel = (time: any) => {
    const currentDay = new Date();
    const requestDay = new Date(time);
    const difference = currentDay.getTime() - requestDay.getTime();
    const date = difference / 86400000;
    return date <= 3 ? true : false;
  };

  return (
    <Box
      key={request.id}
      w="100%"
      display={request.deleteAt ? "none" : "block"}
    >
      {!request.deleteAt && (
        <Box
          w="100%"
          p={3}
          bgColor={request.display === false ? "#999" : "white"}
        >
          <Flex justifyContent="space-between">
            <Flex flexDirection="column" width="100%">
              {/* 編集画面を表示・非表示 */}
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
                        oldTitleContent={oldTitleContent}
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
                  <Flex
                    flexDirection={{ base: "column", md: "row" }}
                    fontSize="sm"
                  >
                    <Text>【責任者】{request.person}</Text>
                    {Administrator.includes(currentUser) && (
                      <Text>【作成者】{authorDispay(request.author)}</Text>
                    )}
                  </Flex>
                  <Text py={3} whiteSpace={"pre-wrap"} fontSize={"sm"}>
                    {request.content}
                  </Text>
                </>
              ) : (
                //編集画面↓
                <Stack spacing={3}>
                  <Input
                    w="100%"
                    name="title"
                    value={title}
                    placeholder="タイトル"
                    onChange={(e) => setTitle(e.target.value)}
                    fontSize="md"
                  />
                  <Flex gap={3}>
                    <Input
                      id="startDay"
                      name="startDay"
                      type="date"
                      value={startDay}
                      placeholder="開始時刻"
                      onChange={(e) => setStartDay(e.target.value)}
                    />
                    <Select
                      name="startTime"
                      value={startTime}
                      placeholder="---"
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      {dateTime.map((d, index) => (
                        <option key={index} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                  <Flex gap={3}>
                    <Input
                      id="endDay"
                      name="endDay"
                      type="date"
                      value={endDay}
                      placeholder="終了時刻"
                      onChange={(e) => setEndDay(e.target.value)}
                    />
                    <Select
                      name="endTime"
                      value={endTime}
                      placeholder="---"
                      onChange={(e) => setEndTime(e.target.value)}
                    >
                      {dateTime.map((d, index) => (
                        <option key={index} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                  <Flex gap={3}>
                    <Input
                      id="person"
                      name="person"
                      type="string"
                      value={person}
                      placeholder="タスク責任者"
                      onChange={(e) => setPerson(e.target.value)}
                    />
                    <Select
                      name="level"
                      value={level}
                      placeholder="---"
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      <option value="3">★★★</option>
                      <option value="2">★★</option>
                      <option value="1">★</option>
                    </Select>
                  </Flex>
                  <Flex gap={3}>
                    <NumberInput
                      flex={1}
                      name="applicant"
                      value={applicant}
                      placeholder="募集人数"
                      onChange={(e) => setApplicant(e)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Select
                      flex={1}
                      name="moreless"
                      value={moreless}
                      placeholder="---"
                      onChange={(e) => setMoreless(e.target.value)}
                    >
                      <option value="以上">以上</option>
                      <option value="まで">まで</option>
                    </Select>
                  </Flex>
                  <Textarea
                    h={48}
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  >
                    {content}
                  </Textarea>
                  <Flex gap={3}>
                    <Button
                      colorScheme="blue"
                      onClick={() => confirm(request)}
                      flex={1}
                    >
                      OK
                    </Button>
                    <Button
                      flex={1}
                      onClick={() => cancel(request)}
                      colorScheme="red"
                    >
                      キャンセル
                    </Button>
                  </Flex>
                  <Divider mb={3} />
                </Stack>
              )}
            </Flex>
          </Flex>

          {/* 参加メンバー羅列 */}
          {!edit && (
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              justifyContent={"space-between"}
              alignItems="center"
              gap={3}
              py={3}
            >
              <Flex flexWrap={"wrap"}>
                {/* 参加メンバー一覧 */}
                <RecruitmentMemberList request={request} />
              </Flex>

              {/* 参加ボタン */}
              <RecruitmentButton request={request} />
            </Flex>
          )}
          <Divider mb={3} />
        </Box>
      )}
    </Box>
  );
};

export default RecruitmentPost;
