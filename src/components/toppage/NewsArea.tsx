import { Box, keyframes } from "@chakra-ui/react";
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
    transform:translateX(0)
}
100% {
    transform:translateX(-200%)
}`;

export const NewsArea: NextPage = () => {
  const [total, setTotal] = useState(0);
  const [animation, setAnimation] = useState("");
  const [news, setNews] = useState<News[]>([]);


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
  }, [total]);

  useEffect(() => {
    setAnimation(`${animationkeyframes} ${news.length * window.innerWidth / 30
      }s linear infinite`);
    getUlWidth();
  }, [news]);


  const getUlWidth = () => {
    let sum = 0;
    const ul = document.querySelector("#ul");
    const ulwidth = ul?.clientWidth || 0;
    const lists = document.querySelectorAll("#list");
    lists.forEach((list: any) => {
      sum += list.clientWidth;
    });
    setTotal(sum > ulwidth ? sum : ulwidth);
  };

  return (
    <>
      {news?.length > 0 && (

        <Box
          py={3}
          w='full'
          boxShadow="xs"
          rounded="md"
          bg="white"
          overflow="hidden"
          whiteSpace='nowrap'
          display="flex"
        >
          <Box
            as="ul"
            id="ul"
            pl="100%"
            // w={total > 0 ? total + "px" : "100%"}
            fontSize="sm"
            animation={animation}
          >
            {news.map(({ id, calendar, content }) => (
              <Box as="li" pr="12" id="list"
                key={id} listStyleType='none' display="inline-block">
                {calendar && format(new Date(calendar), "yyyy年MM月dd日")} {content}
              </Box>
            ))}
          </Box>
          <Box
            as="ul"
            id="ul"
            pl="100%"
            w={total > 0 ? total + "px" : "100%"}
            fontSize="sm"
            animation={animation}
          >
            {news.map(({ id, calendar, content }) => (
              <Box as="li" pr="12" id="list"
                key={id} listStyleType='none' display="inline-block">
                {calendar && format(new Date(calendar), "yyyy年MM月dd日")} {content}
              </Box>
            ))}
          </Box>
        </Box >
      )}
    </>
  );
};;
