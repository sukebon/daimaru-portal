import { Box, Button, keyframes } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";
import { useAuthManagement } from "@/hooks/useAuthManegement";

const animationKeyframes = keyframes`
0% { background-color: red; }
50% { background-color: white; }
100% { background-color: red;  }
`;
const animation = `${animationKeyframes} 2s ease-in-out infinite`;

export const SalesALert: FC = () => {
  const users = useAuthStore((state) => state.users);
  const currentUser = useAuthStore((state) => state.currentUser);
  const {isAdminAuth} = useAuthManagement()
  const [filterUsers, setFilterUsers] = useState<string[]>([]);
  const [saleFlag, setSaleFlag] = useState<boolean>(false);

  useEffect(() => {
    setFilterUsers(
      users.filter((user) => user.isoSalesStaff).map((user) => user.uid)
    );
  }, [users]);

  useEffect(() => {
    const getSaleFlag = async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const result = year + "-" + month;
      const docRef = doc(db, "sales", `${result}_${currentUser}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const result =
          Number(docSnap.data().currentTarget) === 0 ? true : false;
        setSaleFlag(result);
      }
    };
    getSaleFlag();
  }, [currentUser]);

  return (
    <>
      {(filterUsers?.includes(currentUser) ||
        isAdminAuth()) &&
        saleFlag && (
          <>
            <Box
              w="full"
              boxShadow="xs"
              p={{ base: 3, md: 6 }}
              rounded="md"
              bg="white"
            >
              <Box
                id="saleLabel"
                textAlign="center"
                fontSize="sm"
                p={3}
                rounded="md"
                animation={animation}
              >
                月初になりました。
                <Box as="span" fontWeight="bold">
                  目標額
                </Box>
                を入力してください。
                <Link href="/sales" passHref>
                  <Button size="sm" colorScheme="blue">
                    一覧
                  </Button>
                </Link>
              </Box>
            </Box>
          </>
        )}
    </>
  );
};
