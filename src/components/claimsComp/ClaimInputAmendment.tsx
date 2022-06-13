import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';

const ClaimInputAmendment = ({
  amendmentSelect,
  setAmendmentSelect,
  amendmentContent,
  setAmendmentContent,
}: any) => {
  return (
    <>
      <Box mt={10}>
        <Flex as='h2' fontSize='lg' fontWeight='semibold'>
          修正処置
        </Flex>
        <Box w='100%' mt={3}>
          <RadioGroup
            colorScheme='green'
            defaultValue='1'
            value={amendmentSelect}
            onChange={(e) => setAmendmentSelect(e)}
          >
            <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
              <Radio value='1'>商品再手配</Radio>
              <Radio value='2'>顧客の説明・交渉</Radio>
              <Radio value='3'>伝票再発行</Radio>
              <Radio value='4'>その他</Radio>
            </Stack>
          </RadioGroup>
          <Textarea
            mt={3}
            p={2}
            w='100%'
            placeholder='内容を入力'
            value={amendmentContent}
            onChange={(e) => setAmendmentContent(e.target.value)}
          />
        </Box>
      </Box>
    </>
  );
};

export default ClaimInputAmendment;
