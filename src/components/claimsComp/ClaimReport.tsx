import { Box, Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from '../../../data';

type Props = {
  claim: {
    customer: string;
    occurrenceDate: string;
    occurrenceSelect: string;
    occurrenceContent: string;
    amendmentSelect: string;
    amendmentContent: string;
    counterplanSelect: string;
    counterplanContent: string;
  };
};

const ClaimReport: NextPage<Props> = ({ claim }) => {
  return (
    <>
      {/* クレーム報告書タイトル */}
      <Box
        as='h1'
        w='100%'
        p={3}
        fontSize='28px'
        fontWeight='semibold'
        textAlign='center'
      >
        クレーム報告書
      </Box>

      {/* 顧客名 */}
      <Box>
        <Box mt={10} fontSize='lg' fontWeight='semibold'>
          顧客名
        </Box>
        <Box w='100%' px={2} mt={2}>
          <Box>{claim.customer}</Box>
        </Box>
      </Box>
      <Box>
        <Box mt={9} fontSize='lg' fontWeight='semibold'>
          発生日
        </Box>
        <Box w='100%' px={2} mt={2}>
          <Box>{claim.occurrenceDate}</Box>
        </Box>
      </Box>

      {/* 発生内容 */}
      <Box mt={10}>
        <Box as='h2' fontSize='lg' fontWeight='semibold'>
          発生内容
        </Box>
        <Box w='100%' px={2} mt={2}>
          {claimSelectList1.map((list) => (
            <Box key={list.id}>
              {list.id === claim.occurrenceSelect &&
                `${claim.occurrenceSelect && '■'}${list.headline}  ${
                  list.title
                }`}
            </Box>
          ))}
        </Box>
        <Box px={2} mt={2}>
          {claim.occurrenceContent}
        </Box>
      </Box>

      {/*修正処置 */}
      <Box mt={10}>
        <Flex as='h2' fontSize='lg' fontWeight='semibold'>
          修正処置
        </Flex>
        <Box w='100%' px={2} mt={2}>
          {claimSelectList2.map((list) => (
            <Box key={list.id}>
              {list.id === claim.amendmentSelect &&
                `${claim.amendmentSelect && '■'}${list.title}`}
            </Box>
          ))}
          <Box mt={2}>{claim.amendmentContent}</Box>
        </Box>
      </Box>

      {/* 対策 */}
      <Box mt={10}>
        <Flex as='h2' fontSize='lg' fontWeight='semibold'>
          対策
        </Flex>
        <Box w='100%' px={2} mt={2}>
          {claimSelectList3.map((list) => (
            <Box key={list.id}>
              {list.id === claim.counterplanSelect &&
                `${claim.counterplanSelect && '■'}${list.title}`}
            </Box>
          ))}
          <Box>{claim.counterplanContent}</Box>
        </Box>
      </Box>

      {/* 添付書類 */}
      {/* <Box w='100%' mt={9}>
        <Box w='100%' mt={6}>
          <Box mr={3} fontSize='lg' fontWeight='semibold'>
            添付書類
          </Box>
          <Box mt={3}>
            ①
            <input type='file' accept='image/png, image/jpeg' />
          </Box>
          <Box mt={3}>
            ②
            <input type='file' accept='image/png, image/jpeg' />
          </Box>
          <Box mt={3}>
            ③
            <input type='file' accept='image/png, image/jpeg' />
          </Box>
        </Box>
      </Box> */}
    </>
  );
};

export default ClaimReport;
