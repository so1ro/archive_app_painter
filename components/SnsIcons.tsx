import NextLink from 'next/link';
import { TwitterIcon, InstagramIcon, MailIcon } from '@/styles/icons';
import { useColorMode } from "@chakra-ui/react"
import { MotionIconStack } from '@/components/Chakra_Framer/element';
import { nav_link_variants } from '@/components/Chakra_Framer/variants';

export default function SnsIcons({ animation, type, onHandler }: { animation: boolean, type: string, onHandler: () => void | null }) {

    const { colorMode, toggleColorMode } = useColorMode()
    const colorHnadler = (mode) => mode === 'light' ? "#000" : "#fff"

    return (
        <MotionIconStack
            direction={["row"]}
            spacing={8}
            pt={type === 'NavModal' ? 8 : 2}
            initial={animation ? "hidden" : ''}
            animate={animation ? "visible" : ''}
            variants={nav_link_variants}
        >
            <NextLink href={'/twitter'} passHref>
                <TwitterIcon width={6} height={6} color={colorHnadler(colorMode)} onClick={onHandler} cursor='pointer' />
            </NextLink>
            <NextLink href={'/instagram'} passHref>
                <InstagramIcon width={6} height={6} color={colorHnadler(colorMode)} onClick={onHandler} cursor='pointer' />
            </NextLink>
            <NextLink href={'/contact'} passHref>
                <MailIcon width={6} height={6} color={colorHnadler(colorMode)} onClick={onHandler} cursor='pointer' />
            </NextLink>
        </MotionIconStack>
    );
}
