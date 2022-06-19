import {
  Box,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from '../../../data';

type Props = {
  currentUser: string;
  isoOfficeUsers: {
    uid: string;
  }[];
  claim: {
    customer: string;
    occurrenceDate: string;
    occurrenceSelect: string;
    occurrenceContent: string;
    amendmentSelect: string;
    amendmentContent: string;
    counterplanSelect: string;
    counterplanContent: string;
    stampStaff: string;
    status: string | number;
    operator: string;
    receptionNum: string;
    receptionDate: string;
    completionDate: string;
  };
  customer: string;
  setCustomer: any;
  occurrenceDate: string;
  setOccurrenceDate: any;
  occurrenceSelect: string;
  setOccurrenceSelect: any;
  occurrenceContent: string;
  setOccurrenceContent: any;
  amendmentSelect: string;
  setAmendmentSelect: any;
  amendmentContent: string;
  setAmendmentContent: any;
  counterplanSelect: string;
  setCounterplanSelect: any;
  counterplanContent: string;
  setCounterplanContent: any;
  receptionNum: string;
  setReceptionNum: any;
  receptionDate: string;
  setReceptionDate: any;
  completionDate: string;
  setCompletionDate: any;
};

const ClaimEdit: NextPage<Props> = ({
  currentUser,
  isoOfficeUsers,
  claim,
  customer,
  setCustomer,
  occurrenceDate,
  setOccurrenceDate,
  occurrenceSelect,
  setOccurrenceSelect,
  occurrenceContent,
  setOccurrenceContent,
  amendmentSelect,
  setAmendmentSelect,
  amendmentContent,
  setAmendmentContent,
  counterplanSelect,
  setCounterplanSelect,
  counterplanContent,
  setCounterplanContent,
  receptionNum,
  setReceptionNum,
  receptionDate,
  setReceptionDate,
  completionDate,
  setCompletionDate,
}) => {
  //事務局のみ編集可
  const enabledOffice = () => {
    const users = isoOfficeUsers.map((user) => {
      return user.uid;
    });
    if (users.includes(currentUser)) return true;
    return false;
  };

  //担当者と事務局のみ編集可
  const enabledStaffAndOffice = () => {
    const users = isoOfficeUsers.map((user) => {
      return user.uid;
    });
    if (claim.stampStaff === currentUser || users.includes(currentUser))
      return true;
    return false;
  };

  //対策記入者と事務局のみ編集許可
  const enabledCounterplanAndOffice = () => {
    const users = isoOfficeUsers.map((user) => {
      return user.uid;
    });
    if (
      (claim.operator === currentUser && Number(claim.status) === 2) ||
      users.includes(currentUser)
    )
      return true;
    return false;
  };
  //上司と事務局のみ編集許可
  const enabledBossAndOffice = () => {
    const users = isoOfficeUsers.map((user) => {
      return user.uid;
    });
    if (
      (claim.operator === currentUser && Number(claim.status) === 4) ||
      users.includes(currentUser)
    )
      return true;
    return false;
  };
  return (
    <>
      {/* 受付NO. 受付日 */}
      <Box>
        <Box mt={10} fontSize='lg' fontWeight='semibold'>
          受付NO
        </Box>
        <Input
          type='text'
          w='100%'
          p={2}
          mt={3}
          placeholder='受付ナンバー 例 4-001'
          value={receptionNum}
          disabled={!enabledOffice()}
          onChange={(e) => setReceptionNum(e.target.value)}
        />
      </Box>
      <Box>
        <Box mt={9} fontSize='lg' fontWeight='semibold'>
          受付日
        </Box>
        <Input
          type='date'
          w='100%'
          p={2}
          mt={3}
          value={receptionDate}
          disabled={!enabledOffice()}
          onChange={(e) => setReceptionDate(e.target.value)}
        />
      </Box>

      {/* 顧客名 */}
      <Box>
        <Box mt={10} fontSize='lg' fontWeight='semibold'>
          顧客名
        </Box>
        <Input
          type='text'
          w='100%'
          p={2}
          mt={3}
          placeholder='顧客名を入力'
          value={customer}
          disabled={!enabledOffice()}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </Box>

      <Box>
        <Box mt={9} fontSize='lg' fontWeight='semibold'>
          発生日
        </Box>

        <Input
          type='date'
          w='100%'
          p={2}
          mt={3}
          value={occurrenceDate}
          disabled={!enabledOffice()}
          onChange={(e) => setOccurrenceDate(e.target.value)}
        />
      </Box>

      {/* 発生内容 */}
      <Box mt={10}>
        <Box as='h2' fontSize='lg' fontWeight='semibold'>
          発生内容
        </Box>
        <Box w='100%' mt={6}>
          <RadioGroup
            colorScheme='green'
            value={occurrenceSelect}
            onChange={(e) => setOccurrenceSelect(e)}
          >
            <Box mt={3}>①製品起因</Box>
            <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
              {claimSelectList1.map(
                (list, index) =>
                  index <= 3 && (
                    <Radio key={list.id} value={list.id}>
                      {list.title}
                    </Radio>
                  )
              )}
            </Stack>
            <Box mt={3}>②受発注</Box>
            <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
              {claimSelectList1.map(
                (list, index) =>
                  index >= 4 &&
                  index <= 6 && (
                    <Radio key={list.id} value={list.id}>
                      {list.title}
                    </Radio>
                  )
              )}
            </Stack>
            <Box mt={3}>③その他</Box>
            <Stack spacing={[1, 5]} direction={['column', 'row']} p={2}>
              {claimSelectList1.map(
                (list, index) =>
                  index === 7 && (
                    <Radio key={list.id} value={list.id}>
                      {list.title}
                    </Radio>
                  )
              )}
            </Stack>
          </RadioGroup>
        </Box>
        <Textarea
          mt={3}
          p={2}
          w='100%'
          placeholder='内容を入力'
          value={occurrenceContent}
          disabled={!enabledStaffAndOffice()}
          onChange={(e) => setOccurrenceContent(e.target.value)}
        />
      </Box>

      {/*修正処置 */}
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
              {claimSelectList2.map((list) => (
                <Radio
                  key={list.id}
                  value={list.id}
                  disabled={!enabledStaffAndOffice()}
                >
                  {list.title}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </Box>
        <Textarea
          mt={3}
          p={2}
          w='100%'
          placeholder='内容を入力'
          value={amendmentContent}
          disabled={!enabledStaffAndOffice()}
          onChange={(e) => setAmendmentContent(e.target.value)}
        />
      </Box>

      {/* 対策 */}
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
              {claimSelectList3.map((list) => (
                <Radio
                  key={list.id}
                  value={list.id}
                  disabled={!enabledCounterplanAndOffice()}
                >
                  {list.title}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
          <Box>
            <Textarea
              mt={3}
              p={2}
              w='100%'
              placeholder='内容を入力'
              value={counterplanContent}
              disabled={!enabledCounterplanAndOffice()}
              onChange={(e) => setCounterplanContent(e.target.value)}
            />
          </Box>
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
      {/* 完了日 */}
      <Box>
        <Box mt={9} fontSize='lg' fontWeight='semibold'>
          完了日
        </Box>
        <Input
          type='date'
          w='100%'
          p={2}
          mt={3}
          value={completionDate}
          disabled={!enabledBossAndOffice()}
          onChange={(e) => setCompletionDate(e.target.value)}
        />
      </Box>
    </>
  );
};

export default ClaimEdit;
