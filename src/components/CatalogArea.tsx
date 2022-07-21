import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

const CatalogArea = () => {
  return (
    <>
      <Flex
        width='100%'
        boxShadow='xs'
        mt='6'
        p='3'
        rounded='md'
        bg='white'
        justifyContent={{ base: 'center' }}
        flexDirection={{ base: 'column', md: 'row', lg: 'column', xl: 'row' }}
      >
        <Flex flex='2'>
          <Flex flex='1' p='3' justifyContent='center'>
            <Link href='https://my.ebook5.net/daimaru-hakui/my-uniform-club/'>
              <a target='_blank'>
                <Image
                  src='/myuni.jpg'
                  alt='myuni カタログ'
                  width={220}
                  height={300}
                />
              </a>
            </Link>
          </Flex>
          <Flex flex='1' p='3' justifyContent='center'>
            <Link href='https://my.ebook5.net/daimaru-hakui/serenade-vol5/'>
              <a target='_blank'>
                <Image
                  src='/serenade.jpg'
                  alt='serenade カタログ'
                  width={220}
                  height={300}
                />
              </a>
            </Link>
          </Flex>
        </Flex>
        <Flex
          flex='1'
          color='white'
          flexDirection='column'
          justifyContent='space-between'
          p={3}
          w='100%'
          h='300px'
        >
          <Box h='30%'>
            <Link href='https://myuni.vercel.app/'>
              <a target={'_blank'}>
                <Flex
                  h='100%'
                  minH='50px'
                  backgroundColor='rgb(45, 55, 72)'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Box fontSize={{ base: 'xs', md: 'md' }}>
                    マイユニポータル
                  </Box>
                </Flex>
              </a>
            </Link>
          </Box>
          <Box h='30%'>
            <Link href='https://www.daimaru-hakui.co.jp/'>
              <a target={'_blank'}>
                <Flex
                  height='100%'
                  minH='50px'
                  backgroundColor='rgb(49, 74, 151)'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Box fontSize={{ base: 'xs', md: 'md' }}>ホームページ</Box>
                </Flex>
              </a>
            </Link>
          </Box>
          <Box h='30%'>
            <Link href='https://stock-next.vercel.app/'>
              <a target={'_blank'}>
                <Flex
                  height='100%'
                  minH='50px'
                  backgroundColor='rgb(49, 151, 149)'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Box fontSize={{ base: 'xs', md: 'md' }}>在庫照会</Box>
                </Flex>
              </a>
            </Link>
          </Box>
          {/* <Box h='30%'>
            <Link href='https://stock-next.vercel.app/'>
              <a target={'_blank'}>
                <Flex
                  height='100%'
                  minH='50px'
                  backgroundColor='#00bcd4'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Box fontSize={{ base: 'xs', md: 'md' }}>予定表</Box>
                </Flex>
              </a>
            </Link>
          </Box> */}
        </Flex>
      </Flex>
    </>
  );
};

export default CatalogArea;
