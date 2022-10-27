import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { dateTime } from "../../../functions";
import { useRouter } from "next/router";
// import { dateTime } from '../../../date';

const Form = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
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

  const addRequest = async () => {
    try {
      const docRef = await addDoc(collection(db, "requestList"), {
        title: title,
        startDay: startDay,
        startTime: startTime,
        endDay: endDay,
        endTime: endTime,
        applicant: applicant,
        person: person,
        moreless: moreless,
        level: level,
        content: content,
        member: [],
        deleteAt: false,
        display: true,
        editAt: false,
        sendAt: serverTimestamp(),
        author: user?.uid,
        recruitment: true,
      });
      setTitle("");
      setStartDay("");
      setStartTime("");
      setEndDay("");
      setEndTime("");
      setApplicant("");
      setPerson("");
      setMoreless("");
      setLevel("");
      setContent("");
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      router.push("/");
    }
  };

  return (
    <>
      {user && (
        <Flex flexDirection="column" alignItems="center" p={0} w="100%">
          <Box minW="100%" my={6}>
            <Flex alignItems="center" justifyContent="space-between" mb={6}>
              <Heading>お手伝い依頼</Heading>
              <Link href="/">
                <a>
                  <Button>トップへ戻る</Button>
                </a>
              </Link>
            </Flex>
            <FormControl>
              <FormLabel htmlFor="title">タイトル</FormLabel>
              <Input
                id="title"
                type="text"
                value={title}
                placeholder="タイトルを入力してください。"
                bg="white"
                mb={6}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Flex flexDirection={{ base: "column", md: "row" }}>
                <Flex flex={1}>
                  <Box flex={1} mr={1}>
                    <FormLabel htmlFor="startDay">開始時刻</FormLabel>
                    <Input
                      id="startDay"
                      type="date"
                      value={startDay}
                      placeholder="開始時刻"
                      bg="white"
                      mb={6}
                      onChange={(e) => setStartDay(e.target.value)}
                    />
                  </Box>
                  <Box flex={1} mr={{ base: "0", md: 1 }}>
                    <FormLabel htmlFor="startTime">　</FormLabel>
                    <Select
                      value={startTime}
                      placeholder="---"
                      bg="white"
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      {dateTime.map((d, index) => (
                        <option key={index} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
                <Flex flex={1}>
                  <Box flex={1} mr={1}>
                    <FormLabel htmlFor="endDay">終了時刻</FormLabel>
                    <Input
                      id="endDay"
                      type="date"
                      value={endDay}
                      placeholder="終了時刻"
                      bg="white"
                      mb={6}
                      onChange={(e) => setEndDay(e.target.value)}
                    />
                  </Box>
                  <Box flex={1} mr={{ base: "0", md: 1 }}>
                    <FormLabel htmlFor="endTime">　</FormLabel>
                    <Select
                      value={endTime}
                      placeholder="---"
                      bg="white"
                      onChange={(e) => setEndTime(e.target.value)}
                    >
                      {dateTime.map((d, index) => (
                        <option key={index} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
              </Flex>
              <Flex flexDirection={{ base: "column", md: "row" }}>
                <Flex flex={1}>
                  <Box flex={1} mr={1}>
                    <FormLabel htmlFor="person">タスク責任者</FormLabel>
                    <Input
                      id="person"
                      type="string"
                      value={person}
                      placeholder="タスク責任者"
                      bg="white"
                      mb={6}
                      onChange={(e) => setPerson(e.target.value)}
                    />
                  </Box>
                  <Box flex={1} mr={{ base: "0", md: 1 }}>
                    <FormLabel htmlFor="level">レベル</FormLabel>
                    <Select
                      value={level}
                      placeholder="---"
                      bg="white"
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      <option value="3">★★★</option>
                      <option value="2">★★</option>
                      <option value="1">★</option>
                    </Select>
                  </Box>
                </Flex>
                <Flex flex={1}>
                  <Box flex={1} mr={1} mb={{ base: 6, md: "0" }}>
                    <FormLabel htmlFor="applicant">募集人数</FormLabel>
                    <NumberInput
                      value={applicant}
                      placeholder="募集人数"
                      bg="white"
                      onChange={(e) => setApplicant(e)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>
                  <Box flex={1}>
                    <FormLabel htmlFor="moreless">　</FormLabel>
                    <Select
                      value={moreless}
                      placeholder="---"
                      bg="white"
                      onChange={(e) => setMoreless(e.target.value)}
                    >
                      <option value="以上">以上</option>
                      <option value="まで">まで</option>
                    </Select>
                  </Box>
                </Flex>
              </Flex>
              <FormLabel htmlFor="content">内容</FormLabel>
              <Textarea
                id="content"
                value={content}
                placeholder="内容を入力してください。"
                backgroundColor={"white"}
                mb={6}
                h={48}
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>
            <Button
              width="100%"
              rounded="md"
              colorScheme="blue"
              type="submit"
              onClick={addRequest}
              disabled={title && content && person ? false : true}
            >
              登録
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default Form;
