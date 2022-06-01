import { DragHandleIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { db } from '../firebase/auth';
import { authState } from '../store/authState';

interface Props {
  request: {
    id: string;
    title: string;
    startDay: string;
    startTime: string;
    endEnd: string;
    endTime: string;
    applicant: string;
    person: string;
    moreless: string;
    member: string;
    level: string;
    content: string;
    displayAt: boolean;
    deleteAt: boolean;
    editAt: boolean;
    sendAt: string;
    recruitment: boolean;
  };
  isEdit: any;
  oldTitleContent: any;
  cancelTitleContent: any;
}

const RecruitmentMenu: NextPage<Props> = ({
  request,
  isEdit,
  oldTitleContent,
  cancelTitleContent,
}) => {
  const currentUser = useRecoilValue(authState);

  //リクエストを非表示
  const hideRequest = async (uid: string) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      displayAt: false,
    });
  };

  //リクエストを表示
  const displayRequest = async (uid: string) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      displayAt: true,
    });
  };

  //募集を停止
  const isRecruitmentFalse = async (uid: string) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      recruitment: false,
    });
  };

  //募集を再開
  const isRecruitmentTrue = async (uid: string) => {
    const docRef = doc(db, 'requestList', uid);
    await updateDoc(docRef, {
      recruitment: true,
    });
  };

  //リクエストを削除
  const deleteAt = async (uid: string) => {
    const res = window.confirm('削除してよろしいでしょうか？');
    if (res) {
      const docRef = doc(db, 'requestList', uid);
      await updateDoc(docRef, {
        deleteAt: true,
      });
    }
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<DragHandleIcon />}
        variant='outline'
      />
      <MenuList>
        {request.displayAt === true && (
          <MenuItem
            onClick={() => {
              isEdit(request.id);
              oldTitleContent(request);
              cancelTitleContent(request);
            }}
          >
            編集
          </MenuItem>
        )}
        {currentUser === 'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3' ||
        currentUser === 'EVKsigM546MbnakzkDmG0QHlfmn2' ? (
          <>
            {request.displayAt === true ? (
              <MenuItem onClick={() => hideRequest(request.id)}>
                非表示
              </MenuItem>
            ) : (
              <MenuItem onClick={() => displayRequest(request.id)}>
                表示
              </MenuItem>
            )}
          </>
        ) : (
          ''
        )}

        {currentUser === 'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3' ||
        currentUser === 'EVKsigM546MbnakzkDmG0QHlfmn2' ? (
          <>
            {request.recruitment ? (
              <MenuItem onClick={() => isRecruitmentFalse(request.id)}>
                募集を終了
              </MenuItem>
            ) : (
              <MenuItem onClick={() => isRecruitmentTrue(request.id)}>
                募集を再開
              </MenuItem>
            )}
          </>
        ) : (
          ''
        )}

        {currentUser === 'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3' ||
        currentUser === 'EVKsigM546MbnakzkDmG0QHlfmn2' ? (
          <MenuItem onClick={() => deleteAt(request.id)}>削除</MenuItem>
        ) : (
          ''
        )}
      </MenuList>
    </Menu>
  );
};

export default RecruitmentMenu;
