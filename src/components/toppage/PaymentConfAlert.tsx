import { Box, Button, Flex, keyframes } from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useUtils } from "@/hooks/useUtils";
import { useAuthManagement } from "@/hooks/useAuthManegement";

const animationKeyframes = keyframes`
0% { background-color: yellow; }
50% { background-color: white; }
100% { background-color: yellow;  }
`;
const animation = `${animationKeyframes} 2s ease-in-out infinite`;

export const PaymentConfAlert: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { isAuth, isAdminAuth } = useAuthManagement();
  const { getYearMonth } = useUtils();
  const { year, monthStr } = getYearMonth();
  const [isFlag, setIsFlag] = useState(false);

  useEffect(() => {
    const getPaymentFlag = async () => {
      const result = `${year}_${monthStr}`;
      const collectionRef = doc(db, "paymentConfirms", result);
      const snapShot = await getDoc(collectionRef);
      const array = snapShot.data()?.checkList;
      setIsFlag(!array.includes(currentUser));
    };
    getPaymentFlag();
  }, [year, monthStr, currentUser]);

  return (
    <>
      {isFlag && isAuth("isoSalesStaff") && isAdminAuth() && (
        <Box
          w="100%"
          boxShadow="xs"
          p={{ base: 3, md: 6 }}
          rounded="md"
          bg="white"
        >
          {isFlag && (
            <Flex
              align="center"
              justify="center"
              id="saleLabel"
              textAlign="center"
              fontSize="sm"
              p={3}
              rounded="md"
              animation={animation}
            >
              <Box>売掛金回収一覧の【既読】をお願いします。</Box>
              <Link href="/receivables" passHref>
                <Button variant="outline" size="sm" colorScheme="blue">
                  一覧
                </Button>
              </Link>
            </Flex>
          )}
        </Box>
      )}
    </>
  );
};
