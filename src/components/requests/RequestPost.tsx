import React, { FC } from "react";
import { Badge, Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { Administrator } from "../../../data";
import { RequestRegisterButton } from "./RequestRegisterButton";
import { RequestMemberList } from "./RequestMemberList";
import { RequestMenu } from "./RequestMenu";
import { useAuthStore } from "../../../store/useAuthStore";
import { Request } from "../../../types";
import { useUtils } from "@/hooks/useUtils";
import { useDisp } from "@/hooks/useDisp";
import { FaStar, FaRegStar } from "react-icons/fa";

type Props = {
  request: Request;
};

export const RequestPost: FC<Props> = ({ request }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { dayOfWeek } = useUtils();
  const { getUserName } = useDisp();

  // newラベルを表示(期限三日)
  const newLabel = (time: any) => {
    const currentDay = new Date();
    const requestDay = new Date(time);
    const difference = currentDay.getTime() - requestDay.getTime();
    const date = difference / 86400000;
    return date <= 3 ? true : false;
  };

  const starColor = "#e59819";

  const starLevel = (level: string) => (
    <Flex gap={1}>
      {Number(level) === 1 && (
        <>
          <FaStar fill={starColor} />
          <FaRegStar fill={starColor} />
          <FaRegStar fill={starColor} />
        </>
      )}
      {Number(level) === 2 && (
        <>
          <FaStar fill={starColor} />
          <FaStar fill={starColor} />
          <FaRegStar fill={starColor} />
        </>
      )}
      {Number(level) === 3 && (
        <>
          <FaStar fill={starColor} />
          <FaStar fill={starColor} />
          <FaStar fill={starColor} />
        </>
      )}
    </Flex>
  );

  return (
    <>
      <Flex justify="space-between">
        <Flex direction="column" w="full">
          {newLabel(request?.sendAt?.toDate()) && (
            <Badge colorScheme="red" w="full" textAlign="center" p={1}>
              New
            </Badge>
          )}
          <Flex justify="space-between" align="center">
            <Flex gap={2} align="center">
              <Box fontSize="xl">{starLevel(request.level)}</Box>
              <Box>{!request.recruitment && "【募集終了】"}</Box>
            </Flex>
            {/* メニューボタン  投稿者と管理者のみ表示*/}
            {(currentUser === request.author ||
              Administrator.includes(currentUser)) && (
              <RequestMenu request={request} />
            )}
          </Flex>
          <Heading fontSize="md" pb={3} mt={3}>
            {request.title}
          </Heading>
          <Flex
            direction={{
              base: "column",
              md: "row",
              lg: "column",
              "2xl": "row",
            }}
            fontSize="sm"
            gap={2}
          >
            <Box>
              【開始】{request.startDay}
              {request.startTime && `-${request.startTime}`}
              {dayOfWeek(request.startDay)}
            </Box>
            <Box>
              【終了】{request.endDay}
              {request.endTime && `-${request.endTime}`}
              {dayOfWeek(request.endDay)}
            </Box>
            <Box>
              【募集人数】{request.applicant}人{request.moreless}
            </Box>
          </Flex>
          <Flex direction={{ base: "column", md: "row" }} fontSize="sm">
            <Box>【責任者】{request.person}</Box>
            {Administrator.includes(currentUser || "") && (
              <Box>【作成者】{getUserName(request.author)}</Box>
            )}
          </Flex>
          <Box py={3} whiteSpace="pre-wrap" fontSize="sm">
            {request.content}
          </Box>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={3}
            py={3}
          >
            <Flex flexWrap="wrap">
              <RequestMemberList request={request} />
            </Flex>
            <RequestRegisterButton request={request} />
          </Flex>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};
