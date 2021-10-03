import { Box, Container } from '@chakra-ui/react'
import Image from 'next/image'
import HeroSnsIcons from '@/components/HeroSnsIcons'
import HeroArchiveLink from '@/components/HeroArchiveLink'
import { useWindowSizeOrientation } from '@/utils/useWindowSize'
import { useMediaQuery } from '@/utils/useMediaQuery'

export default function Hero({ todayImgPair }) {

    const { height: innerHeight } = useWindowSizeOrientation()
    const isLargerThan992 = useMediaQuery("(min-width: 992px)")

    return (
        <Box pos='relative'>
            <Box>
                {/* {todayImgPair.map((img, i) => ( */}
                {!isLargerThan992 &&
                    <Container h={`${innerHeight}px`} zIndex={'-1'}>
                        <Image src={todayImgPair[0].url}
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                            priority={true}
                            alt='スーツ' />
                    </Container>}
                {isLargerThan992 &&
                    <Container h={`${innerHeight}px`} zIndex={'-1'}>
                        <Image src={todayImgPair[1].url}
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                            priority={true}
                            alt='スーツ' />
                    </Container>}
                {/* ))} */}
            </Box>
            <HeroArchiveLink />
            <HeroSnsIcons />
        </Box>
    )
}

