import React, { FC,useEffect } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  keyframes,
} from "@chakra-ui/react";
import { RequestRegisterButton } from "./RequestRegisterButton";
import { RequestMemberList } from "./RequestMemberList";
import { RequestMenu } from "./RequestMenu";
import { useAuthStore } from "../../../store/useAuthStore";
import { Request } from "../../../types";
import { useUtils } from "@/hooks/useUtils";
import { useDisp } from "@/hooks/useDisp";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useAuthManagement } from "@/hooks/useAuthManegement";

const animationKeyframes = keyframes`
0% { background-color: #6527BE;}
30% { background-color: #9681EB;}
50% { background-color: #45CFDD;}
80% { background-color: #A7EDE7;}
100% { background-color: #6527BE;}
`;
const animation = `${animationKeyframes} 10s ease-in-out infinite`;

type Props = {
  request: Request;
  idx:number;
};

export const RequestPost: FC<Props> = ({ request,idx }) => {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { dayOfWeek } = useUtils();
  const { getUserName } = useDisp();
  const { isAdminAuth } = useAuthManagement();

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
  
  useEffect(()=>{
    if(idx === 0) {
      setShow(true)
    }
  },[idx])

  return (
    <>
      <Flex justify="space-between">
        <Flex direction="column" w="full">
          {newLabel(request?.sendAt?.toDate()) && (
            <Box
              px={1}
              w="14"
              color="white"
              textAlign="center"
              animation={animation}
            >
              New
            </Box>
          )}
          <Flex justify="space-between" align="center">
            <Flex gap={2} align="center">
              <Box fontSize="xl">{starLevel(request.level)}</Box>
              <Box>{!request.recruitment && "【募集終了】"}</Box>
            </Flex>
            {/* メニューボタン  投稿者と管理者のみ表示*/}
            {(currentUser === request.author || isAdminAuth()) && (
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
            {isAdminAuth() && (
              <Box>【作成者】{getUserName(request.author)}</Box>
            )}
          </Flex>
          <Collapse startingHeight={1} in={show}>
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
          </Collapse>
          <Button w="auto" size="xs" onClick={handleToggle} mt="1rem">
            {show ? "閉じる" : "詳細を見る"}
          </Button>
        </Flex>
      </Flex>
      <Divider mt={3} />
    </>
  );
};
