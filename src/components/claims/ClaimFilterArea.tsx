import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from '../../../data';

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
  const [staffStampList, setStaffStampList] = useState([]);

  // useEffect(() => {
  //   const newUsers = claims.map((claim: { stampStaff: string }) => {
  //     return { uid: claim.stampStaff };
  //   });
  //   setStaffStampList(newUsers);
  //   console.log('newUsesa');
  // }, [claims]);

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        絞り込み
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
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
              placeholder='全て選択'
              value={stampStaffFilter}
              onChange={(e) => setStampStaffFilter(e.target.value)}
            >
              {users.map((user: { uid: string; name: string }) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            </Select>

            <FormLabel mt={6}>発生内容</FormLabel>
            <Select
              placeholder='全て選択'
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
              placeholder='全て選択'
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
              placeholder='全て選択'
              value={counterplanFilter}
              onChange={(e) => setCounterplanFilter(e.target.value)}
            >
              {claimSelectList3.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </Select>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              閉じる
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ClaimFilterArea;
