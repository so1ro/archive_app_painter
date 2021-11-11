import { Box, Container } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { MotionButton } from '@/components/Chakra_Framer/element';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { highlight_color } from '@/styles/colorModeValue';
import { hero_archive_link_variants } from '@/components/Chakra_Framer/variants';

export default function HeroArchiveLink() {

    const { locale } = useRouter()
    const { colorMode } = useColorMode()
    const bgColor = useColorModeValue(highlight_color.l, highlight_color.d)

    return (
        <Box
            pos='absolute'
            bottom={20}
            left='50%'
            transform='translateX(-50%)'
        >
            <NextLink href={'/archive'}>
                <MotionButton
                    borderRadius='full'
                    bg={bgColor}
                    px={{ base: 6, md: 8 }}
                    py={2}
                    color={colorMode === 'light' ? '#FFF' : '#000'}
                    fontSize={{ base: 'md', lg: 'xl' }}
                    fontWeight='normal'
                    _hover={{ bg: bgColor }}
                    _active={{ bg: bgColor }}
                    // Framer //
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.1 }}
                    variants={hero_archive_link_variants}
                >
                    {locale === 'en' ? 'Go to Archive' : 'アーカイブへ'}
                </MotionButton>
            </NextLink>
        </Box>
    );
}