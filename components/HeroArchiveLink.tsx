import { useUser } from '@auth0/nextjs-auth0'
import { Box, Container } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MotionButton } from '@/components/Chakra_Framer/element'
import { HStack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { highlight_color } from '@/styles/colorModeValue'
import { hero_archive_link_variants } from '@/components/Chakra_Framer/variants'
import { PlayVideoIcon } from '@/styles/icons'
import Image from 'next/image'

export default function HeroArchiveLink({ introTextAvatar }) {

    const { user, error, isLoading } = useUser()
    const { locale } = useRouter()
    const { colorMode } = useColorMode()
    const bgColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const avatarSize = { base: 12, lg: 14 }

    if (user) {
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
            </Box>)
    } else {
        return (
            <Box
                pos='absolute'
                bottom={20}
                left='50%'
                transform='translateX(-50%)'
            >
                <NextLink href={'/archive'}>
                    <HStack
                        // d={{ base: 'none', lg: 'flex' }} 
                        bg={bgColor} borderRadius='full'
                        spacing={2} pl={6} pr={3} py={2}
                        color={colorMode === 'light' ? '#FFF' : '#000'}
                        cursor='pointer'>
                        <PlayVideoIcon color={colorMode === 'light' ? '#FFF' : '#000'} size={20} />
                        <Text pr={2}>{locale === 'en' ? 'About Archive' : 'アーカイブについて'}</Text>
                        <Box w={avatarSize} h={avatarSize} borderRadius='full' overflow='hidden' mx="auto">
                            <Image
                                src={introTextAvatar.avatar.url}
                                width='192px'
                                height='192px'
                                alt='Author' />
                        </Box>
                    </HStack>
                </NextLink>
            </Box>
        )
    }
}