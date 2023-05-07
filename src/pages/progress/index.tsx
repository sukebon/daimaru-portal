import {
  Badge,
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { Administrator } from "../../../data";
import { ProgressContent, ProgressData } from "../../../types";
import { useAuthStore } from "../../../store/useAuthStore";
import { ProgressEdit } from "@/components/progress/ProgressEdit";

const ProgressIndex = () => {
  const [progresses, setProgresses] = useState<ProgressData[]>([]);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    const getProgresses = async () => {
      const q = query(collection(db, "progresses"), orderBy('createdAt', "desc"));
      onSnapshot(q, (querySnapshot) => {
        setProgresses(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          } as ProgressData))
        );
      });
    };
    getProgresses();
  }, []);

  // 達成率の取得（％）
  const getAchieveRate = (array: ProgressContent[]) => {
    const newArray = array.filter(({ result }) => result === true);
    const MAX = 100 / array.length || 0;
    return Math.round(newArray?.length * MAX);
  };

  // 残日数
  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const gap = end - now;
    if (gap < 0) return 0;
    const result = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return result;
  };

  // progressバーの進捗
  const getDeadLineProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    let nowTime = now - start;
    nowTime = Math.floor(nowTime / (1000 * 60 * 60 * 24));
    let totalTime = end - start;
    totalTime = Math.floor(totalTime / (1000 * 60 * 60 * 24));
    const deadline = (nowTime / totalTime) * 100;
    return deadline;
  };

  const deleteProgress = async (progressId: string) => {
    const result = window.confirm("削除して宜しいでしょうか");
    if (!result) return;
    const docsRef = doc(db, "progresses", `${progressId}`);
    try {
      await deleteDoc(docsRef);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <>
      <Container maxW="1000px" bg="white" p={6}>
        <Flex justify="space-between">
          <Box as="h1" fontSize="2xl">
            進捗状況
          </Box>
          <Link href="/progress/new">
            <Button size="sm" colorScheme="blue">新規登録</Button>
          </Link>
        </Flex>
      </Container>
      <Container maxW="1000px" mt={3} p={0}>
        <Flex flexWrap="wrap" w="100%" gap={6}>
          {progresses?.map((progress) => (
            <>
              <Box
                w={{ base: "100%", md: "calc(50% - 0.75rem)" }}
                bg="white"
                mt={3}
                p={6}
              >
                <Box>
                  <Flex align="center" justify="space-between">
                    <Text fontSize="xl">{progress.title}</Text>
                    <Flex gap={3}>
                      {Administrator.includes(currentUser) && (
                        <>
                          <ProgressEdit progress={progress} />
                          <FaTrashAlt
                            color="gray"
                            cursor="pointer"
                            onClick={() => deleteProgress(progress.id)}
                          />
                        </>
                      )}
                    </Flex>
                  </Flex>
                  <Flex
                    mt={6}
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                  >
                    <Flex gap={6}>
                      <Text>開始：{progress.startDate}</Text>
                      <Text>終了：{progress.endDate}</Text>
                    </Flex>
                    <Text>
                      残日数
                      {getRemainingDays(progress.endDate)}日
                    </Text>
                  </Flex>
                  <Progress
                    mt={2}
                    isAnimated
                    hasStripe
                    value={getDeadLineProgress(
                      progress.startDate,
                      progress.endDate
                    )}
                  />

                  <Flex
                    mt={6}
                    align="center"
                    justify="space-between"
                  >
                    <Stack spacing={3}>
                      {progress?.contents.map(
                        ({ title, result }, index: number) => (
                          <Flex key={index} justify="space-between">
                            <FormControl display="flex" alignItems="center">
                              <FormLabel
                                htmlFor={title}
                                minW={12}
                                mb="0"
                              >
                                {title}
                              </FormLabel>
                              {result && (
                                <Badge
                                  px={2}
                                  variant="solid"
                                  colorScheme="blue"
                                >
                                  完了
                                </Badge>
                              )}
                            </FormControl>
                          </Flex>
                        )
                      )}
                    </Stack>
                    <Flex direction="column" justify="center">
                      <Box textAlign="center">進捗率</Box>
                      <Box>
                        <CircularProgress
                          value={getAchieveRate(progress?.contents)}
                          color="blue.400"
                          size="180px"
                          thickness="12px"
                        >
                          <CircularProgressLabel>
                            {getAchieveRate(progress?.contents)}%
                          </CircularProgressLabel>
                        </CircularProgress>
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            </>
          ))}
        </Flex>
      </Container>
    </>
  );
};

export default ProgressIndex;
