import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { useMediaQuery } from '@/utils/useMediaQuery'

import { Flex, Stack, Text, useColorModeValue, Link, useColorMode } from '@chakra-ui/react'
import { } from "@chakra-ui/react"

import { bg_color_nav, bg_color_nav_top, text_BW } from '@/styles/colorModeValue'
import NavLinks from '@/components/NavLinks'
import UserMenu from '@/components/UserMenu'
import UserLoginSignup from '@/components/UserLoginSignup'
import ColorModeButton from '@/components/ColorModeButton'
import NextLink from 'next/link'
import Language from '@/components/Language'
import SnsIcons from './SnsIcons'
import { UserIcon } from '@/styles/icons'

export default function Nav() {
    // Hooks
    const router = useRouter()
    const { locale } = useRouter()
    const isTop = router.pathname === '/'
    const { user, error, isLoading } = useUser()
    const isLargerThan480 = useMediaQuery("(min-width: 480px)")
    const isLargerThan992 = useMediaQuery("(min-width: 992px)")

    const { colorMode } = useColorMode()
    const fontColor = useColorModeValue(text_BW.l, text_BW.d)
    const bgColor = isTop ?
        useColorModeValue(bg_color_nav_top.l, bg_color_nav_top.d) :
        useColorModeValue(bg_color_nav.l, bg_color_nav.d)


    return (
        <Flex
            backgroundColor="white"
            justifyContent="space-between"
            alignItems="center"
            px={[4]}
            py={[1, 1, 2]}
            w='full'
            color={fontColor}
            bg={bgColor}
            pos={isTop ? 'absolute' : 'relative'}
            top={isTop ? 0 : null}
            left={isTop ? 0 : null}
            zIndex={isTop ? 2 : null}
            borderBottom={(!isTop && colorMode === 'dark') ? `1px #2F4351 solid` : 0}
        >
            <Stack spacing={4} isInline alignItems="center">
                <NextLink href={'/'} passHref>
                    <Link>
                        <Text as="h1" fontSize={["lg", "xl"]} d={{ base: 'none', smd: 'none', lg: 'inline-block' }}>{locale === 'en' ? 'Michiko Shibata Botanical Art' : '芝田美智子 ボタニカルアート'}</Text>
                        <Text as="h1" fontSize={["lg", "xl"]} d={{ base: 'none', smd: 'inline-block', lg: 'none' }}>{locale === 'en' ? 'Michiko Shibata' : '芝田美智子 ボタニカルアート'}</Text>
                        <Text as="h1" fontSize={["lg", "xl"]} d={{ base: 'inline-block', smd: 'none', lg: 'none' }}>{locale === 'en' ? 'Michiko' : '芝田美智子'}</Text>
                    </Link>
                </NextLink>
            </Stack>
            <Flex alignItems="center">
                <NavLinks />
                <Stack spacing={3} isInline align="center" ml={5}>
                    {isLargerThan480 && <Language />}
                    {isLargerThan992 && <SnsIcons animation={false} type={'nav'} onHandler={null} />}
                    {isLoading ? <UserIcon width={7} height={7} py={2} /> : (user ? <UserMenu /> : <UserLoginSignup />)}
                    <ColorModeButton />
                </Stack>
            </Flex>
        </Flex>
    )
}
