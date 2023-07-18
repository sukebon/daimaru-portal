import { collection, getCountFromServer } from "firebase/firestore";
import React, { useEffect, useState, FC } from "react";
import { db } from "../../../firebase";
import { Box } from "@chakra-ui/react";

type Props = {
  id: string;
};

export const CustomerCoimmentCount: FC<Props> = ({ id }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if(!id) return
    const getCustomerComment = async (id: string) => {
      const collectionRef = collection(
        db,
        "customerInformations",
        id,
        "comments"
      );
      const snapshot = await getCountFromServer(collectionRef);
      setCount(snapshot.data().count);
    };
    getCustomerComment(id);
  }, [id]);

  return <Box>{count > 0 ? `${count}件` : ""}</Box>;
};
