
import { Box, Button, HStack, Link, Text, useBreakpointValue, useColorMode, useToast, useColorModeValue } from '@chakra-ui/react'
import { highlight_color } from '@/styles/colorModeValue'
import { Toast } from '@/components/Toast'

export default function UserLoginSignup() {

    const highlighColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' })
    const { colorMode } = useColorMode()
    const toast = useToast()

    return (
        <>
            <HStack align="center" spacing={[2, 2, 3]}>
                <Link fontSize={["10px", "11px"]}
                    href="/api/auth/login?param=signup"
                    lineHeight='14px'
                    onClick={() => {
                        toast({ duration: 3000, render: () => (<Toast text={"サインアップに移動中..."} />) })
                    }}>初めての方は<br /><Text color={highlighColor}>サインアップ</Text>
                </Link>
                <Link href="/api/auth/login"><Button
                    size={buttonSize}
                    fontWeight='md'
                    colorScheme='gray'
                    border="1px"
                    borderColor={colorMode === 'light' ? "gray.300" : 'gray.600'}
                    onClick={() => {
                        toast({ duration: 3000, render: () => (<Toast text={"ログインに移動中..."} />) })
                    }}>ログイン</Button></Link>
            </HStack>
        </>
    )
}