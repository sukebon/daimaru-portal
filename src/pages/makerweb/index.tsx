import {
  Box,
  Container,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { MakerWeb } from "../../../types";

type Props = {
  posts: MakerWeb[];
};

const MakerWeb: NextPage<Props> = ({ posts }) => {
  return (
    <Container maxW="900px" p={6} rounded="md" bg="white" boxShadow="xs">
      <TableContainer>
        <Box as="h1" fontSize="2xl">
          メーカーWEB発注リスト
        </Box>
        <Table variant="simple" mt={6}>
          <TableCaption>メーカー名（順不同・敬称略）</TableCaption>
          <Thead>
            <Tr>
              <Th>メーカー名</Th>
              <Th>ID</Th>
              <Th>password</Th>
              <Th>取引コード</Th>
            </Tr>
          </Thead>

          <Tbody>
            {posts.map(({ id, url, name, userId, password, code }) => (
              <Tr key={id}>
                <Td>
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    passHref
                  >
                    <Box textDecoration="underline" _hover={{ opacity: "0.8" }}>
                      {name}
                    </Box>
                  </Link>
                </Td>
                <Td>{userId}</Td>
                <Td>{password}</Td>
                <Td>{code}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MakerWeb;

export const getStaticProps: GetStaticProps = async () => {
  const params = {
    headers: {
      "X-MICROCMS-API-KEY": "5cb4353cc17045be9dc39f4dd1cac7ff7fc9",
    },
  };

  const res = await fetch(
    `https://makerweb.microcms.io/api/v1/posts?limit=100`,
    params
  );
  const resJson = await res.json();
  let posts: MakerWeb[] = resJson.contents;
  posts.sort((a,b)=>{
    if(a.kana < b.kana) {
      return -1
    } else {
      return 1
    }
  })


  return { props: { posts } };
};
