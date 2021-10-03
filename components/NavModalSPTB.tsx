import { useUser } from '@auth0/nextjs-auth0'
import Nav from '@/components/Nav'
import ActiveLink from '@/components/ActiveLink'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    Flex,
    Box,
    Stack,
    VStack,
    Link,
    Divider,
    useToast,
    Text,
} from "@chakra-ui/react"
import {
    useDisclosure,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react"
import { MotionLink, MotionBox } from '@/components/Chakra_Framer/element'
import { nav_link_variants } from '@/components/Chakra_Framer/variants'

import Btn_hamburg from '@/components/BtnHamburg'
import SnsIcons from '@/components/SnsIcons'
import { bg_color, highlight_color, text_color } from '@/styles/colorModeValue'
import { nav_links } from '@/data/nav_links'
import { Toast } from '@/components/Toast'

export default function NavModalSPTB() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, error, isLoading } = useUser()
    const toast = useToast()
    const borderColor = useColorModeValue(text_color.l, text_color.d)
    const highlighColor = useColorModeValue(highlight_color.l, highlight_color.d)

    return (
        <Box d={{ base: "block", lg: "none" }}>
            <Btn_hamburg onHandler={onOpen} isOpen={isOpen} />
            <Modal
                onClose={onClose}
                isOpen={isOpen}
                motionPreset="none"
                size="full"
                isCentered>
                <ModalOverlay
                    bg={useColorModeValue(bg_color.l, bg_color.d)}
                />
                <ModalContent bg={useColorModeValue(bg_color.l, bg_color.d)} m={0}>
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        pos='absolute'
                        w='100vw'
                        h='100vh'>
                        <VStack spacing={5}>
                            {nav_links.map(link => (
                                <ActiveLink href={link.href} root={link.root} key={link.key}>
                                    <MotionLink
                                        onClick={onClose}
                                        initial="hidden"
                                        animate="visible"
                                        variants={nav_link_variants}
                                        fontSize={{ base: "md", md: 'lg' }}
                                    >{link.text}</MotionLink>
                                </ActiveLink>
                            ))}
                            {isLoading ? '' :
                                (user ?
                                    <>
                                        <Divider borderColor={borderColor} variant='dashed' />
                                        <MotionBox
                                            w='full'
                                            textAlign='center'
                                            initial="hidden"
                                            animate="visible"
                                            variants={nav_link_variants}>
                                            <ActiveLink href='/account' root='account' key='account'>
                                                <Link onClick={onClose} fontSize={{ base: "md", md: 'lg' }}>アカウント</Link>
                                            </ActiveLink>
                                        </MotionBox>
                                        <ActiveLink href='/api/auth/logout' root={null} key='logout' >
                                            <MotionLink
                                                onClick={onClose}
                                                initial="hidden"
                                                animate="visible"
                                                variants={nav_link_variants}
                                                fontSize={{ base: "md", md: 'lg' }}
                                            >ログアウト</MotionLink>
                                        </ActiveLink>
                                    </> :
                                    <>
                                        <Divider borderColor={borderColor} variant='dashed' />
                                        <MotionLink
                                            initial="hidden"
                                            animate="visible"
                                            variants={nav_link_variants}
                                            fontSize={{ base: "md", md: 'lg' }}
                                            href="/api/auth/login" onClick={() => {
                                                toast({ duration: 3000, render: () => (<Toast text={"ログインに移動中..."} />) })
                                            }}>ログイン</MotionLink>
                                        <MotionLink
                                            initial="hidden"
                                            animate="visible"
                                            variants={nav_link_variants}
                                            // fontSize="xl"
                                            href="/api/auth/login?param=signup"
                                            onClick={() => {
                                                toast({ duration: 3000, render: () => (<Toast text={"サインアップに移動中..."} />) })
                                            }}>初めての方は<br /><Text color={highlighColor}>サインアップ</Text>
                                        </MotionLink>
                                    </>)
                            }
                            {/* <SnsIcons animation={true} type={'NavModal'} onHandler={onClose} /> */}
                        </VStack>
                    </Flex>
                    <Btn_hamburg onHandler={onClose} isOpen={isOpen} />
                </ModalContent>
            </Modal>
        </Box>
    )
}
