import Image from "next/image"
import { Box, Grid, List, ListItem, useColorModeValue, Flex } from '@chakra-ui/react'
import { compareAsc } from "date-fns"
import { useRouter } from 'next/router'
import { useArchiveState } from '@/context/useArchiveState'
import { css } from "@emotion/react"
import { highlight_color, text_color, text_humble_color } from '@/styles/colorModeValue';
import { useUserMetadata } from "@/context/useUserMetadata"
import { isArchiveNotInTierPeriod_userIsNotSubscriber_checker } from "@/utils/helpers"

export default function ArchiveThumbnail({ archive, inVideoCompo, currentRoot, setSkipTime, playing, userTierPeriod, tierLableInfo }) {

    const router = useRouter()
    const { locale } = useRouter()
    const { setCurrentDisplayArchive, setScrollY, isShowingTierArchiveOnly, } = useArchiveState()
    const { subscription_state, } = useUserMetadata()

    const archiveTier = tierLableInfo
        .sort((i, j) => compareAsc(new Date(i.viewPeriod), new Date(j.viewPeriod)))
        .find(t => compareAsc(new Date(archive.publishDate), new Date(t.viewPeriod)) < 0)
        ?? { tierTitle: locale === 'en' ? 'Subscription' : 'サブスクリプション', viewPeriod: null }

    // Function
    const isArchiveNotInTierPeriod_userIsNotSubscriber =
        isArchiveNotInTierPeriod_userIsNotSubscriber_checker(subscription_state, archive, userTierPeriod)

    const textHumbleColor = useColorModeValue(text_humble_color.l, text_humble_color.d)
    const imgPlayingCss = css`
        width: 100%;

        > div {
          position: unset !important;
        }
      
        .image {
          object-fit: contain;
          width: 100% !important;
          position: relative !important;
          height: unset !important;
          ${playing && `border-bottom: 4px ${useColorModeValue(highlight_color.l, highlight_color.d)} solid!important;`}
          opacity : ${isArchiveNotInTierPeriod_userIsNotSubscriber ? '0.6' : '1'};
        }
    `

    const bgGradient = `linear-gradient(180deg, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.5) 100%);`
    const txShadow = `0px 1px 4px rgba(0, 0, 0, 0.90);`
    const boxShadow = () => isArchiveNotInTierPeriod_userIsNotSubscriber ? '' : `0px 16px 31px 7px rgba(0, 0, 0, 0.2);`

    return (
        <Grid
            templateColumns={!inVideoCompo ? { base: "1fr" } : { base: "1fr" }}
            gap={{ base: 4, md: 1 }}
            d={isShowingTierArchiveOnly && isArchiveNotInTierPeriod_userIsNotSubscriber ? 'none' : { base: 'grid', md: 'block' }}
            cursor={isArchiveNotInTierPeriod_userIsNotSubscriber ? 'default' : 'pointer'}
            onClick={() => {
                setSkipTime !== null && setSkipTime({ skipTime: 0 })
                setCurrentDisplayArchive({ currentDisplayArchive: archive })
                setScrollY({ scrollY: window.scrollY })
                router.push(`/archive/works/${archive.archiveNumber}`, null)
            }}
        >
            <Box
                overflow="hidden" css={imgPlayingCss}
                mb={{ base: 0, md: 1 }} pos='relative' w='full'
                verticalAlign='top' boxShadow={boxShadow()} borderRadius={12}
            >
                <Image
                    src={archive.thumbnail.url}
                    alt="Picture of the author"
                    layout="fill"
                    className={'image'}
                />
                <List m={0} fontSize={['xs', 'sm', 'md']}
                    opacity={isArchiveNotInTierPeriod_userIsNotSubscriber ? '0.6' : '1'}
                    w='full'
                    pos='absolute' bottom='0' zIndex='1' pt='100%' background={bgGradient}
                    pb={1.5} px={3}
                    color='white'
                >
                    <ListItem fontSize={inVideoCompo && 'xs'} fontWeight='bold' mb={1}
                        textShadow={txShadow} isTruncated>{archive.title[locale]}</ListItem>
                    {/* {!inVideoCompo && <ListItem color={textHumbleColor} fontSize='xs'>
                            {format(parseISO(archive.publishDate), "yyyy/MM/dd")}
                        </ListItem>} */}
                </List>
                {isArchiveNotInTierPeriod_userIsNotSubscriber &&
                    <List
                        pos='absolute'
                        zIndex='2'
                        w='full'
                        py={.5}
                        fontSize='sm'
                        top='50%'
                        transform='translateY(-50%)'
                        textAlign='center'
                        color={text_color.l}
                        bg='#fff'
                    >
                        <ListItem>{archiveTier.tierTitle}</ListItem>
                    </List>}
            </Box>
        </Grid>
    )
}