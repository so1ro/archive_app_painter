
import { Box, Link, Heading, Grid, GridItem, Square, Text } from '@chakra-ui/react';
import Image from 'next/image'

export default function TopShop({ productTextImage }) {
    return (
        <Box>
            <Heading mb={4} as="h2" size="lg">Shop</Heading>
            <Grid gap={3} templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}>
                {productTextImage.map(pro => (
                    <GridItem key={pro.sys.id} overflow='hidden'>
                        <Link href={pro.url} isExternal>
                            <Square borderRadius={12} overflow='hidden'>
                                <Image
                                    src={pro.productImage.url}
                                    alt={pro.productName}
                                    width={540}
                                    height={540}
                                />
                            </Square>
                            <Text fontSize={{ base: 'xs', sm: 'sm' }} mt={1} isTruncated>{pro.productName}</Text>
                        </Link>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
}