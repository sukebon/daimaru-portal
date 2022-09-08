/* eslint-disable react/display-name */
import { NextPage } from 'next';
import React from 'react';
import { Box } from '@chakra-ui/react';
import RecruitmentPost from './RecruitmentPost';

type Props = {
  requests: {
    id: string;
    title: string;
    startDay: string;
    startTime: string;
    endEnd: string;
    endTime: string;
    applicant: string;
    person: string;
    moreless: string;
    member: [];
    level: string;
    content: string;
    display: boolean;
    deleteAt: boolean;
    editAt: boolean;
    sendAt: string;
    recruitment: boolean;
    author: string;
    endDay: string;
  }[];
};

const RecruitmentPosts: NextPage<Props> = ({ requests }) => {
  return (
    <>
      {requests.map((request) => (
        <Box
          key={request.id}
          style={{ width: '100%' }}
          display={request.deleteAt ? 'none' : 'block'}
        >
          <RecruitmentPost request={request} />
        </Box>
      ))}
    </>
  );
};

export default RecruitmentPosts;
