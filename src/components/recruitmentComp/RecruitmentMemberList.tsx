import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { usersState } from '../../../store/index.js';

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
    member: string[];
    level: string;
    content: string;
    display: boolean;
    deleteAt: boolean;
    editAt: boolean;
    sendAt: string;
    recruitment: boolean;
  };
}

const RecruitmentMemberList: NextPage<Props> = ({ request }) => {
  const [usersfilter, setUsersfilter] = useState<any>([]);
  const users = useRecoilValue(usersState);

  useEffect(() => {
    const result = users.filter((user: { uid: string; name: string }) => {
      if (!user.uid) return;
      if (request.member.includes(user.uid)) {
        return user.name;
      }
    });
    setUsersfilter(result);
  }, [request.member, users]);

  return (
    <>
      {usersfilter.map((user: any, index: number) => (
        <Box
          key={index}
          padding={'5px'}
          margin={'10px 10px 0 0'}
          borderRadius={'lg'}
          backgroundColor={'gray.500'}
          color={'white'}
          fontSize={{ base: 'sm' }}
        >
          {user.name}
        </Box>
      ))}
    </>
  );
};

export default RecruitmentMemberList;
