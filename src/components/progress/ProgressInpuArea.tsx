import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, FC } from "react";
import { db } from "../../../firebase";
import { ProgressData } from "../../../types";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

type Props = {
  progress?: ProgressData;
  type: "new" | "edit";
  onClose?: Function;
};

type Inputs = ProgressData;

export const ProgressInpuArea: FC<Props> = ({
  progress,
  type,
  onClose
}) => {
  const router = useRouter();
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<Inputs>({
    defaultValues: progress
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "contents",
  });
  const onSubmit: SubmitHandler<Inputs> = data => {
    switch (type) {
      case "new":
        addProgress(data);
        return;
      case "edit":
        updateProgress(data);
        return;
    }
  };

  const addTitle = () => {
    append({ title: "", result: false });
  };

  const removeTitle = (index: number) => {
    remove(index);
  };

  const addProgress = async (data: ProgressData) => {
    const result = window.confirm("登録して宜しいでしょうか");
    if (!result) return;
    const docsRef = collection(db, "progresses");
    try {
      await addDoc(docsRef, {
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        contents: data?.contents || [],
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      router.push("/progress");
    }
  };

  const updateProgress = async (data: ProgressData) => {
    const result = window.confirm("更新して宜しいでしょうか");
    if (!result) return;
    const docRef = doc(db, "progresses", `${progress?.id}`);
    try {
      await updateDoc(docRef, {
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        contents: data?.contents || [],
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      onClose && onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={12} spacing={6}>
        <Box>
          <Text>タイトル</Text>
          <Input
            {...register('title', { required: true })}
          />
          {errors.title && <Box mt={1} color="red">タイトルを入力してください</Box>}
        </Box>
        <Flex gap={6}>
          <Box w="100%">
            <Text>開始日</Text>
            <Input
              type="date"
              {...register('startDate')}
            />
          </Box>
          <Box w="100%">
            <Text>終了日</Text>
            <Input
              type="date"
              {...register('endDate')}
            />
          </Box>
        </Flex>
        <Box>
          <Flex>
            <Text w="100%">項目</Text>
            <Text w="80px">達成</Text>
            <Text w="50px">削除</Text>
          </Flex>
          {fields.map((field, index) => (
            <Flex key={index} mt={2} gap={6} w="100%" align="center">
              <Input
                w="100%"
                {...register(`contents.${index}.title`)}
              />
              <Box w="80px" textAlign="center">
                <Switch
                  {...register(`contents.${index}.result`)}
                />
              </Box>
              <Box w="50px" textAlign="center">
                <FaTrashAlt
                  cursor="pointer"
                  onClick={() => removeTitle(index)}
                />
              </Box>
            </Flex>
          ))}
          <Button w={36} mt={2} onClick={addTitle}>
            <FaPlusCircle />
            <Box ml={2} as="span">
              項目を追加
            </Box>
          </Button>
        </Box>
        <Button type="submit" w="full" colorScheme="blue">登録</Button>
      </Stack>
    </form>
  );
};
