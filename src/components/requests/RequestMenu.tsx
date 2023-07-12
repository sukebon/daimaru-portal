import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";
import React, { FC } from "react";
import { db } from "../../../firebase";
import { Administrator } from "../../../data";
import { useAuthStore } from "../../../store/useAuthStore";
import { Request } from "../../../types";
import { RequestEditModal } from "./RequestEditModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useMutateRequests } from "@/hooks/requests/useMutateRequests";

type Props = {
  request: Request;
};

export const RequestMenu: FC<Props> = ({ request }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { updateDisplayMutation, updateRecruitmentMutation } = useMutateRequests();


  const deleteRequest = async (id: string) => {
    const result = window.confirm("削除してよろしいでしょうか？");
    if (!result) return;
    try {
      const docRef = doc(db, "requestList", `${id}`);
      await deleteDoc(docRef);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        size="sm"
        aria-label="MenuButton"
        icon={<BsThreeDotsVertical />}
        variant="outline"
      />
      <MenuList>
        {request.display === true && (
          <RequestEditModal request={request} />
        )}
        <MenuItem onClick={() => updateDisplayMutation.mutate({ uid: request.id, display: request.display })}>
          {request.display ? "掲載終了" : "掲載を再開"}</MenuItem>
        <MenuItem onClick={() => updateRecruitmentMutation.mutate({ uid: request.id, recruitment: request.recruitment })}>
          {request.recruitment ? "募集終了" : "募集を再開"}
        </MenuItem>
        {Administrator.includes(currentUser || "") && (
          <MenuItem onClick={() => deleteRequest(request.id)}>削除</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
