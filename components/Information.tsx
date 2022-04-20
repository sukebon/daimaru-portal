import { Box, List, Text } from '@chakra-ui/react';
import { NextPage } from 'next';

const Information: NextPage<any> = (props) => {
  const news = props.news;
  return (
    <>
      <Box width='100%' boxShadow='xs' mt='6' p='6' rounded='md' bg='white'>
        <Text fontSize='2xl' mb='4' ml='1'>
          [お知らせ]
        </Text>
        <List spacing={3}>
          {props.news.map((value: any) => (
            <Text
              pb='2'
              key={value.id}
              borderBottom='1px'
              borderColor='#eeeeee'
            >
              {value.message}
            </Text>
          ))}
        </List>
      </Box>
    </>
  );
};

export default Information;
