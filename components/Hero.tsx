import { useState, useRef } from 'react'
import { Box, Container, Button, useColorModeValue, Spinner, HStack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import HeroSnsIcons from '@/components/HeroSnsIcons'
import HeroArchiveLink from '@/components/HeroArchiveLink'
import { useWindowSizeOrientation, useWindowSizeResize } from '@/utils/useWindowSize'
import { useMediaQuery } from '@/utils/useMediaQuery'
import { css } from "@emotion/react"
import { bg_color_nav, highlight_color } from '@/styles/colorModeValue'
import { motion } from 'framer-motion'
import { hero_video_variants } from './Chakra_Framer/variants'
import { useRouter } from 'next/router'
import { PlayVideoIcon } from '@/styles/icons'
import { ArrowDownIcon } from '@chakra-ui/icons'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SlickSlider from '@/components/SlickSlider'

export default function Hero({ heroSlideImgs, introTextAvatar, newArchives }) {

    // Hook
    const { height: innerHeight } = useWindowSizeResize()
    const isLargerThan992 = useMediaQuery("(min-width: 992px)")
    const video = useRef<HTMLVideoElement>()
    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const bgColorNav = useColorModeValue(bg_color_nav.l, bg_color_nav.d)
    const { locale } = useRouter()

    // State
    const [{ isVideoPlaying }, setIsVideoPlaying] = useState<{ isVideoPlaying: boolean }>({ isVideoPlaying: false })
    const [{ isVideoLoading }, setIsVideoLoading] = useState<{ isVideoLoading: boolean }>({ isVideoLoading: true })

    // Function
    const handleVideo = () => video.current.paused ? video.current.play() : video.current.pause()

    // Miscellaneous
    const avatarSize = { base: 12, lg: 14 }

    return (
        <Box pos='relative'>
            <Box>
                {/* {todayImgPair.map((img, i) => ( */}
                <Box d={{ base: 'block', lg: 'none' }} h={`${innerHeight}px`} zIndex={'-1'} overflow='hidden'>
                    <SlickSlider imgs={heroSlideImgs} h={`${innerHeight}px`} />
                    {/* <Image src={todayImgPair[0].url}
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                            priority={true}
                            alt='スーツ' /> */}
                </Box>
                <Box d={{ base: 'none', lg: 'block' }} h={`${innerHeight}px`} zIndex={'-1'} css={videoCss}>
                    {/* {isVideoLoading &&
                            <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200"
                                color={highLightColor} size="md"
                                pos='absolute' top='50%' left='50%' transform='traslateX(-50%) traslateY(-50%)' />} */}
                    {/* <motion.video
                            src="/video/mov.mp4" ref={video}
                            muted autoPlay playsInline loop
                            onPlay={() => setIsVideoPlaying({ isVideoPlaying: true })}
                            onPause={() => setIsVideoPlaying({ isVideoPlaying: false })}
                            onLoadStart={() => setIsVideoLoading({ isVideoLoading: true })}
                            onCanPlay={() => setIsVideoLoading({ isVideoLoading: false })}
                            initial={"hidden"}
                            animate={"visible"}
                            variants={hero_video_variants} /> */}
                    <motion.video
                        ref={video}
                        muted autoPlay playsInline loop
                        initial={"hidden"}
                        animate={"visible"}
                        variants={hero_video_variants}
                    >
                        <source src="/video/mov.mp4" type="video/mp4" />
                        <source src="/video/mov.webm" type="video/webm" />
                    </motion.video>
                    {/* <Button pos='absolute' top={24} right={8} onClick={handleVideo}>
                            {!isVideoPlaying ? 'Play' : 'Stop'}
                        </Button> */}
                </Box>
                {/* ))} */}
            </Box>
            <HeroArchiveLink />
            {/* <HeroSnsIcons /> */}
            <HStack spacing={2} pos='absolute' px={8} py={3} bottom={0} left={0} bgColor='rgb(36, 39, 41)' cursor='pointer'>
                <PlayVideoIcon size={20} />
                <Text color='white' pr={2}>{locale === 'en' ? 'About Archive' : 'アーカイブについて'}</Text>
                <Box w={avatarSize} h={avatarSize} borderRadius='full' overflow='hidden' mx="auto">
                    <Image
                        src={introTextAvatar.avatar.url}
                        width='192px'
                        height='192px'
                        alt='Author' />
                </Box>
            </HStack>
            {newArchives &&
                <a href="#news">
                    <HStack spacing={2} pos='absolute' px={6} py={3} bottom={4} right={6} bgColor={bgColorNav} borderRadius={48} cursor='pointer'>
                        <Text>{locale === 'en' ? 'News' : '新着'}</Text>
                        <ArrowDownIcon />
                    </HStack>
                </a>}
        </Box>
    )
}

// height: 100vh;
const videoCss = css`
video {
    min-height: 100vh;
    min-height: 100%;
    min-width: 100%;
    position: absolute;
    left: 50%;
    top: 0;
    vertical-align: middle;
    transform: translateX(-50%);
    object-fit: cover;
}
`