import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';

const ClaimInputCounterplan = ({
  counterplanSelect,
  setCounterplanSelect,
  counterplanContent,
  setCounterplanContent,
}: any) => {
  return (
    <>
      <Box mt={9}>
        <Flex as='h2' fontSize='lg' fontWeight='semibold'>
          対策
        </Flex>
        <Box w='100%' mt={3}>
          <RadioGroup
            colorScheme='green'
            defaultValue='1'
            value={counterplanSelect}
            onChange={(e) => setCounterplanSelect(e)}
          >
            <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
              <Radio value='1'>修正処置のみ</Radio>
              <Radio value='2'>書面提出</Radio>
              <Radio value='3'>改善の機会</Radio>
              <Radio value='4'>是正処置</Radio>
            </Stack>
          </RadioGroup>
          <Textarea
            mt={3}
            p={2}
            w='100%'
            placeholder='内容を入力'
            value={counterplanContent}
            onChange={(e) => setCounterplanContent(e.target.value)}
          />
        </Box>
      </Box>
    </>
  );
};

export default ClaimInputCounterplan;
