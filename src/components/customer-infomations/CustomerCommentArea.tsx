import { Box, Container, Flex } from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState, FC } from "react";
import { db } from "../../../firebase";
import { format } from "date-fns";
import { useDisp } from "@/hooks/useDisp";

type Props = {
  id: string | undefined;
};

export const CustomerCommentArea: FC<Props> = ({ id }) => {
  const [comments, setComments] = useState<any>([]);
  const { getUserName } = useDisp();

  useEffect(() => {
    if (!id) return;
    const getComment = () => {
      const collectionRef = collection(
        db,
        "customerInformations",
        id,
        "comments"
      );
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      onSnapshot(q, (querySnapshot) => {
        setComments(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    };
    getComment();
  }, [id]);

  return (
    <Container maxW="500px" p={0} mt={6}>
      <Flex direction="column" gap={6}>
        {comments.map(({ comment, author, createdAt }: any, index: number) => (
          <Box key={index} p={6} bg="white" boxShadow="md" rounded="md">
            <Box whiteSpace="pre-wrap">{comment}</Box>
            <Flex mt={6} justify="space-between" align="center" fontSize="sm">
              <Box>{getUserName(author)}</Box>
              {createdAt && (
                <Flex justify="right" fontSize="sm" gap={3}>
                  <Box>登録日</Box>
                  <Box>
                    {format(new Date(createdAt?.toDate()), "yyyy-MM-dd")}
                  </Box>
                </Flex>
              )}
            </Flex>
          </Box>
        ))}
      </Flex>
    </Container>
  );
};
