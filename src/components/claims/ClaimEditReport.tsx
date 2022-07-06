/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { NextPage } from 'next';
import React, { useState } from 'react';
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
  claimSelectList4,
} from '../../../data';
import { db, storage } from '../../../firebase';
import { ClaimStateProps } from '../../../lib/ClaimStateProps';

const ClaimEditReport: NextPage<ClaimStateProps> = ({
  queryId,
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
  causeDepartmentSelect,
  setCauseDepartmentSelect,
  setCompletionDate,
  enabledOffice,
  enabledAuthorAndOffice,
  enabledStaffAndOffice,
  enabledCounterplanAndOffice,
  enabledBossAndOffice,
  fileUpload,
  setFileUpload,
  imageUrl,
  setImageUrl,
  imagePath,
  setImagePath,
}) => {
  console.log('fileUpload', fileUpload);
  //添付ファイルをアップロード
  const onFileUpload = () => {
    const result = window.confirm('アップロードして宜しいでしょうか？');
    if (!result) return;

    const file = fileUpload[0];
    setImageUrl(window.URL.createObjectURL(file));

    const storageRef = ref(
      storage,
      `images/claims/${queryId}/${fileUpload[0].name}`
    );
    uploadBytes(storageRef, file).then((snapshot: any) => {
      getDownloadURL(
        ref(storage, `images/claims/${queryId}/${fileUpload[0].name}`)
      ).then((url) => {
        const docRef = doc(db, 'claimList', `${queryId}`);
        updateDoc(docRef, {
          imageUrl: url,
          imagePath: storageRef.fullPath,
        });
        setFileUpload(null);
        setImagePath(storageRef.fullPath);
        console.log('アップロード成功');
      });
    });
  };

  const onFileDelete = () => {
    const result = window.confirm('削除して宜しいでしょうか？');
    if (!result) return;
    setFileUpload('');
    setImageUrl('');
    const docRef = doc(db, 'claimList', `${queryId}`);
    updateDoc(docRef, {
      imageUrl: '',
      imagePath: '',
    }).then(() => {
      const desertRef = ref(storage, imagePath);
      deleteObject(desertRef)
        .then(() => {
          console.log('削除成功');
        })
        .catch((error) => {
          console.log(error);
        });
    });
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
                    <Radio
                      key={list.id}
                      value={list.id}
                      isDisabled={!enabledAuthorAndOffice()}
                    >
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
                    <Radio
                      key={list.id}
                      value={list.id}
                      isDisabled={!enabledAuthorAndOffice()}
                    >
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
                    <Radio
                      key={list.id}
                      value={list.id}
                      isDisabled={!enabledAuthorAndOffice()}
                    >
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
          disabled={!enabledAuthorAndOffice()}
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
                  isDisabled={!enabledStaffAndOffice()}
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

      {/* 起因部署 */}
      <Box mt={9}>
        <Flex as='h2' fontSize='lg' fontWeight='semibold'>
          起因部署
        </Flex>
        <Box w='100%' mt={3}>
          <RadioGroup
            colorScheme='green'
            value={causeDepartmentSelect}
            onChange={(e) => setCauseDepartmentSelect(e)}
          >
            <Stack
              spacing={[1, 5]}
              direction={['column', 'row']}
              px={2}
              py={{ md: '2' }}
            >
              {claimSelectList4.map(
                (list, index) =>
                  index < 4 && (
                    <Radio
                      key={list.id}
                      value={list.id}
                      isDisabled={!enabledStaffAndOffice()}
                    >
                      {list.title}
                    </Radio>
                  )
              )}
            </Stack>
            <Stack
              spacing={[1, 5]}
              direction={['column', 'row']}
              px={2}
              py={{ md: '2' }}
            >
              {claimSelectList4.map(
                (list, index) =>
                  index >= 4 && (
                    <Radio
                      key={list.id}
                      value={list.id}
                      isDisabled={!enabledStaffAndOffice()}
                    >
                      {list.title}
                    </Radio>
                  )
              )}
            </Stack>
          </RadioGroup>
        </Box>
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
                  isDisabled={!enabledCounterplanAndOffice()}
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
      <Box w='100%' mt={9}>
        {imageUrl && (
          <Box mt={9} p={6} boxShadow='xs'>
            <a href={imageUrl} target='_blank' rel='noreferrer'>
              <img src={imageUrl} alt='画像' width='100%' height='100%' />
            </a>
          </Box>
        )}
      </Box>

      {imageUrl ? (
        <Flex w={'100%'} justifyContent='center'>
          <Button
            mt={3}
            mx='auto'
            colorScheme='red'
            onClick={() => {
              onFileDelete();
            }}
          >
            削除
          </Button>
        </Flex>
      ) : (
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems='center'
          justifyContent='center'
        >
          <Box w={'100%'} p={3}>
            <input
              type='file'
              accept='.png, .jpeg, .jpg'
              onChange={(e) => {
                setFileUpload(e.target.files);
              }}
            />
          </Box>
          {fileUpload && fileUpload.length == 1 && (
            <Flex w={'100%'} p={3}>
              <Button
                mr={3}
                colorScheme='telegram'
                onClick={() => onFileUpload()}
              >
                アップロード
              </Button>
            </Flex>
          )}
        </Flex>
      )}
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

export default ClaimEditReport;
