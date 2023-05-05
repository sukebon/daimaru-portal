import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState, FC } from "react";
import { Request, User } from "../../../types";
import { useAuthStore } from "../../../store/useAuthStore";

type Props = {
  request: Request;
};

export const RequestMemberList: FC<Props> = ({ request }) => {
  const [usersfilter, setUsersfilter] = useState<User[]>([]);
  const fullUsers = useAuthStore((state) => state.fullUsers);

  useEffect(() => {
    const userList = fullUsers.filter((user) => {
      if (!user.uid) return;
      if (request.member.includes(user.uid)) {
        return user.name;
      }
    });
    setUsersfilter(userList);
  }, [request.member, fullUsers]);

  return (
    <>
      <Flex wrap="wrap" rounded="md" color="white" fontSize="sm" gap={2}>
        {usersfilter.map((user, index: number) => (
          <Box key={index} p={1} rounded="md" bg={"gray.500"}>
            {user.name}
          </Box>
        ))}
      </Flex>
    </>
  );
};
