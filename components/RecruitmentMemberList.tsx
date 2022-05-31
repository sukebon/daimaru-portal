import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Users } from '../data.js';

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
}

const RecruitmentMemberList: NextPage<Props> = ({ request }) => {
  const [usersfilter, setUsersfilter] = useState<any>([]);

  useEffect(() => {
    const result = Users.filter((user) => {
      if (request.member.includes(user.uid)) {
        return user.name;
      }
    });
    setUsersfilter(result);
  }, [request]);

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
      {/* {users.map((user: any) => (
        <Box
          key={user.uid}
          padding={'5px'}
          margin={'10px 10px 0 0'}
          borderRadius={'lg'}
          backgroundColor={'gray.500'}
          color={'white'}
          fontSize={{ base: 'sm' }}
          display={!request.member.includes(user.uid) ? 'none' : 'block'}
        >
          {request.member.includes(user.uid) && user.name}
        </Box>
      ))} */}
    </>
  );
};

export default RecruitmentMemberList;
