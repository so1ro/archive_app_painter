import { ReactNode } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MotionIconBox } from '@/components/Chakra_Framer/element';
import { hero_icon_twitter_variants, hero_icon_instagram_variants } from '@/components/Chakra_Framer/variants';
import { TwitterIcon, InstagramIcon } from '@/styles/icons';

import { useMediaQuery } from '@/utils/useMediaQuery'

export default function HeroSnsIcons() {

    const isLargerThan992 = useMediaQuery("(min-width: 992px)")
    const iconSize = { base: 8, lg: 10 }

    const HeroSnsIconsBox = ({ children, href, variants }: { children: ReactNode, href: string, variants: any }) => {
        return (
            <Box>
                <NextLink href={href}>
                    <MotionIconBox
                        whileHover={{ scale: 1.1 }}
                        initial={isLargerThan992 ? "hidden" : ''}
                        animate={isLargerThan992 ? "visible" : ''}
                        variants={variants}>
                        {children}
                    </MotionIconBox>
                </NextLink>
            </Box>
        );
    };

    return (
        <VStack
            spacing={{ base: 5, lg: 6 }}
            pos='absolute'
            bottom={{ base: 6, lg: 16 }}
            right={{ base: 4, lg: 8 }}>
            {<HeroSnsIconsBox href='/twitter' variants={hero_icon_twitter_variants}>
                <TwitterIcon width={iconSize} height={iconSize} color='#FFF' />
            </HeroSnsIconsBox>}
            {<HeroSnsIconsBox href='/instagram' variants={hero_icon_instagram_variants}>
                <InstagramIcon width={iconSize} height={iconSize} color='#FFF' />
            </HeroSnsIconsBox>}
        </VStack>
    );
}