import { Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";

const QuickLink: NextPage<any> = (props) => {
  return (
    <>
      <Box width="100%" boxShadow="xs" mt="6" p="6" rounded="md" bg="white">
        <Text fontSize="2xl" my="1" ml="1">
          クイックアクセスリンク
        </Text>
        <Flex flexDirection={{ base: "column", lg: "row" }} mt="5">
          <Box w={{ base: "100%", lg: "50%" }}>
            <UnorderedList spacing={3} mb="3" mx="6">
              {props.link.map(
                (value: any, index: number) =>
                  index <= 9 && (
                    <ListItem key={value.id}>
                      <Link href={value.link}>
                        <a target="_blank">{value.title}</a>
                      </Link>
                    </ListItem>
                  )
              )}
            </UnorderedList>
          </Box>
          <Box w={{ base: "100%", lg: "50%" }}>
            <UnorderedList spacing={3} mb="3" mx="6">
              {props.link.map(
                (value: any, index: number) =>
                  10 <= index && (
                    <ListItem key={value.id}>
                      <Link href={value.link}>
                        <a target="_blank">{value.title}</a>
                      </Link>
                    </ListItem>
                  )
              )}
            </UnorderedList>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default QuickLink;
