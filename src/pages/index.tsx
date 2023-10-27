import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Information from "@/components/toppage/Information";
import QuickLink from "@/components/toppage/QuickLink";
import Slogan from "@/components/toppage/Slogan";
import CatalogArea from "@/components/toppage/CatalogArea";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { AlcoholCheckArea } from "@/components/toppage/AlcoholCheckArea";
import { ClaimArea } from "@/components/toppage/ClaimArea";
import { RequestArea } from "@/components/toppage/RequestArea";
import { SalesALert } from "@/components/toppage/SalesAlert";
import { CategoryData, LinkData, NewsData } from "../../types";
import { CuttingReportArea } from "@/components/toppage/CuttingReportArea";
import { ReceivablesArea } from "@/components/toppage/ReceivablesArea";
import { CustomerInfoArea } from "@/components/toppage/CustomerInfoArea";
import { useAuthStore } from "../../store/useAuthStore";
import { ClaimAlertArea } from "@/components/toppage/ClaimAlertArea";
import { PaymentConfAlert } from "@/components/toppage/PaymentConfAlert";
import { SalesArea } from "@/components/toppage/SalesArea";
import { NewsArea } from "@/components/toppage/NewsArea";

type Props = {
  categoryData: CategoryData[];
  newsData: NewsData[];
  linkData: LinkData[];
};

const Home: NextPage<Props> = ({ categoryData, newsData, linkData }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
 
  return (
    <>
      <Head>
        <title>大丸白衣ポータル</title>
        <meta name="description" content="大丸白衣ポータル" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SalesArea />
      <Box as="main">
        <Flex w="full" gap={6} flexDirection={{ base: "column", lg: "row" }}>
          <Box flex={1} maxW={{ base: "full", lg: "60%" }}>
            <Stack spacing={6}>
              <NewsArea />
              <SalesALert />
              <PaymentConfAlert />
              <ClaimAlertArea />
              <CuttingReportArea />
              <AlcoholCheckArea />
              <Flex
                direction={{
                  base: "column",
                  sm: "column",
                  md: "row",
                  lg: "row",
                  xl: "row",
                }}
                gap={6}
              >
                <Slogan />
                <ClaimArea />
              </Flex>
              <Flex
                w="full"
                direction={{
                  base: "column",
                  md: "column",
                  lg: "column",
                  xl: "column",
                  "2xl": "row",
                }}
                gap={6}
              >
                <Information news={newsData} />
                <CustomerInfoArea />
              </Flex>
              <Flex
                direction={{
                  base: "column",
                  md: "row-reverse",
                  lg: "column",
                  xl: "row-reverse",
                }}
                gap={6}
              >
                <ReceivablesArea />
                <QuickLink links={linkData} categories={categoryData} />
              </Flex>
              <CatalogArea />
            </Stack>
          </Box>
          <Box flex={1} maxW={{ base: "full", lg: "40%" }}>
            <Stack spacing={6}>
              <RequestArea />
            </Stack>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const accessPoint = "https://portal-site.microcms.io/api/v1";
  const options = {
    headers: {
      "X-MICROCMS-API-KEY": "5c23d3e8eaa0448388ca527e0e00c829611f",
    },
  };

  const categoryRes = await fetch(
    `${accessPoint}/categories?limit=20`,
    options
  );
  const categoryData = await categoryRes.json();
  const newsRes = await fetch(`${accessPoint}/news?limit=100`, options);
  const newsData = await newsRes.json();
  const linkRes = await fetch(`${accessPoint}/access-link?limit=100`, options);
  const linkData = await linkRes.json();

  return {
    props: {
      categoryData: categoryData.contents,
      newsData: newsData.contents,
      linkData: linkData.contents,
    },
  };
};
