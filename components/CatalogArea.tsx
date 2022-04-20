import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const CatalogArea = () => {
  return (
    <>
      <Box
        width='100%'
        height='100%'
        boxShadow='xs'
        mt='6'
        p='3'
        rounded='md'
        bg='white'
      >
        <Flex color='white'>
          <Box flex='1' p='3'>
            <Link href='https://my.ebook5.net/daimaru-hakui/my-uniform-club/'>
              <a target='_blank'>
                <Image
                  src='/myuni.jpg'
                  alt='myuni カタログ'
                  width={220}
                  height={280}
                />
              </a>
            </Link>
          </Box>
          <Box flex='1' p='3'>
            <Link href='https://my.ebook5.net/daimaru-hakui/serenade/'>
              <a target='_blank'>
                <Image
                  src='/serenade.jpg'
                  alt='serenade カタログ'
                  width={220}
                  height={280}
                />
              </a>
            </Link>
          </Box>
          <Box flex='1' p='3' min-height='100%'>
            <Grid
              h='100%'
              templateRows='repeat(2, 1fr)'
              templateColumns='repeat(5, 1fr)'
              gap={3}
            >
              <GridItem rowSpan={1} colSpan={5} bg='#2d3748' rounded={5}>
                <Link href='https://01project-3zvmmmf3f-sukebon.vercel.app/catalog'>
                  <a target={'_blank'}>
                    <Flex
                      alignItems={'center'}
                      justifyContent={'center'}
                      height='100%'
                      p='1'
                    >
                      <Text fontSize={{ base: 'xs', md: 'lg' }}>
                        マイユニポータル
                      </Text>
                    </Flex>
                  </a>
                </Link>
              </GridItem>
              <GridItem rowSpan={1} colSpan={5} bg='#319795' rounded={5}>
                <Link href='https://stock-next.vercel.app/'>
                  <a target={'_blank'}>
                    <Flex
                      alignItems={'center'}
                      justifyContent={'center'}
                      height='100%'
                      p='1'
                    >
                      <Text fontSize={{ base: 'xs', md: 'lg' }}>在庫照会</Text>
                    </Flex>
                  </a>
                </Link>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default CatalogArea;
