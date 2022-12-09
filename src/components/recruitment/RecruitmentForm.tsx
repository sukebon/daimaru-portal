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
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { dateTime } from "../../../functions";
import { useRouter } from "next/router";

const Form = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [inputs, setInputs] = useState({
    title: "",
    startDay: "",
    startTime: "",
    endDay: "",
    endTime: "",
    applicant: "1",
    person: "",
    moreless: "",
    level: "",
    content: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs({ ...inputs, [name]: value });
  };

  const handleNumberChange = (e: string, name: string) => {
    const value = e;
    setInputs({ ...inputs, [name]: value });
  };

  const addRequest = async () => {
    try {
      await addDoc(collection(db, "requestList"), {
        title: inputs.title,
        startDay: inputs.startDay,
        startTime: inputs.startTime,
        endDay: inputs.endDay,
        endTime: inputs.endTime,
        applicant: inputs.applicant,
        person: inputs.person,
        moreless: inputs.moreless,
        level: inputs.level,
        content: inputs.content,
        member: [],
        deleteAt: false,
        display: true,
        editAt: false,
        sendAt: serverTimestamp(),
        author: user?.uid,
        recruitment: true,
      });
      setInputs({
        title: "",
        startDay: "",
        startTime: "",
        endDay: "",
        endTime: "",
        applicant: "1",
        person: "",
        moreless: "",
        level: "",
        content: "",
      });
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
                name="title"
                type="text"
                value={inputs.title}
                placeholder="タイトルを入力してください。"
                bg="white"
                mb={6}
                onChange={handleInputChange}
              />
              <Flex flexDirection={{ base: "column", md: "row" }}>
                <Flex flex={1}>
                  <Box flex={1} mr={1}>
                    <FormLabel htmlFor="startDay">開始時刻</FormLabel>
                    <Input
                      id="startDay"
                      name="startDay"
                      type="date"
                      value={inputs.startDay}
                      placeholder="開始時刻"
                      bg="white"
                      mb={6}
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box flex={1} mr={{ base: "0", md: 1 }}>
                    <FormLabel htmlFor="startTime">　</FormLabel>
                    <Select
                      name="startTime"
                      value={inputs.startTime}
                      placeholder="---"
                      bg="white"
                      onChange={handleInputChange}
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
                      name="endDay"
                      type="date"
                      value={inputs.endDay}
                      placeholder="終了時刻"
                      bg="white"
                      mb={6}
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box flex={1} mr={{ base: "0", md: 1 }}>
                    <FormLabel htmlFor="endTime">　</FormLabel>
                    <Select
                      name="endTime"
                      value={inputs.endTime}
                      placeholder="---"
                      bg="white"
                      onChange={handleInputChange}
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
                      name="person"
                      type="string"
                      value={inputs.person}
                      placeholder="タスク責任者"
                      bg="white"
                      mb={6}
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box flex={1} mr={{ base: "0", md: 1 }}>
                    <FormLabel htmlFor="level">レベル</FormLabel>
                    <Select
                      name="level"
                      value={inputs.level}
                      placeholder="---"
                      bg="white"
                      onChange={handleInputChange}
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
                      name="applicant"
                      value={inputs.applicant}
                      placeholder="募集人数"
                      bg="white"
                      onChange={(e) => handleNumberChange(e, "applicant")}
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
                      name="moreless"
                      value={inputs.moreless}
                      placeholder="---"
                      bg="white"
                      onChange={handleInputChange}
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
                name="content"
                value={inputs.content}
                placeholder="内容を入力してください。"
                backgroundColor="white"
                mb={6}
                h={48}
                onChange={handleInputChange}
              />
            </FormControl>
            <Button
              width="100%"
              rounded="md"
              colorScheme="blue"
              type="submit"
              onClick={addRequest}
              disabled={
                inputs.title && inputs.content && inputs.person ? false : true
              }
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
