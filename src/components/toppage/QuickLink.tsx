import { CategoryData, LinkData } from "@/pages";
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

type Props = {
  links: LinkData[];
  categories: CategoryData[];
};

const QuickLink: NextPage<Props> = ({ links, categories }) => {
  return (
    <>
      <Box
        width="full"
        boxShadow="xs"
        p={{ base: 3, md: 6 }}
        rounded="md"
        bg="white"
      >
        <Text fontSize="2xl" my="1" ml="1">
          クイックアクセスリンク
        </Text>

        <Tabs variant="enclosed">
          <TabList mt={3} >
            {categories?.map((category) => (
              <Tab key={category.id} _focus={{ outline: "none", fontWeight: "bold" }}>
                {category.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {categories.map((category) => (
              <TabPanel key={category.id}>
                <UnorderedList spacing={3} mx={6} mt={3}>
                  {links
                    .filter(
                      (link) =>
                        link.category?.name === category.name && true
                    )
                    .map((link) => (
                      <ListItem key={link.id}>
                        <Text
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
