import { ReactNode } from 'react';
import { Box, Container, useColorModeValue, VStack } from '@chakra-ui/react';
import { bg_color_content } from '@/styles/colorModeValue'

export default function PageShell(
    { children,
        customPT,
        customSpacing }:
        {
            children: ReactNode,
            customPT: object | null,
            customSpacing: object | null
        }) {

    const bgColor = useColorModeValue(bg_color_content.l, bg_color_content.d)

    return (
        <Box bg={bgColor} flexGrow={1} pb={10}>
            <Container maxW='1000px'>
                <VStack py={customPT ?? { base: 12, lg: 24 }} pb={{ base: 12, lg: 24 }} spacing={customSpacing ?? { base: 24, lg: 32 }}>
                    {children}
                </VStack>
            </Container >
        </Box>
    );
}