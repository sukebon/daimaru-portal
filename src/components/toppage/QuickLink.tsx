import {
  Box,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { CategoryData, LinkData } from "../../../types";

type Props = {
  links: LinkData[];
  categories: CategoryData[];
};

const QuickLink: NextPage<Props> = ({ links, categories }) => {
  return (
    <>
      <Box
        w="full"
        boxShadow="xs"
        p={{ base: 6, md: 6 }}
        rounded="md"
        bg="white"
      >
        <Text fontSize="lg" fontWeight="bold">
          クイックアクセスリンク
        </Text>

        <Tabs variant="enclosed">
          <TabList mt={3}>
            {categories?.map((category) => (
              <Tab
              fontSize="xs"
                key={category.id}
                _focus={{ outline: "none", fontWeight: "bold" }}
              >
                {category.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {categories.map((category) => (
              <TabPanel key={category.id}>
                <UnorderedList spacing={2} mx={6} mt={3}>
                  {links
                    .filter(
                      (link) => link.category?.name === category.name && true
                    )
                    .map((link) => (
                      <ListItem key={link.id}>
                        <Text
                          fontSize="sm"
                          fontWeight={link?.bold === true ? "bold" : "normal"}
                        >
                          <Link href={link.link} target="_blank">
                            {link.title}
                          </Link>
                        </Text>
                      </ListItem>
                    ))}
                </UnorderedList>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default QuickLink;
