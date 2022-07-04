import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from 'firebase/firestore';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { Users } from '../../../data';
import {
  taskflow,
  claimSelectList1,
  claimSelectList2,
  claimSelectList3,
} from '../../../data';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../store/authState';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

const Claim: NextPage = () => {
  const currentUser = useRecoilValue(authState);
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState<any>([]); //ユーザー一覧リスト
  const router = useRouter();
  const [claims, setClaims] = useState<any>([]); //クレーム一覧リスト
  const [isoOfficeUsers, setIsoOfficeUsers] = useState<any>([]);
  const [isoManagerUsers, setIsoManagereUsers] = useState<any>([]);
  const [isoBossUsers, setIsoBossUsers] = useState<any>([]);
  const [isoTopManegmentUsers, setIsoTopManegmentUsers] = useState<any>([]);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  //users情報
  useEffect(() => {
    const usersCollectionRef = collection(db, 'authority');
    const q = query(usersCollectionRef, orderBy('rank', 'asc'));
    getDocs(q).then((querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  //クレーム一覧を取得
  useEffect(() => {
    const claimsCollectionRef = collection(db, 'claimList');
    const q = query(claimsCollectionRef, orderBy('receptionNum', 'desc'));
    getDocs(q).then((querySnapshot) => {
      setClaims(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  //users情報
  // useEffect(() => {
  //   const usersCollectionRef = collection(db, 'authority');
  //   const q = query(usersCollectionRef, orderBy('rank', 'asc'));
  //   const unsub = onSnapshot(q, (querySnapshot) => {
  //     setUsers(
  //       querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }))
  //     );
  //   });
  //   return unsub;
  // }, [currentUser]);

  //クレーム一覧を取得
  // useEffect(() => {
  //   const claimsCollectionRef = collection(db, 'claimList');
  //   const q = query(
  //     claimsCollectionRef,
  //     // where('deletedAt', '==', null),
  //     orderBy('receptionNum', 'desc')
  //   );
  //   const unsub: any = onSnapshot(q, (querySnapshot) => {
  //     setClaims(
  //       querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }))
  //     );
  //     return unsub;
  //   });
  // }, []);
  // console.log(claims);

  //作業者を表示する関数
  const currentOperator = (claim: any) => {
    switch (claim.operator) {
      case claim.operator:
        switch (claim.status) {
          case 0:
            return '事務局';
          case 2:
            return '事務局';
          case 4:
            return '事務局';
          case 6:
            return '管理者';
          case 7:
            return 'TM';
          case 8:
            return '-';
          default:
            return users.map((user: { uid: string; name: string }) => {
              if (user.uid == claim.operator) return user.name;
            });
        }
      default:
        return '事務局';
    }
  };

  //各リストを取得
  useEffect(() => {
    //ISO 事務局のリスト(オブジェクト）
    setIsoOfficeUsers(
      users.filter((user: any) => {
        return user.isoOffice === true;
      })
    );
    //ISOマネージャーのリスト(オブジェクト）
    setIsoManagereUsers(
      users.filter((user: any) => {
        return user.isoManager === true;
      })
    );
    //ISO トップマネジメントのリスト(オブジェクト）
    setIsoTopManegmentUsers(
      users.filter((user: any) => {
        return user.isoTopManegment === true;
      })
    );
    //ISO 上司のリスト(オブジェクト）
    setIsoBossUsers(
      users.filter((user: any) => {
        return user.isoBoss === true;
      })
    );
  }, [users]);

  //iso（事務局・管理者・TM）のオブジェクトからuidのみ取り出して配列にする
  const searchUsers = (array: { uid: string }[]) => {
    const newUsers = array.map((user: { uid: string }) => {
      return user.uid;
    });
    return newUsers;
  };

  return (
    <>
      {currentUser && (
        <>
          <Box
            p={6}
            backgroundColor={'#f7f7f7'}
            paddingBottom={'50px'}
            minH={'100vh'}
          >
            <Flex flexDirection={'column'} alignItems={'center'}>
              <TableContainer backgroundColor='white' borderRadius={6} p={6}>
                <Table size='sm'>
                  <Thead>
                    <Tr>
                      <Th>作業者</Th>
                      <Th>ステータス</Th>
                      <Th>受付日</Th>
                      <Th>受付NO.</Th>
                      <Th>記入者</Th>
                      <Th>担当</Th>
                      <Th>顧客名</Th>
                      <Th>発生日</Th>
                      <Th>発生内容</Th>
                      <Th>修正処置</Th>
                      <Th>対策</Th>
                      <Th>完了日</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {claims.map((claim: any) => (
                      <Tr
                        key={claim.id}
                        backgroundColor={
                          claim.operator === currentUser ||
                          (searchUsers(isoOfficeUsers).includes(currentUser) &&
                            (claim.status === 0 ||
                              claim.status === 2 ||
                              claim.status === 4)) ||
                          (searchUsers(isoManagerUsers).includes(currentUser) &&
                            claim.status === 6) ||
                          (searchUsers(isoTopManegmentUsers).includes(
                            currentUser
                          ) &&
                            claim.status === 7)
                            ? 'yellow.100'
                            : 'white'
                        }
                      >
                        <Td>{currentOperator(claim)}</Td>
                        <Td>
                          {taskflow.map(
                            (task) => task.id == claim.status && task.status
                          )}
                        </Td>
                        <Td>{claim.receptionDate}</Td>
                        <Td>{claim.receptionNum}</Td>
                        <Td>
                          {Users.map(
                            (user) => user.uid == claim.author && user.name
                          )}
                        </Td>
                        <Td>
                          {Users.map(
                            (user) => user.uid == claim.stampStaff && user.name
                          )}
                        </Td>
                        <Td>{claim.customer}</Td>
                        <Td>{claim.occurrenceDate}</Td>
                        <Td>
                          {claimSelectList1.map(
                            (c) =>
                              c.id == claim.occurrenceSelect &&
                              `${c.headline} ${c.title}`
                          )}
                        </Td>
                        <Td>
                          {claimSelectList2.map(
                            (c) => c.id == claim.amendmentSelect && c.title
                          )}
                        </Td>
                        <Td>
                          {claimSelectList3.map(
                            (c) => c.id == claim.counterplanSelect && c.title
                          )}
                        </Td>
                        <Td>{claim.completionDate}</Td>
                        <Td>
                          <Link href={`/claims/${claim.id}`}>
                            <a>
                              <Button>詳細</Button>
                            </a>
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          </Box>
        </>
      )}
    </>
  );
};

export default Claim;
