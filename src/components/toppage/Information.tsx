import { Box, Flex, List, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { NewsData } from "../../../types";

type Props = {
  news: NewsData[];
};

const Information: NextPage<Props> = ({ news }) => {
  return (
    <Box
      flex="1"
      boxShadow="xs"
      p={{ base: 6, md: 6 }}
      rounded="md"
      bg="white"
    >
      <Box fontSize="lg" fontWeight="bold">
        お知らせ
      </Box>
      <List spacing={3} w="full">
        {news.map(({ id, message }) => (
          <Box key={id} pb="2" borderBottom="1px" borderColor="#eeeeee">
            <Flex align={"center"}>
              <Box
                fontSize="sm"
                lineHeight="6"
                dangerouslySetInnerHTML={{ __html: message }}
              ></Box>
            </Flex>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Information;
