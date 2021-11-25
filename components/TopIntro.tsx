import { Box, Stack, Text, Link } from '@chakra-ui/react';
import Image from 'next/image'
import NextLink from 'next/link';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { highlight_color } from '@/styles/colorModeValue';

export default function TopIntro({ introTextAvatar }) {
    const avatarSize = { base: 36, lg: 48 }
    return (
        <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: 4, lg: 12 }}>
            <Box w={avatarSize} h={avatarSize} borderRadius='full' overflow='hidden' mx="auto">
                <Image
                    src={introTextAvatar.avatar.url}
                    width='192px'
                    height='192px'
                    alt='Painter ボタニカルアート' />
            </Box>
            <Box fontSize={{ base: 'md', lg: 'xl' }}>
                <Text maxW='600px'>{introTextAvatar.text}</Text>
                <Text maxW='600px' mt={4}>
                    アーカイブの詳細は、<NextLink href={'/archive'} passHref>
                        <Link color={useColorModeValue(highlight_color.l, highlight_color.d)}>こちら</Link>
                    </NextLink>
                </Text>
            </Box>
        </Stack>
    );
}