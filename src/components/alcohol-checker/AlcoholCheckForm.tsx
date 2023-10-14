import React, { FC } from "react";
import {
  Box,
  Radio,
  RadioGroup,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useForm, SubmitHandler } from "react-hook-form";
import { db } from "../../../firebase";
import { format } from "date-fns";
import { useAuthStore } from "../../../store/useAuthStore";

type Inputs = {
  alcoholCheck1: string;
  alcoholCheck2: string;
  alcoholCheckValue: number;
};

type Props = {
  onClose: () => void;
  pageType: "NEW" | "EDIT";
  postId?: string;
  defaultValues: Inputs;
};

export const AlcoholCheckForm: FC<Props> = ({
  onClose,
  pageType,
  postId,
  defaultValues,
}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const todayDate = format(new Date(), "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultValues,
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    switch (pageType) {
      case "NEW":
        await setAlcoholCheckList(data);
        break;
      case "EDIT":
        await updateAlcoholChecker(data);
    }
    onClose();
  };

  //アルコールチェック登録
  const setAlcoholCheckList = async (data: Inputs) => {
    try {
      const docListRef = doc(db, "alcoholCheckList", todayDate);
      const docSnap = await getDoc(docListRef);

      if (docSnap.exists()) {
        await updateDoc(docListRef, {
          member: arrayUnion(currentUser),
        });
      } else {
        await setDoc(docListRef, {
          id: todayDate,
          member: arrayUnion(currentUser),
        });
      }

      await addDoc(collection(db, "alcoholCheckData"), {
        date: todayDate,
        uid: currentUser,
        createdAt: serverTimestamp(),
        alcoholCheck1: data.alcoholCheck1,
        alcoholCheck2: data.alcoholCheck2,
        alcoholCheckValue: Number(data.alcoholCheckValue) || 0,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateAlcoholChecker = (data: Inputs) => {
    if (!postId) return;
    const docRef = doc(db, "alcoholCheckData", postId);
    updateDoc(docRef, {
      alcoholCheck1: data.alcoholCheck1,
      alcoholCheck2: data.alcoholCheck2,
      alcoholCheckValue: Number(data.alcoholCheckValue) || 0,
      updatedAt: serverTimestamp(),
    });
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <Box>
          <Box>アルコールの検査はしましたか？</Box>
          <RadioGroup defaultValue={defaultValues.alcoholCheck1}>
            <Stack spacing={8} direction="row" mt={1}>
              <Radio colorScheme="red" value="0" {...register("alcoholCheck1")}>
                No
              </Radio>
              <Radio
                colorScheme="green"
                value="1"
                {...register("alcoholCheck1")}
              >
                Yes
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Box mt={3}>
          <Box>酒気帯び</Box>
          <RadioGroup mt={1} defaultValue={defaultValues.alcoholCheck2}>
            <Stack spacing={9} direction="row">
              <Radio colorScheme="red" value="0" {...register("alcoholCheck2")}>
                有
              </Radio>
              <Radio
                colorScheme="green"
                value="1"
                {...register("alcoholCheck2")}
              >
                無
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Box mt={3}>
          <Box>測定結果（mg）</Box>
          <NumberInput defaultValue={0} min={0} max={100} step={0.01}>
            <NumberInputField
              mt={1}
              {...register("alcoholCheckValue")}
              onFocus={focusHandler}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button width="100px" colorScheme="facebook" type="submit">
          {pageType === "NEW" ? "提出" : "更新"}
        </Button>
      </ModalFooter>
    </form>
  );
};
