import { Box, Flex, List, Text } from '@chakra-ui/react';
import { NextPage } from 'next';

const Information: NextPage<any> = (props) => {
  return (
    <>
      <Box width='100%' boxShadow='xs' mt='6' p='6' rounded='md' bg='white'>
        <Text fontSize='2xl' mb='4' ml='1'>
          お知らせ
        </Text>
        <List spacing={3}>
          {props.news.map((value: any) => (
            <>
              <Text mx='3' pb='2' borderBottom='1px' borderColor='#eeeeee'>
                <Flex alignItems={'center'}>
                  <Box key={value.id}>{value.message}</Box>
                </Flex>
              </Text>
            </>
          ))}
        </List>
      </Box>
    </>
  );
};

export default Information;
