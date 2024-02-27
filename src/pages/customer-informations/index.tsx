import {
  Box,
  Button,
  Container,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { NextPage } from "next";
import { CustomerInformation } from "../../../types";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import { format } from "date-fns";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDisp } from "@/hooks/useDisp";
import { FaTrashCan } from "react-icons/fa6";
import { deleteObject, ref } from "firebase/storage";
import { useUtils } from "@/hooks/useUtils";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { CustomerInfoSearch } from "@/components/customer-infomations/CustomerInfoSearch";
import { CustomerCoimmentCount } from "@/components/customer-infomations/CustomerCoimmentCount";

type Inputs = {
  customer: string;
  staff: string;
  title: string;
  prefecture: string;
  emotion: string;
};

const CustomerInformations: NextPage = () => {
  const [customerInfoData, setCustomerInfoData] = useState<
    CustomerInformation[]
  >([]);
  const [filterData, setFilterData] = useState<CustomerInformation[]>([]);
  const [createdAtEnd, setCreatedAtEnd] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { getUserName } = useDisp();
  const { excerpt } = useUtils();
  const methods = useForm<Inputs>({
    defaultValues: {
      customer: "",
      title: "",
      emotion: "",
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const newArray = customerInfoData
      .filter(
        ({ customer, title, emotion }) =>
          customer?.includes(data.customer) &&
          title?.includes(data.title) &&
          emotion?.includes(data.emotion)
      )
      .filter(({ staff }) => {
        if (data.staff === "" || staff === data.staff) {
          return true;
        }
      });
    setFilterData(newArray);
  };

  useEffect(() => {
    const getCustomerInfomations = async () => {
      const collectionRef = collection(db, "customerInformations");
      const q = query(collectionRef, orderBy("createdAt", "desc"), limit(10));
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as CustomerInformation)
        );
        setCustomerInfoData(data);
        setCreatedAtEnd(data?.at(-1)?.createdAt);
      });
    };
    getCustomerInfomations();
  }, []);

  useEffect(() => {
    const getTotalCount = async () => {
      const coll = collection(db, "customerInformations");
      const snapshot = await getCountFromServer(coll);
      setTotalCount(snapshot.data().count);
    };
    getTotalCount();
  }, [customerInfoData]);

  useEffect(() => {
    const watch = methods.watch;
    setFilterData(
      customerInfoData
        .filter(
          ({ customer, title, emotion }) =>
            customer?.includes(watch("customer")) &&
            title?.includes(watch("title")) &&
            emotion?.includes(watch("emotion"))
        )
        .filter(({ staff }) => {
          if (watch("staff") === "" || staff === watch("staff")) {
            return true;
          }
        })
    );
  }, [customerInfoData, methods]);

  const deleteInformation = async (id: string) => {
    const result = confirm("削除して宜しいでしょうか");
    if (!result) return;
    try {
      const docRef = doc(db, "customerInformations", id);
      const docSnap = await getDoc(docRef);
      const imagesArray = docSnap?.data()?.images;
      if (imagesArray?.length > 0) {
        imagesArray.forEach((image: { imagePath: string }) => {
          const desertRef = ref(storage, image?.imagePath);
          deleteObject(desertRef);
        });
      }
      await deleteDoc(docRef);
    } catch (error) {
      console.log(error);
    }
  };

  const getEmotion = (str: string) => {
    switch (str) {
      case "good":
        return <BsEmojiLaughing color="orange" />;
      case "normal":
        return <BsEmojiNeutral color="blue" />;
      case "bad":
        return <FaRegFaceTired color="red" />;
      default:
        return "no image";
    }
  };

  const getNextPage = () => {
    const coll = collection(db, "customerInformations");
    const q = query(
      coll,
      orderBy("createdAt", "desc"),
      startAfter(createdAtEnd),
      limit(30)
    );
    onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as CustomerInformation)
      );
      const concatData = [...customerInfoData, ...newData];
      setCustomerInfoData(concatData);
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Container
          w="full"
          maxW="1500px"
          bg="white"
          p={6}
          boxShadow="md"
          rounded="md"
        >
          <Flex justify="space-between" align="center">
            <Box as="h1" fontSize="lg" fontWeight="bold">
              お客様情報一覧
            </Box>
            <Flex gap={3}>
              <Link href="/" passHref>
                <Button colorScheme="blue" size="sm" variant="outline">
                  トップへ戻る
                </Button>
              </Link>
              <Link href="/customer-informations/new" passHref>
                <Button colorScheme="blue" size="sm">
                  作成
                </Button>
              </Link>
            </Flex>
          </Flex>
          <CustomerInfoSearch
            customerInfoData={customerInfoData}
            setFilterData={setFilterData}
          />
          <TableContainer>
            <Table size="sm" mt={6}>
              <Thead>
                <Tr>
                  <Th>登録日</Th>
                  <Th>顧客名</Th>
                  <Th>担当者</Th>
                  <Th>タイトル</Th>
                  <Th textAlign="center">受けた印象</Th>
                  <Th>内容</Th>
                  <Th>コメント</Th>
                  <Th>投稿者</Th>
                  <Th w="50px" textAlign="center">
                    詳細
                  </Th>
                  <Th w="50px">削除</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filterData.map(
                  ({
                    id,
                    title,
                    customer,
                    staff,
                    emotion,
                    content,
                    author,
                    createdAt,
                  }) => (
                    <Tr key={id}>
                      <Td>
                        {format(
                          new Date(createdAt?.toDate()),
                          "yyyy年MM月dd日"
                        )}
                      </Td>
                      <Td>{excerpt(customer, 12)}</Td>
                      <Td>{getUserName(staff)}</Td>
                      <Td
                        textDecoration="underline"
                        _hover={{ textDecoration: "none" }}
                      >
                        <Link href={`/customer-informations/${id}`}>
                          {excerpt(title, 12)}
                        </Link>
                      </Td>
                      <Td>
                        <Flex fontSize="xl" justify="center">
                          {getEmotion(emotion)}
                        </Flex>
                      </Td>
                      <Td>{excerpt(content, 20)}</Td>
                      <Td>
                        <Flex justify="center">
                          <CustomerCoimmentCount id={id} />
                        </Flex>
                      </Td>
                      <Td>{getUserName(author)}</Td>
                      <Td w="50px">
                        <Flex fontSize="xl" justify="center">
                          <Link href={`/customer-informations/${id}`} passHref>
                            <Button size="xs" variant="outline">
                              詳細
                            </Button>
                          </Link>
                        </Flex>
                      </Td>
                      <Td w="50px">
                        <Flex justify="center">
                          {author === currentUser && (
                            <FaTrashCan
                              cursor="pointer"
                              onClick={() => deleteInformation(id)}
                            />
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justify="center" mt={3}>
            {totalCount > customerInfoData.length && (
              <Button onClick={getNextPage}>さらに表示する</Button>
            )}
          </Flex>
        </Container>
      </form>
    </FormProvider>
  );
};

export default CustomerInformations;
