import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { Users, Administrator } from "../../../data";
import { auth, db } from "../../../firebase";
import { authState } from "../../../store";
import AdminEditModal from "../../components/admin/AdminEditModal";

const Admin = () => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  const router = useRouter();

  const [usersRegisterList, setUsersRegisterList] = useState<any>([]);

  //ログインしていなかったらログイン画面へ
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [router, user]);

  //初期設定に追加
  const setting = async (user: { uid: string; name: string; rank: number }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        name: user.name,
        isoTopManegment: false,
        isoManager: false,
        isoBoss: false,
        isoOffice: false,
        isoSalesStaff: false,
        alcoholChecker: false,
        rank: user.rank,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //トップマネジメントに追加
  const addTopManegment = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        isoTopManegment: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //ISO管理者に追加
  const addManager = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        isoManager: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //ISO 上司に追加
  const addBoss = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid); //topManegmentGroupはfirestoreで直接登録
      await updateDoc(docRef, {
        isoBoss: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //ISO 事務局に追加
  const addOffice = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid); //topManegmentGroupはfirestoreで直接登録
      await updateDoc(docRef, {
        isoOffice: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //営業担当に追加
  const addSalesStaff = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        isoSalesStaff: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //アルコールチェッカー管理に追加
  const addAlcoholChecker = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        alcoholChecker: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //トップマネジメントから削除
  const removeTopManegment = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid); //topManegmentGroupはfirestoreで直接登録
      await updateDoc(docRef, {
        isoTopManegment: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  //管理者から削除
  const removeManager = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        isoManager: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  //上司から削除
  const removeBoss = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        isoBoss: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  //事務局から削除
  const removeOffice = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        isoOffice: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //営業担当から削除
  const removeSalesStaff = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        isoSalesStaff: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //アルコールチェッカーから削除
  const removeAlcoholChecker = async (user: { uid: string; name: string }) => {
    try {
      const docRef = doc(db, "authority", user.uid);
      await updateDoc(docRef, {
        alcoholChecker: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //firestore authority 情報の取得
  useEffect(() => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setUsersRegisterList(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return unsub;
  }, []);

  return (
    <>
      {Administrator.includes(currentUser) && (
        <Box
          w={"100%"}
          backgroundColor={"#f7f7f7"}
          paddingBottom={"50px"}
          minH={"100vh"}
          p={6}
        >
          <Box
            p={6}
            mx={"auto"}
            w={{ base: "100%", md: "1200px" }}
            bg="white"
            borderRadius={"5px"}
          >
            <Box as="h1" fontSize="4xl">
              管理者設定画面
            </Box>
            <Box mt={12}>
              <Text as="h2" fontSize="2xl">
                権限設定
              </Text>
              <Box p={6}>
                <TableContainer>
                  <Table size="sm" width={"100%"}>
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>名前</Th>
                        <Th>ISO TM</Th>
                        <Th>ISO 管理者</Th>
                        <Th>ISO 上長</Th>
                        <Th>ISO 事務局</Th>
                        <Th>営業・販売</Th>
                        <Th>ALチェック管理</Th>
                        <Th>編集</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {usersRegisterList.map(
                        (user: {
                          uid: string;
                          name: string;
                          isoTopManegment: boolean;
                          isoManager: boolean;
                          isoBoss: boolean;
                          isoOffice: boolean;
                          isoSalesStaff: boolean;
                          alcoholChecker: boolean;
                          rank: number;
                        }) => (
                          <Tr key={user.uid}>
                            <Td>{user?.rank}</Td>
                            <Td>{user.name}</Td>
                            <Td>
                              {user.isoTopManegment ? (
                                <Button
                                  size="xs"
                                  onClick={() => removeTopManegment(user)}
                                  colorScheme="blue"
                                >
                                  有効
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  onClick={() => addTopManegment(user)}
                                >
                                  無効
                                </Button>
                              )}
                            </Td>
                            <Td>
                              {user.isoManager ? (
                                <Button
                                  size="xs"
                                  onClick={() => removeManager(user)}
                                  colorScheme="blue"
                                >
                                  有効
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  onClick={() => addManager(user)}
                                >
                                  無効
                                </Button>
                              )}
                            </Td>
                            <Td>
                              {user.isoBoss ? (
                                <Button
                                  size="xs"
                                  onClick={() => removeBoss(user)}
                                  colorScheme="blue"
                                >
                                  有効
                                </Button>
                              ) : (
                                <Button size="xs" onClick={() => addBoss(user)}>
                                  無効
                                </Button>
                              )}
                            </Td>
                            <Td>
                              {user.isoOffice ? (
                                <Button
                                  size="xs"
                                  onClick={() => removeOffice(user)}
                                  colorScheme="blue"
                                >
                                  有効
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  onClick={() => addOffice(user)}
                                >
                                  無効
                                </Button>
                              )}
                            </Td>
                            <Td>
                              {user.isoSalesStaff ? (
                                <Button
                                  size="xs"
                                  onClick={() => removeSalesStaff(user)}
                                  colorScheme="blue"
                                >
                                  有効
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  onClick={() => addSalesStaff(user)}
                                >
                                  無効
                                </Button>
                              )}
                            </Td>
                            <Td>
                              {user.alcoholChecker ? (
                                <Button
                                  size="xs"
                                  onClick={() => removeAlcoholChecker(user)}
                                  colorScheme="blue"
                                >
                                  有効
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  onClick={() => addAlcoholChecker(user)}
                                >
                                  無効
                                </Button>
                              )}
                            </Td>
                            <Td>
                              <AdminEditModal uid={user.uid} />
                            </Td>
                          </Tr>
                        )
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
                {/* {currentUser === "MBTOK9Jr0eRWVuoT2YXgZNMoBQH3" && (
                  <Box mt={12}>
                    <Text>初期設定（アプリに登録する）</Text>
                    <Wrap spacing="5px" p={3}>
                      {Users.map(
                        (user: { uid: string; name: string; rank: number }) => (
                          <WrapItem key={user.uid}>
                            <Button onClick={() => setting(user)}>
                              {user.name}
                            </Button>
                          </WrapItem>
                        )
                      )}
                    </Wrap>
                  </Box>
                )} */}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Admin;
