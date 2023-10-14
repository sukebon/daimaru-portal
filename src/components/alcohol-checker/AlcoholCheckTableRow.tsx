import  EditAlcoholCheck from "@/pages/alcohol-checker/EditAlcoholCheck";
import { Td, Tr } from "@chakra-ui/react";
import React, { FC } from "react";
import { AlcoholCheckData } from "../../../types";
import { format } from "date-fns";
import { useDisp } from "@/hooks/useDisp";

type Props = {
  post: AlcoholCheckData;
};

export const AlcoholCheckTableRow: FC<Props> = ({ post }) => {
  const { getUserName } = useDisp();
  return (
    <Tr key={post.id}>
      <Td>{getUserName(post.uid)}</Td>
      <Td textAlign="center">{post.alcoholCheck1 === "1" ? "済み" : "未"}</Td>
      <Td textAlign="center">{post.alcoholCheck2 === "1" ? "なし" : "あり"}</Td>
      <Td textAlign="center" color={post?.alcoholCheckValue >= 0.15 ? "red.500" : ""}>
        {post.alcoholCheckValue && post.alcoholCheckValue > 0
          ? `${Number(post.alcoholCheckValue)}mg`
          : "-"}
      </Td>
      <Td>
        {post?.createdAt &&
          format(new Date(post?.createdAt.toDate()), "HH時mm分ss秒")}
      </Td>
      <Td>
        {post?.updatedAt &&
          format(new Date(post?.updatedAt.toDate()), "HH時mm分ss秒")}
      </Td>
      <Td textAlign="center">
        <EditAlcoholCheck
          postId={post.id}
          defaultValues={{
            alcoholCheck1: post.alcoholCheck1,
            alcoholCheck2: post.alcoholCheck2,
            alcoholCheckValue: post.alcoholCheckValue,
          }}
        />
      </Td>
    </Tr>
  );
};
