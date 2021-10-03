import { Box } from '@chakra-ui/react';
import { useColorMode } from "@chakra-ui/react"
import { MoonIcon, SunIcon } from '@/styles/icons'

export default function ColorModeButton() {

    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Box onClick={toggleColorMode} size="md" p={0}>
            {colorMode === "light" ? <MoonIcon width={5} height={5} mb="2px" /> : <SunIcon width={5} height={5} />}
        </Box>
    );
}