import { Box, Link, HStack, Stack, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { TwitterIcon, InstagramIcon } from '@/styles/icons'
import { RepeatIcon } from '@chakra-ui/icons'
import { text_humble_color } from '@/styles/colorModeValue'

export default function NavSNS({ items }: { items?: NavItem[] }) {

    const router = useRouter()
    const { path } = router.query
    const root = router.pathname.includes('twitter') ? 'twitter' : 'instagram'
    const iconSize = 8
    const repeatIconSize = 5
    const textHumbleColor = useColorModeValue(text_humble_color.l, text_humble_color.d)

    return (
        <Stack
            direction='column'
            align='center'
            // direction={{ base: 'column', lg: 'row' }}
            // align={{ base: 'center', lg: '' }}
            // justify={{ base: '', lg: 'space-between' }}
            // w='full'
            pt={{ base: 12, lg: 16 }}
            pb={{ base: 12 }}
            spacing={4} w='full' maxW={root === 'twitter' ? '550px' : null}>
            {root === 'twitter' && <TwitterIcon width={iconSize} height={iconSize} color={useColorModeValue('gray.600', '#fff')} />}
            {root === 'instagram' && <InstagramIcon width={iconSize} height={iconSize} color={useColorModeValue('gray.600', '#fff')} />}
            {items && <HStack
                flexWrap='wrap'
                spacing={{ base: 4, md: 6 }}
                justify='center'
                px='0'
                alignSelf={{ base: 'center', lg: 'flex-end' }}
            >
                {items.map(item => (
                    // itemを統合し、Keyを入れる。 
                    (<NextLink href={`/${root}/${item.path}`} key={item.id} passHref>
                        <Link fontSize={{ base: 'sm', md: 'md' }} className={path === item.path ? 'active' : ''}>{item.name}</Link>
                    </NextLink>)
                ))
                }</HStack>}
            {/* <RepeatIcon
                width={repeatIconSize} height={repeatIconSize} cursor='pointer' alignSelf='flex-end'
                color={textHumbleColor} onClick={() => router.reload()} /> */}
        </Stack>
    )
}