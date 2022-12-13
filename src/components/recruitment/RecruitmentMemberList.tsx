import { Box, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { usersState } from "../../../store/index.js";

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
      <Flex wrap="wrap" rounded="md" color="white" fontSize="sm" gap={2}>
        {usersfilter.map((user: any, index: number) => (
          <Box key={index} padding={1} rounded="md" bg={"gray.500"}>
            {user.name}
          </Box>
        ))}
      </Flex>
    </>
  );
};

export default RecruitmentMemberList;
