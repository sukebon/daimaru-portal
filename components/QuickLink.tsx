import { Box, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { NextPage } from 'next';
import Link from 'next/link';

const QuickLink: NextPage<any> = (props) => {
  return (
    <>
      <Box width='100%' boxShadow='xs' mt='6' p='6' rounded='md' bg='white'>
        <Text fontSize='2xl' mt='1' ml='1'>
          クイックアクセスリンク
        </Text>
        <UnorderedList spacing={3} my='3' mx='6'>
          {props.link.map((value: any) => (
            <ListItem key={value.id}>
              <Link href={value.link}>
                <a target='_blank'>{value.title}</a>
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </>
  );
};

export default QuickLink;
