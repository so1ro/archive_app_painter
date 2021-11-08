import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { TwitterIcon, InstagramIcon, MailIcon } from '@/styles/icons'
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { MotionIconStack } from '@/components/Chakra_Framer/element'
import { nav_link_variants } from '@/components/Chakra_Framer/variants'
import { highlight_color } from '@/styles/colorModeValue'

export default function SnsIcons({ animation, type, onHandler }:
    { animation: boolean, type: string, onHandler: () => void | null }) {

    const router = useRouter()
    const { colorMode, toggleColorMode } = useColorMode()
    const colorHnadler = (mode) => mode === 'light' ? "#000" : "#fff"
    const iconSize = type === 'nav' ? 5 : 6
    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)

    return (
        <MotionIconStack
            direction={["row"]}
            spacing={type === 'nav' ? 6 : 8}
            pt={type === 'nav' ? 0 : (type === 'NavModal' ? 8 : 2)}
            initial={animation ? "hidden" : ''}
            animate={animation ? "visible" : ''}
            variants={nav_link_variants}
        >
            <NextLink href={'/twitter'} passHref>
                <TwitterIcon width={iconSize} height={iconSize}
                    color={type === 'nav' && router.asPath.includes('twitter') ? highLightColor : colorHnadler(colorMode)}
                    onClick={onHandler} cursor='pointer' _hover={{ color: highLightColor }} />
            </NextLink>
            <NextLink href={'/instagram'} passHref>
                <InstagramIcon width={iconSize} height={iconSize}
                    color={type === 'nav' && router.asPath.includes('instagram') ? highLightColor : colorHnadler(colorMode)}
                    onClick={onHandler} cursor='pointer' _hover={{ color: highLightColor }} />
            </NextLink>
            <NextLink href={'/contact'} passHref>
                <MailIcon width={iconSize} height={iconSize}
                    color={type === 'nav' && router.asPath.includes('contact') ? highLightColor : colorHnadler(colorMode)}
                    onClick={onHandler} cursor='pointer' _hover={{ color: highLightColor }} />
            </NextLink>
        </MotionIconStack>
    )
}
