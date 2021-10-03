import React from 'react';
import { Text, VStack, Center, Spinner, useColorModeValue, Flex } from '@chakra-ui/react';
import { bg_color_content, highlight_color } from '@/styles/colorModeValue'

export default function LoadingSpinner() {

    const bgColor = useColorModeValue(bg_color_content.l, bg_color_content.d)

    return (
        <Flex flexGrow={1} direction='row' bg={bgColor}>
            <Center w='full'>
                <VStack spacing={4}>
                    <Spinner thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color={useColorModeValue(highlight_color.l, highlight_color.d)}
                        size="xl" />
                    <Text fontSize='sm'>このまま少々お待ち下さい...</Text>
                </VStack>
            </Center>
        </Flex>
    );
}