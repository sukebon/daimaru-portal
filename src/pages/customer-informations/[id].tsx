import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomerInformation } from "../../../types";
import { doc, getDoc } from "firebase/firestore";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import { db } from "../../../firebase";
import { format } from "date-fns";
import { CustomerInfoModal } from "@/components/customer-infomations/CustomerInfoModal";
import { useDisp } from "@/hooks/useDisp";
import { useAuthStore } from "../../../store/useAuthStore";

const CustomerInfoById: NextPage = () => {
  const router = useRouter();
  const pathname = router.asPath.split("/").pop();
  const [data, setData] = useState<CustomerInformation>({
    id: '',
    customer: "",
    title: "",
    prefecture: "",
    emotion: "good",
    content: "",
    link: "",
    author: "",
    authorRef: "",
    images: [],
    createdAt: ""
  });
  const currentUser = useAuthStore((state) => state.currentUser);
  const { getUserName } = useDisp();

  useEffect(() => {
    const getCustomerInformation = async () => {
      const docRef = doc(db, "customerInformations", `${pathname}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("記事がありません。");
      }
      setData({
        ...docSnap.data(),
        id: docSnap.id,
      } as CustomerInformation);
    };
    getCustomerInformation();
  }, [pathname, currentUser]);

  const getEmotion = (str: string = "") => {
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

  return (
    <Container maxW="500px" bg="white" p={6} boxShadow="md" rounded="md">
      <Flex w="full" justifyContent="space-between" align="center">
        <Box as="h1" fontSize="lg" fontWeight="bold">
          お客様情報
        </Box>
        <Flex gap={3}>
          <Link href="/customer-informations" passHref>
            <Button colorScheme="blue" size="sm" variant="outline">
              一覧へ戻る
            </Button>
          </Link>
          {/* {(data?.author === currentUser) && <CustomerInfoModal data={data} />} */}
          <CustomerInfoModal data={data} />
        </Flex>
      </Flex>
      <Box mt={2}>
        {data?.createdAt && (
          <Flex justify="right" fontSize="sm" gap={3}>
            <Box>登録日</Box>
            <Box>
              {format(new Date(data?.createdAt?.toDate()), "yyyy-MM-dd")}
            </Box>
          </Flex>
        )}
      </Box>
      <Box mt={6}>
        <Text fontWeight="bold">顧客名</Text>
        <Box ml={2}>{data?.customer}</Box>
      </Box>
      <Box mt={6}>
        <Text fontWeight="bold">地域</Text>
        <Box ml={2}>{data?.prefecture ? data?.prefecture : "未登録"}</Box>
      </Box>
      <Box mt={6}>
        <Text fontWeight="bold">タイトル</Text>
        <Box ml={2}>{data?.title}</Box>
      </Box>
      <Box mt={6}>
        <Text fontWeight="bold">受けた印象</Text>
        <Box mt={3} ml={2} fontSize="2xl">
          {getEmotion(data?.emotion)}
        </Box>
      </Box>
      <Box mt={6}>
        <Text fontWeight="bold">内容</Text>
        <Box ml={2} whiteSpace="pre-wrap">
          {data?.content}
        </Box>
      </Box>
      {data?.link && (
        <Box mt={6}>
          <Text fontWeight="bold">リンク先</Text>
          <Box color="blue">
            <Link href={data?.link} target="_blank" rel="noopener noreferrer">
              {data?.link}
            </Link>
          </Box>
        </Box>
      )}
      {data?.images && data.images.length > 0 && (
        <>
          <Box mt={6}>
            <Text fontWeight="bold">画像</Text>
            <Flex gap={3} flexDir="column">
              {data.images.map((image, index) => (
                <img key={index} src={image.imageUrl} alt="" />
              ))}
            </Flex>
          </Box>
        </>
      )}
      <Flex mt={12} align="center" justify="end">
        <Text fontSize="xs">作成者</Text>
        <Box ml={2}>{getUserName(data?.author)}</Box>
      </Flex>
    </Container>
  );
};

export default CustomerInfoById;
