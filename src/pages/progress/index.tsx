import {
  Box,
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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const ProgressIndex = () => {
  const [items, setItems] = useState<any>({});
  const [sumTotal, setSumTotal] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [term, setTerm] = useState(0);
  const [deadLineProgress, setDeadLineProgress] = useState(0);

  const handleSwitchChange = (prop: string) => {
    const value = items[prop] ? false : true;
    setItems({ ...items, [prop]: value });
  };

  const data = [
    { id: 1, title: '企画', point: 20 },
    { id: 2, title: '設計', point: 20 },
    { id: 3, title: '開発', point: 20 },
    { id: 4, title: 'テスト', point: 20 },
    { id: 5, title: '完成', point: 20 },
  ];

  useEffect(() => {
    const array = Object.values(items).map((item) => {
      return item;
    });
    let total = array.filter((a) => a == true && a);
    const MAX = 100 / data.length;
    setSumTotal(total.length * MAX);
  }, [items]);

  useEffect(() => {
    const start = new Date('2022-10-20').getTime();
    const end = new Date('2023-1-31').getTime();
    const now = new Date().getTime();
    const nowTime = now - start;
    const sumTime = end - start;
    const deadline = (nowTime / sumTime) * 100;
    setDeadLineProgress(deadline);
    setTerm(Math.floor(sumTime / (1000 * 60 * 60 * 24)));
    setRemainingDays(Math.floor((sumTime - nowTime) / (1000 * 60 * 60 * 24)));
  }, [items]);

  return (
    <Box w='100%' bg='#f7f7f7' paddingBottom='50px' minH='100vh' p={6}>
      <Container bg='white' p={6}>
        <Box as='h1' fontSize='2xl'>
          進捗状況
        </Box>
      </Container>
      <Container bg='white' mt={3} p={6}>
        <Box>
          <Text fontSize='xl'>■ 学販アプリ</Text>
          <Flex
            mt={2}
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent='space-between'
          >
            <Flex gap={6}>
              <Text>開始： 2022-10-20</Text>
              <Text>終了： 2022-01-31</Text>
            </Flex>
            <Text>残日数 {remainingDays}日</Text>
          </Flex>
          <Progress mt={1} isAnimated hasStripe value={deadLineProgress} />

          <Flex mt={6} alignItems='center' justifyContent='space-between'>
            <Stack spacing={3}>
              {data?.map((d) => (
                <Flex key={d.id} justifyContent='space-between'>
                  <FormControl display='flex' alignItems='center'>
                    <FormLabel htmlFor={d.title} w={12} mb='0'>
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
            <Flex flexDirection='column' justifyContent='center'>
              <Box textAlign='center'>達成率</Box>
              <Box>
                <CircularProgress
                  value={sumTotal}
                  color='blue.400'
                  size='180px'
                  thickness='12px'
                >
                  <CircularProgressLabel>{sumTotal}%</CircularProgressLabel>
                </CircularProgress>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default ProgressIndex;
