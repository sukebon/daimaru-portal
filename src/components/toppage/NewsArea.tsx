import { Box, Flex, keyframes } from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { NextPage } from "next";
import { format } from "date-fns";

type News = {
  id: string;
  calendar: string;
  content: string;
};

const animationkeyframes = keyframes`
0% {
    transform:translateX(100%)
}
100% {
    transform:translateX(-100%)
}`;

export const NewsArea: NextPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const animation = `${animationkeyframes} ${
    news.length * window.innerWidth /50
  }s linear infinite`;
  useEffect(() => {
    const getNews = async () => {
      const collectionRef = collection(db, "news");
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      onSnapshot(q, (querySnapshot) => {
        setNews(
          querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as News)
          )
        );
      });
    };
    getNews();
  }, []);

  return (
    <>
      {news?.length > 0 && (
        <Flex
          w="100%"
          p={3}
          boxShadow="xs"
          rounded="md"
          bg="white"
          overflow="hidden"
        >
          <Flex
            w="full"
            gap={12}
            fontSize="sm"
            whiteSpace="nowrap"
            animation={animation}
          >
            {news.map(({ id, calendar, content }) => (
              <Box as="span" key={id}>
                  {calendar && format(new Date(calendar), "yyyy年MM月dd日")}　{content}
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </>
  );
};
