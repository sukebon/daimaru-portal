import { Button, Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  queryId: string | string[] | undefined;
  edit: boolean;
  isEdit: any;
  setEdit: any;
  updateClaim: any;
  editCancel: any;
};

const ClaimEditButton: NextPage<Props> = ({
  queryId,
  edit,
  isEdit,
  setEdit,
  updateClaim,
  editCancel,
}) => {
  return (
    <Flex justifyContent='flex-end'>
      {!edit ? (
        <Button
          onClick={() => {
            isEdit();
            setEdit(true);
          }}
        >
          編集
        </Button>
      ) : (
        <Flex justifyContent='space-between' w='100%'>
          <Button
            w='95%'
            mx={1}
            colorScheme='telegram'
            onClick={() => {
              updateClaim(queryId);
              setEdit(false);
            }}
          >
            OK
          </Button>
          <Button
            w='95%'
            mx={1}
            colorScheme='gray'
            onClick={() => {
              setEdit(false);
              editCancel();
            }}
          >
            キャンセル
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default ClaimEditButton;
