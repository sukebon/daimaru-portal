import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from "../../../data";

const ClaimFilterArea = ({
  claims,
  users,
  stampStaffFilter,
  setStampStaffFilter,
  occurrenceFilter,
  setOccurrenceFilter,
  amendmentFilter,
  setAmendmentFilter,
  counterplanFilter,
  setCounterplanFilter,
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<any>();
  const [stampStaffList, setStampStaffList] = useState<any>([]);

  const onFilterReset = () => {
    setStampStaffFilter("");
    setOccurrenceFilter("");
    setAmendmentFilter("");
    setCounterplanFilter("");
  };

  //担当フィルターのリストを作成
  useEffect(() => {
    const newUsers = claims.map((claim: { stampStaff: string }) => {
      return claim.stampStaff;
    });
    const setUsers = new Set(newUsers);
    const arrayUsers = Array.from(setUsers).map((user) => {
      return user;
    });

    setStampStaffList(arrayUsers);
  }, [claims]);

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        絞り込み
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>絞り込み検索</DrawerHeader>

          <DrawerBody>
            <FormLabel mt={6}>担当</FormLabel>
            <Select
              placeholder="全て選択"
              value={stampStaffFilter}
              onChange={(e) => setStampStaffFilter(e.target.value)}
            >
              {stampStaffList.map((stampStaffUser: string, index: number) => (
                <option key={index} value={stampStaffUser}>
                  {users.map(
                    (user: { uid: string; name: string }) =>
                      user.uid === stampStaffUser && user.name
                  )}
                </option>
              ))}
            </Select>

            <FormLabel mt={6}>発生内容</FormLabel>
            <Select
              placeholder="全て選択"
              value={occurrenceFilter}
              onChange={(e) => setOccurrenceFilter(e.target.value)}
            >
              {claimSelectList1.map((list) => (
                <option key={list.id} value={list.id}>
                  {`${list.headline} ${list.title}`}
                </option>
              ))}
            </Select>

            <FormLabel mt={6}>修正処置</FormLabel>
            <Select
              placeholder="全て選択"
              value={amendmentFilter}
              onChange={(e) => setAmendmentFilter(e.target.value)}
            >
              {claimSelectList2.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </Select>

            <FormLabel mt={6}>対策</FormLabel>
            <Select
              placeholder="全て選択"
              value={counterplanFilter}
              onChange={(e) => setCounterplanFilter(e.target.value)}
            >
              {claimSelectList3.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </Select>

            <Flex mt={6} justifyContent="center">
              <Button onClick={onFilterReset}>リセット</Button>
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              閉じる
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ClaimFilterArea;
