import { Box, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';

interface Props {
  slogan: string;
}

const Slogan: NextPage<Props> = ({ slogan }) => {
  return (
    <Box width='100%' boxShadow='xs' mt='6' p='6' rounded='md' bg='white'>
      <h1>
        <Text fontSize='2xl'>{slogan}</Text>
      </h1>
    </Box>
  );
};

export default Slogan;
