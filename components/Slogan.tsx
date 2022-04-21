import { Box, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';

interface Props {
  slogan: string;
}

const Slogan: NextPage<Props> = ({ slogan }) => {
  return (
    <Box width='100%' boxShadow='xs' mt='6' p='6' rounded='md' bg='white'>
      <Text fontSize='2xl' mt='1' ml='1'>
        スローガン
      </Text>

      <Text fontSize='2xl' my='3'>
        <Box lineHeight={10} dangerouslySetInnerHTML={{ __html: slogan }}></Box>
      </Text>
    </Box>
  );
};

export default Slogan;
