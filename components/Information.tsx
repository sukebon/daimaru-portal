import { Box, Flex, List, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';

const Information: NextPage<any> = (props) => {
  return (
    <>
      <Box width='100%' boxShadow='xs' mt='6' p='6' rounded='md' bg='white'>
        <Text fontSize='2xl' mb='4' ml='1'>
          [お知らせ]
        </Text>
        <List spacing={3}>
          {props.news.map((value: any) => (
            <>
              <Text
                pb='2'
                key={value.id}
                borderBottom='1px'
                borderColor='#eeeeee'
              >
                <Flex alignItems={'center'}>
                  {/* <BsFillArrowRightCircleFill
                    style={{ marginRight: '0.5rem' }}
                  /> */}
                  {value.message}
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
