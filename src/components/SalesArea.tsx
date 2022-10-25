import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Administrator } from "../../data";
import { authState, usersState } from "../../store";

const SalesArea = () => {
  const users = useRecoilValue(usersState);
  const currentUser = useRecoilValue(authState);
  const [filterUsers, setFilterUsers] = useState<any>();
  useEffect(() => {
    setFilterUsers(
      users
        .filter((user: { isoSalesStaff: boolean }) => user.isoSalesStaff)
        .map((user: { uid: string }) => user.uid)
    );
  }, [users]);
  return (
    <>
      {(filterUsers?.includes(currentUser) ||
        Administrator.includes(currentUser)) && (
        <Box
          width="100%"
          boxShadow="xs"
          p={{ base: 3, md: 6 }}
          rounded="md"
          bg="white"
        >
          <Link href="/sales/">
            <a>
              <Button w="100%" colorScheme="blue">
                売上着地金額の入力
              </Button>
            </a>
          </Link>
        </Box>
      )}
    </>
  );
};

export default SalesArea;
