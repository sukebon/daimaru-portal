/* eslint-disable react/display-name */
import { NextPage } from "next";
import React from "react";
import { Box } from "@chakra-ui/react";
import RecruitmentPost from "./RecruitmentPost";
import { RequestTypes } from "../../../types/RequestTypes";

type Props = {
  requests: RequestTypes[];
};

const RecruitmentPosts: NextPage<Props> = ({ requests }) => {
  return (
    <>
      {requests.map((request) => (
        <Box key={request.id} w="100%">
          <RecruitmentPost request={request} />
        </Box>
      ))}
    </>
  );
};

export default RecruitmentPosts;
