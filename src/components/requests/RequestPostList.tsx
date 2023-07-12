/* eslint-disable react/display-name */
import React, { FC } from "react";
import { Box } from "@chakra-ui/react";
import { RequestPost } from "./RequestPost";
import { Request } from "../../../types";

type Props = {
  requests: Request[];
};

export const RequestPostList: FC<Props> = ({ requests }) => {
  return (
    <>
      {requests.map((request) => (
        <Box key={request.id} w="full" mt={3}>
          <RequestPost request={request} />
        </Box>
      ))}
    </>
  );
};
