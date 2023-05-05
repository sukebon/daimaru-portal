import { Box, Flex, List, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { NewsData } from "../../../types";

type Props = {
  news: NewsData[];
};

const Information: NextPage<Props> = ({ news }) => {
  return (
    <Box
      w="full"
      boxShadow="xs"
      p={{ base: 3, md: 6 }}
      rounded="md"
      bg="white"
    >
      <Text fontSize="2xl" mb="4" ml="1">
        お知らせ
      </Text>
      <List spacing={3}>
        {news.map(({ id, message }) => (
          <Box
            key={id}
            mx="3"
            pb="2"
            borderBottom="1px"
            borderColor="#eeeeee"
          >
            <Flex align={"center"}>
              <Box dangerouslySetInnerHTML={{ __html: message }}></Box>
            </Flex>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Information;
