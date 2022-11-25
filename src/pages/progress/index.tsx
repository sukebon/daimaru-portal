import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import EditProgressModal from "../../components/progress/addProgressModal";

const ProgressIndex = () => {
  const [items, setItems] = useState<any>({});
  const [sumTotal, setSumTotal] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [term, setTerm] = useState(0);
  const [deadLineProgress, setDeadLineProgress] = useState(0);
  const [progresses, setProgresses] = useState<any>();

  const handleSwitchChange = (prop: string) => {
    const value = items[prop] ? false : true;
    setItems({ ...items, [prop]: value });
  };

  useEffect(() => {
    const getProgresses = async () => {
      const progressesRef = collection(db, "progresses");
      const querySnapshot = await getDocs(progressesRef);
      setProgresses(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getProgresses();
  }, []);

  const data = [
    { id: 1, title: "企画", point: 20 },
    { id: 2, title: "設計", point: 20 },
    { id: 3, title: "開発", point: 20 },
    { id: 4, title: "テスト", point: 20 },
    { id: 5, title: "完成", point: 20 },
  ];

  useEffect(() => {
    const array = Object.values(items).map((item) => {
      return item;
    });
    let total = array.filter((a) => a == true && a);
    const MAX = 100 / data.length;
    setSumTotal(total.length * MAX);
  }, [items, data.length]);

  // 残日数
  const getRemainingDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const nowTime = now - start;
    const sumTime = end - start;
    const result = Math.floor((sumTime - nowTime) / (1000 * 60 * 60 * 24));
    return result;
  };

  // progressバーの進捗
  const getDeadLineProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const nowTime = now - start;
    const sumTime = end - start;
    const deadline = (nowTime / sumTime) * 100;
    return deadline;
  };

  return (
    <Box w="100%" bg="#f7f7f7" paddingBottom="50px" minH="100vh" p={6}>
      <Container bg="white" p={6}>
        <Flex justifyContent="space-between">
          <Box as="h1" fontSize="2xl">
            進捗状況
          </Box>
          <Link href="/progress/new">
            <a>
              <Button size="sm">新規登録</Button>
            </a>
          </Link>
        </Flex>
      </Container>
      <Container bg="white" mt={3} p={6}>
        {progresses?.map((progress: any) => (
          <>
            <Box>
              <Flex justifyContent="space-between">
                <Text fontSize="xl">{progress.title}</Text>
                <Link href={`/progress/edit/${progress.id}`}>
                  <a>
                    <Button size="sm" colorScheme="blue">
                      編集
                    </Button>
                  </a>
                </Link>
              </Flex>
              <Flex
                mt={6}
                flexDirection={{ base: "column", md: "row" }}
                justifyContent="space-between"
              >
                <Flex gap={6}>
                  <Text>開始： {progress.startDate}</Text>
                  <Text>終了： {progress.endDate}</Text>
                </Flex>
                <Text>
                  残日数
                  {getRemainingDays(progress.startDate, progress.endDate)}日
                </Text>
              </Flex>
              <Progress
                mt={1}
                isAnimated
                hasStripe
                value={getDeadLineProgress(
                  progress.startDate,
                  progress.endDate
                )}
              />

              <Flex mt={6} alignItems="center" justifyContent="space-between">
                <Stack spacing={3}>
                  {data?.map((d) => (
                    <Flex key={d.id} justifyContent="space-between">
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor={d.title} w={12} mb="0">
                          {d.title}
                        </FormLabel>
                        <Switch
                          id={d.title}
                          isChecked={items[d.title]}
                          onChange={() => handleSwitchChange(d.title)}
                        />
                      </FormControl>
                    </Flex>
                  ))}
                </Stack>
                <Flex flexDirection="column" justifyContent="center">
                  <Box textAlign="center">達成率</Box>
                  <Box>
                    <CircularProgress
                      value={sumTotal}
                      color="blue.400"
                      size="180px"
                      thickness="12px"
                    >
                      <CircularProgressLabel>{sumTotal}%</CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </>
        ))}
      </Container>
    </Box>
  );
};

export default ProgressIndex;
