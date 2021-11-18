import NextLink from 'next/link';
import { UserIcon } from '@/styles/icons';
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Button, Link, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { highlight_color } from '@/styles/colorModeValue'

export default function UserMenu() {

    const router = useRouter()
    const { locale } = router
    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)

    return (
        <Menu autoSelect={false}>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<UserIcon width={7} height={7} color={router.route.includes('account') && highLightColor} />}
                bg='none'
                _expanded={{ bg: "none" }}
                _focus={{ bg: "none" }}
            />
            <MenuList zIndex='3'>
                <MenuItem><NextLink href="/account" passHref><Link w='full'>{locale === 'en' ? 'Account' : 'アカウント'}</Link></NextLink></MenuItem>
                <MenuItem><Link href="/api/auth/logout" w='full'>{locale === 'en' ? 'Logout' : 'ログアウト'}</Link></MenuItem>
            </MenuList>
        </Menu>
    );
}