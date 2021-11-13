import { useState } from 'react'
import Image from 'next/image'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    Flex,
    Box,
    Button,
    Spinner,
} from "@chakra-ui/react"
import {
    useDisclosure,
    useColorModeValue,
} from "@chakra-ui/react"
import { css } from "@emotion/react"

import { bg_color, highlight_color } from '@/styles/colorModeValue'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { ZoomIcon } from '@/styles/icons'

export default function ZoomImgModal({ archive, path, setIsQuitVideo }: { archive: AllArchives2Interface, path: string, setIsQuitVideo?: ({ isQuitVideo: boolean }) => void }) {

    // Hook
    const { isOpen, onOpen, onClose } = useDisclosure()

    // State
    const [{ isIframeLoading }, setIsIframeLoading] = useState<{ isIframeLoading: boolean }>({ isIframeLoading: true })
    const zoomIconSize = { base: 6, md: 8 }
    const ArrowIconPosition = { base: 4, md: 6 }
    const iframeCss = css`
		iframe {
			flex-grow: 1;
			width: 100%;
		}
	`

    return (
        <Box
            d={{ base: "block", lg: "block" }} w='full'
            h={archive?.youtubeId ? { base: '140px', md: '320px' } : { base: '320px', sm: '480px', md: '700px' }}
            overflow={archive?.youtubeId ? 'hidden' : 'visible'}
            pos='relative' borderRadius={archive?.youtubeId ? '12px' : '0px'} cursor='zoom-in'
            onClick={() => {
                setIsQuitVideo({ isQuitVideo: true })
                onOpen()
            }}>
            <Image
                src={archive.image.url}
                layout='fill' objectFit={archive?.youtubeId ? 'cover' : 'contain'}
                alt="Zoom Picture" />
            <Box pos='absolute' bottom={archive?.youtubeId ? 4 : 0}
                transform={archive?.youtubeId ? '' : 'translateY(50%)'} right={6}
                p={{ base: 2, md: 3 }} borderRadius={48} bg='white'
                boxShadow='0 0 4px rgb(0 0 0 / 14%), 0 4px 8px rgb(0 0 0 / 28%)'>
                <ZoomIcon w={zoomIconSize} h={zoomIconSize} color='black' />
            </Box>
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
                        h='100vh' css={iframeCss}>
                        {isIframeLoading &&
                            <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200"
                                color={useColorModeValue(highlight_color.l, highlight_color.d)} size="md"
                                pos='absolute' top='50%' left='50%' transform='traslateX(-50%) traslateY(-50%)' />}
                        <iframe
                            src={`${path}/index.html?z=${archive.archiveNumber}`}
                            onLoad={() => setIsIframeLoading({ isIframeLoading: false })}
                            allowFullScreen />
                    </Flex>
                    <Flex onClick={() => {
                        setIsIframeLoading({ isIframeLoading: true })
                        setIsQuitVideo({ isQuitVideo: false })
                        onClose()
                    }}
                        borderRadius={40}
                        w={12} h={12}
                        bgColor='rgba(0,0,0, 0.6)'
                        align='center'
                        justify='center'
                        pos='absolute' top={ArrowIconPosition} left={ArrowIconPosition} colorScheme='blackAlpha' color='#fff'>
                        <ArrowBackIcon w={6} h={6} />
                    </Flex>
                </ModalContent>
            </Modal>
        </Box>
    )
}
