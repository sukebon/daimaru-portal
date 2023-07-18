import { Box, Container, Flex, keyframes, transition } from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState, FC } from "react";
import { db } from "../../../firebase";
import { format } from "date-fns";
import { useDisp } from "@/hooks/useDisp";
import { FaTrashCan } from "react-icons/fa6";
import { useAuthStore } from "../../../store/useAuthStore";

type Props = {
  pathname: string | undefined;
};

const animationKeyframes = keyframes`
0% { 
  transform: translateY(20px); 
  opacity: 0;
}
100% { 
  transform: translateY(0); 
  opacity: 1;
}
`;
const animation = `${animationKeyframes} 0.3s ease-in-out`;

export const CustomerCommentArea: FC<Props> = ({ pathname }) => {
  const [comments, setComments] = useState<any>([]);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { getUserName } = useDisp();

  useEffect(() => {
    if (!pathname) return;
    const getComment = () => {
      const collectionRef = collection(
        db,
        "customerInformations",
        pathname,
        "comments"
      );
      const q = query(collectionRef, orderBy("createdAt", "asc"));
      onSnapshot(q, (querySnapshot) => {
        setComments(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    };
    getComment();
  }, [pathname]);

  const deleteComment = async (pathname: string = "", id: string) => {
    if (!pathname) return;
    const result = confirm("削除して宜しいでしょうか");
    if (!result) return;
    try {
      const docRef = doc(db, "customerInformations", pathname, "comments", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxW="500px" p={0} mt={6}>
      <Flex direction="column-reverse" gap={6}>
        {comments.map(
          ({ id, comment, author, createdAt }: any, index: number) => (
            <Box
              key={index}
              p={6}
              bg="white"
              boxShadow="md"
              rounded="md"
              animation={animation}
            >
              <Flex justify="space-between" align="center" fontSize="sm">
                <Box>{getUserName(author)}</Box>
                {createdAt && (
                  <Flex justify="right" align="center" fontSize="sm" gap={3}>
                    <Box>登録日</Box>
                    <Box>
                      {format(new Date(createdAt?.toDate()), "yyyy-MM-dd")}
                    </Box>
                  </Flex>
                )}
              </Flex>
              <Box mt={3} whiteSpace="pre-wrap">
                {comment}
              </Box>
              <Flex justify="flex-end">
                {author === currentUser && (
                  <FaTrashCan
                    cursor="pointer"
                    onClick={() => deleteComment(pathname, id)}
                  />
                )}
              </Flex>
            </Box>
          )
        )}
      </Flex>
    </Container>
  );
};
