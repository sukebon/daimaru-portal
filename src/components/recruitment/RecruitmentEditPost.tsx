import {
  Button,
  Divider,
  Flex,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { dateTime } from "../../../functions";
import { RequestTypes } from "../../../types/RequestTypes";

type Props = {
  request: RequestTypes;
  setEdit: Function;
};

const RecruitmentEditPost: NextPage<Props> = ({ request, setEdit }) => {
  const [inputs, setInputs] = useState({} as RequestTypes);
  const [initValues, setInitValues] = useState({} as RequestTypes);
  const requestId = request.id;

  // 編集用inputに初期値を入力
  useEffect(() => {
    const obj = {
      title: request.title,
      startDay: request.startDay,
      startTime: request.startTime,
      endDay: request.endDay,
      endTime: request.endTime,
      applicant: request.applicant,
      person: request.person,
      moreless: request.moreless,
      level: request.level,
      content: request.content,
    } as RequestTypes;
    setInputs(obj);
    setInitValues(obj);
  }, [request]);

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

  //編集を確定する
  const confirm = async () => {
    const docRef = doc(db, "requestList", `${requestId}`);
    await updateDoc(docRef, {
      title: inputs.title,
      startDay: inputs.startDay || "未定",
      startTime: inputs.startTime,
      endDay: inputs.endDay || "未定",
      endTime: inputs.endTime,
      applicant: inputs.applicant,
      person: inputs.person,
      moreless: inputs.moreless,
      level: inputs.level,
      content: inputs.content,
    });
    setEdit(false);
  };

  // 編集をキャンセルする;
  const cancel = () => {
    setInputs(initValues as RequestTypes);
    setEdit(false);
  };

  return (
    <Stack spacing={3}>
      <Input
        w="100%"
        name="title"
        value={inputs.title}
        placeholder="タイトル"
        onChange={handleInputChange}
        fontSize="md"
      />
      <Flex gap={3}>
        <Input
          id="startDay"
          name="startDay"
          type="date"
          value={inputs.startDay}
          placeholder="開始時刻"
          onChange={handleInputChange}
        />
        <Select
          name="startTime"
          value={inputs.startTime}
          placeholder="---"
          onChange={handleInputChange}
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
          value={inputs.endDay}
          placeholder="終了時刻"
          onChange={handleInputChange}
        />
        <Select
          name="endTime"
          value={inputs.endTime}
          placeholder="---"
          onChange={handleInputChange}
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
          value={inputs.person}
          placeholder="タスク責任者"
          onChange={handleInputChange}
        />
        <Select
          name="level"
          value={inputs.level}
          placeholder="---"
          onChange={handleInputChange}
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
          value={inputs.applicant}
          placeholder="募集人数"
          onChange={(e) => handleNumberChange(e, "applicant")}
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
          value={inputs.moreless}
          placeholder="---"
          onChange={handleInputChange}
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
        value={inputs.content}
        onChange={handleInputChange}
      >
        {inputs.content}
      </Textarea>
      <Flex gap={3}>
        <Button flex={1} colorScheme="blue" onClick={confirm}>
          OK
        </Button>
        <Button flex={1} colorScheme="red" onClick={cancel}>
          キャンセル
        </Button>
      </Flex>
      <Divider mb={3} />
    </Stack>
  );
};

export default RecruitmentEditPost;
