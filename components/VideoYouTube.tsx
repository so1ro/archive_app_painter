import { Box } from '@chakra-ui/react'
import YouTube from '@u-wave/react-youtube'
import { useRouter } from 'next/router'
import { css } from "@emotion/react"

export default function VideoYouTube({
    youtubeId,
    aspect,
    autoplay,
    borderRadius,
    skipTime,
    isQuitVideo,
    onRouterPush }: {
        youtubeId: string | null,
        aspect: string | null,
        autoplay: boolean | null,
        borderRadius: number | null,
        skipTime: number | null,
        isQuitVideo: boolean | null,
        onRouterPush: () => void,
    }) {

    return (
        // aspect ex) '52.7%' or null, default '56.25%'
        <Box
            w='full' h='0'
            pt={aspect ? aspect : '56.25%'}
            alignSelf='center'
            bg='#000'
            overflow='hidden'
            pos='relative'
            borderRadius={borderRadius ?? '12px'}
        >
            {/* 16:9の通常のビデオサイズの場合、ptは56.25% */}
            <Box w='100%' h='100%' pos='absolute' left='0' top='0' css={youtubeBoxCss}>
                {!isQuitVideo &&
                    <YouTube
                        video={youtubeId}
                        width="100%"
                        autoplay={autoplay}
                        startSeconds={skipTime}
                        onEnd={() => onRouterPush()}
                    />
                }
            </Box>
        </Box>
    )
}

const youtubeBoxCss = css`
    iframe { height: 100%; }
`