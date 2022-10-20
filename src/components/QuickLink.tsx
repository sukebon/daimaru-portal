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

const QuickLink: NextPage<any> = ({ links, categories }) => {
  return (
    <>
      <Box
        width="100%"
        boxShadow="xs"
        p={{ base: 3, md: 6 }}
        rounded="md"
        bg="white"
      >
        <Text fontSize="2xl" my="1" ml="1">
          クイックアクセスリンク
        </Text>

        <Tabs>
          <TabList mt={3}>
            {categories?.map((c: any) => (
              <Tab key={c.id} _focus={{ outline: "none" }}>
                {c.name}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {categories.map((category: any) => (
              <TabPanel key={category.id}>
                <UnorderedList spacing={3} mx="6" mt={3}>
                  {links
                    .filter(
                      (link: any) =>
                        link.category?.name === category.name && true
                    )
                    .map((link: any) => (
                      <ListItem key={link.id}>
                        <Link href={link.link}>
                          <a target="_blank">
                            <Box
                              fontWeight={
                                link.bold === true ? "bold" : "normal"
                              }
                            >
                              {link.title}
                            </Box>
                          </a>
                        </Link>
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
