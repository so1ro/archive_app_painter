import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from "next"
import NextLink from 'next/link'
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { useArchiveState } from "@/context/useArchiveState"
import { useMediaQuery } from '@/utils/useMediaQuery'
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

import { query_archiveRoute, query_allArchives, limitSkipNum } from "@/hook/contentful-queries"
import { fetchContentful, generateSearchQuery } from '@/hook/contentful'
import { format, parseISO, compareDesc } from "date-fns"

import { VStack, Box, Flex, Grid, List, ListItem, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useColorModeValue, HStack, Center, Link, useToast, Button, Spinner } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChevronRightIcon } from '@chakra-ui/icons'

import Video from '@/components/Video'
import VideoThumbnail from '@/components/VideoThumbnail'
import ArchiveDrawer from "@/components/ArchiveDrawer"
import ArchiveSideNav from '@/components/ArchiveSideNav'

import LoadingSpinner from '@/components/Spinner'
import { bg_color_content, highlight_color } from '@/styles/colorModeValue'
import ArchiveSearch from '@/components/ArchiveSearch'
import Alert from '@/components/AlertDialog'
import { postData } from '@/utils/helpers'
import { ToastError } from '@/components/Toast'

export default function ArchiveRoute({
    filteredDescArchive,
    filteredAscArchive,
    currentPaths,
    breadCrumbPaths,
    pathObj,
    filter,
    totalNumOfArchives }: {
        filteredDescArchive: AllArchivesInterface[],
        filteredAscArchive: AllArchivesInterface[],
        currentPaths: string[],
        breadCrumbPaths: string[],
        pathObj: ArchivePath[],
        filter: string | null,
        totalNumOfArchives: number | null,
    }) {
    // console.log('filteredDescArchive:', filteredDescArchive)

    // Hook
    const { user, error, isLoading } = useUser()
    const router = useRouter()
    const {
        isMetadataLoading,
        subscription_state,
        One_Pay_Detail,
        error_metadata,
        favoriteVideo,
        setFavoriteVideo } = useUserMetadata()
    const {
        searchKeyword,
        isSeaching,
        searchedArchiveResult,
        isWaitingSearchResult,
        setSearchedArchiveResult,
        isShowingSearchResult,
        setIsShowingSearchResult,
        isVideoMode,
        setIsVideoMode,
        isArchiveDesc,
        setIsArchiveDesc,
        isFetchingMoreContent,
        setIsFetchingMoreContent,
        scrollY,
        setScrollY, } = useArchiveState()
    const isLargerThan992 = useMediaQuery("(min-width: 992px)")
    const toast = useToast()
    useBottomScrollListener(() => {
        // When Searching, not fetch
        if (checkFavoriteRoute() && (skipNum >= favoriteVideo.length)) return
        if (!checkFavoriteRoute() && isSeaching || (skipNum >= totalNumOfArchives) || isVideoMode) return
        fetchContentHandler()
    }, { offset: 300 })

    // State
    const [{ descArchive }, setDescArchive] = useState<{ descArchive: AllArchivesInterface[] | null }>({ descArchive: null })
    const [{ ascArchive }, setAscArchive] = useState<{ ascArchive: AllArchivesInterface[] | null }>({ ascArchive: null })
    const [{ favoriteArchive }, setFavoriteArchive] = useState<{ favoriteArchive: AllArchivesInterface[] | null }>({ favoriteArchive: null })
    const [{ skipNum }, setSkipNum] = useState<{ skipNum: number }>({ skipNum: limitSkipNum })
    const [{ isFavoriteArchiveLoading }, setIsFavoriteArchiveLoading] = useState<{ isFavoriteArchiveLoading: boolean }>({ isFavoriteArchiveLoading: false })

    const filteredArchive = isArchiveDesc ? descArchive : ascArchive
    const checkFavoriteRoute = () => router.asPath.includes('favorite')

    let selectedArchive = isSeaching ? searchedArchiveResult :
        (checkFavoriteRoute() ? favoriteArchive : filteredArchive)

    // Effect
    useEffect(() => {
        // Only when you find router.query.id changing route, set isVideoMode true 
        router.query.id && setIsVideoMode({ isVideoMode: true })
        if (!router.query.id) {
            window.scrollTo({ top: scrollY })
            setScrollY({ scrollY: 0 })
        }
    }, [router.query.id])

    useEffect(() => {
        setDescArchive({ descArchive: filteredDescArchive })
        setAscArchive({ ascArchive: filteredAscArchive })
        setSkipNum({ skipNum: limitSkipNum })
        setScrollY({ scrollY: 0 })
        setIsArchiveDesc({ isArchiveDesc: true })
    }, [currentPaths.join('/')])

    // useEffect(() => {
    // }, [router.asPath])

    useEffect(() => {
        // Always before changing route, set isVideoMode false 
        const handleHistoryChange = (url, { shallow }) => { !url.includes('id=') && setIsVideoMode({ isVideoMode: false }) }
        router.events.on('routeChangeStart', handleHistoryChange)
        return () => { router.events.off('routeChangeStart', handleHistoryChange) }
    }, [])

    // favorite
    useEffect(() => {
        if (checkFavoriteRoute() && favoriteVideo.length > 0) {
            setIsFavoriteArchiveLoading({ isFavoriteArchiveLoading: true })
            const fetchFavoriteArchives = async () => {
                const filter = generateFavoriteFilter(favoriteVideo.slice(0, limitSkipNum))
                const { data: { archiveVideosCollection: { items } } } = await postData({
                    url: '/api/graphqlSearch',
                    data: { order: false, keyword: null, filter, skipNum: 0, limit: limitSkipNum, desc: null }
                })
                const fetchedArchives = favoriteVideo.slice(0, limitSkipNum).map(id => items.find(item => item.youtubeId === id))
                setFavoriteArchive({ favoriteArchive: fetchedArchives })
                setIsFavoriteArchiveLoading({ isFavoriteArchiveLoading: false })
            }
            fetchFavoriteArchives()
        }
    }, [router.asPath, favoriteVideo])


    // Functions
    const sortHandler = async (direction) => {
        direction === 'desc' ? setIsArchiveDesc({ isArchiveDesc: true }) : setIsArchiveDesc({ isArchiveDesc: false })
    }

    const fetchContentHandler = async () => {
        setIsFetchingMoreContent({ isFetchingMoreContent: true })
        let res
        if (!checkFavoriteRoute()) {
            res = await postData({
                url: '/api/graphqlSearch',
                data: { order: true, keyword: null, filter, skipNum, limit: limitSkipNum, desc: (currentPaths[0] === 'series' || currentPaths[0] === 'maniac') ? !isArchiveDesc : isArchiveDesc }
            })
        } else {
            const filter = generateFavoriteFilter(favoriteVideo.slice(skipNum, skipNum + limitSkipNum))
            res = await postData({
                url: '/api/graphqlSearch',
                data: { order: false, keyword: null, filter, skipNum: null, limit: null, desc: null }
            })
        }

        if (res.data && isArchiveDesc && !checkFavoriteRoute()) {
            const currentDescArchive = descArchive
            setDescArchive({ descArchive: [...currentDescArchive, ...res.data.archiveVideosCollection.items] })
        }
        if (res.data && !isArchiveDesc && !checkFavoriteRoute()) {
            const currentAscArchive = ascArchive
            setAscArchive({ ascArchive: [...currentAscArchive, ...res.data.archiveVideosCollection.items] })
        }
        if (res.data && checkFavoriteRoute()) {
            const currentFavoriteArchive = favoriteArchive
            const additionalArchive = favoriteVideo.slice(skipNum, skipNum + limitSkipNum).map(id => res.data.archiveVideosCollection.items.find(item => item.youtubeId === id))
            setFavoriteArchive({ favoriteArchive: [...currentFavoriteArchive, ...additionalArchive] })
        }

        const currentSkipNum = skipNum
        setSkipNum({ skipNum: currentSkipNum + limitSkipNum })

        if (res.error) toast({ duration: 6000, render: () => (<ToastError text={"ネット回線をご確認ください..."} />) })
        setIsFetchingMoreContent({ isFetchingMoreContent: false })
    }

    const generateFavoriteFilter = (favoriteVideo) => {
        const favoriteIds = favoriteVideo.map(v => (`{ youtubeId: '${v}' }`))
        return `{ OR: [${favoriteIds}] }`
    }

    const deleteFavorite = async () => {
        setFavoriteVideo({ favoriteVideo: [] })
        setFavoriteArchive({ favoriteArchive: [] })
        try {
            const { data } = await postData({
                url: '/api/auth/upsert-favorite-video',
                data: { auth0_UUID: user.sub, favoriteVideo: [] }
            }).then(data => data)
        } catch (e) {
            toast({ duration: 3000, render: () => (<ToastError text='サーバー上のお気に入り登録を削除できませんでした。' />) })
        }
    }

    // Miscellaneous
    const currentRoot = currentPaths.join('/')
    const arrowSize = { base: 6, md: 8 }
    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const bgColor = useColorModeValue(bg_color_content.l, bg_color_content.d)

    // Components
    const BreadcrumbNav = ({ paths }) => (
        <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize='md' >
            {paths.map((path, i) => (
                <BreadcrumbItem key={i}>
                    <BreadcrumbLink textDecoration='none' cursor='default'>{path}</BreadcrumbLink>
                </BreadcrumbItem>
            ))}
        </Breadcrumb>
    )


    const SortArrow = () => (
        !isSeaching && !checkFavoriteRoute() && <HStack>
            <ChevronDownIcon
                cursor='pointer'
                onClick={() => {
                    sortHandler('desc')
                    setSkipNum({ skipNum: descArchive.length })
                }}
                w={arrowSize} h={arrowSize}
                color={isArchiveDesc && highLightColor}
                transform={(router.asPath.includes('series') || router.asPath.includes('maniac')) && 'rotate(180deg)'} />
            <ChevronUpIcon
                cursor='pointer'
                onClick={() => {
                    sortHandler('asc')
                    setSkipNum({ skipNum: ascArchive.length })
                }}
                w={arrowSize} h={arrowSize}
                mr={8}
                color={!isArchiveDesc && highLightColor}
                transform={(router.asPath.includes('series') || router.asPath.includes('maniac')) && 'rotate(180deg)'} />
        </HStack>
    )

    const ErrowMessage = () => (
        <Center w='full' px={6}>
            <Box>アーカイブのご購入を確認できませんでした。ご購入は<NextLink href='/archive' passHref><Link className='active'>こちら</Link></NextLink>から。</Box>
        </Center>
    )

    const SmallLoadingSpinner = () => (
        <Center>
            <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200"
                color={useColorModeValue(highlight_color.l, highlight_color.d)} size="md" />
        </Center>
    )


    // Main Component
    if (user && ((subscription_state === 'subscribe') || !!One_Pay_Detail)) {
        return (
            <>
                {!isVideoMode && !isLargerThan992 && <ArchiveDrawer pathObj={pathObj} />}
                {!isVideoMode &&
                    <Flex flexGrow={1} direction='row' bg={bgColor}>
                        <Grid templateColumns={{ base: '1fr', lg: '240px 1fr', xl: '300px 1fr' }} w='full'>
                            {isLargerThan992 && <ArchiveSideNav pathObj={pathObj} onCloseDrawer={null} />}
                            <VStack spacing={8} px={{ base: 4, md: 8 }} py={{ base: 8, md: 8 }}>
                                <Flex justify={{ base: 'none', md: 'space-between' }} flexDirection={{ base: 'column', md: 'row' }} w='full' align='center'>
                                    <HStack spacing={4} mb={{ base: 2, md: 0 }}>
                                        <BreadcrumbNav paths={breadCrumbPaths} />
                                        {checkFavoriteRoute() && <Alert buttonText='リセット' onDelete={deleteFavorite} />}
                                    </HStack>
                                    <HStack spacing={{ base: 3, sm: 6, md: 8 }}>
                                        <SortArrow />
                                        {totalNumOfArchives <= 1000 && <ArchiveSearch filter={!checkFavoriteRoute() ? filter : generateFavoriteFilter(favoriteVideo)} />}
                                    </HStack>
                                </Flex>
                                {isFavoriteArchiveLoading ? <SmallLoadingSpinner /> :
                                    !!selectedArchive?.length ?
                                        <>
                                            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', '3xl': 'repeat(3, 1fr)' }} gap={{ base: 4, md: 6 }} cursor='pointer'>
                                                {selectedArchive.map((archive) => <VideoThumbnail archive={archive} inVideoCompo={false} currentRoot={currentRoot} key={archive.sys.id} setSkipTime={null} playing={false} />)}
                                            </Grid>
                                            {isSeaching && isShowingSearchResult && (searchedArchiveResult.length === limitSkipNum) &&
                                                <Box>{`上位${limitSkipNum}件の結果を表示しています。`}</Box>}
                                            {isFetchingMoreContent && <Center>
                                                <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200"
                                                    color={useColorModeValue(highlight_color.l, highlight_color.d)} size="md" />
                                            </Center>}
                                        </>
                                        : <Flex flexGrow={1}>
                                            {!isSeaching && <Center>該当する動画は見つかりませんでした。</Center>}
                                            {isSeaching && !isShowingSearchResult && !isWaitingSearchResult && <Center>入力中...</Center>}
                                            {isSeaching && !isShowingSearchResult && isWaitingSearchResult && <SmallLoadingSpinner />}
                                            {isSeaching && isShowingSearchResult && !isWaitingSearchResult &&
                                                <Center>検索の結果、該当する動画は見つかりませんでした。</Center>}
                                        </Flex>}
                            </VStack>
                        </Grid>
                    </Flex>}
                {isVideoMode &&
                    <Video
                        selectedArchive={isSeaching ? searchedArchiveResult : filteredArchive}
                        currentRoot={currentRoot}
                        fetchContentHandler={fetchContentHandler}
                        skipNum={skipNum}
                        totalNumOfArchives={totalNumOfArchives} />}
            </>
        )
    }
    else if (isLoading || isMetadataLoading) {
        return (
            <LoadingSpinner />
        )
    } else {
        return (
            <>
                {(subscription_state !== 'subscribe') &&
                    <Flex flexGrow={1} direction='row'>
                        <ErrowMessage />
                    </Flex>}
            </>
        )
    }
}


export const getStaticPaths: GetStaticPaths = async () => {

    const { archivePathCollection: { items } } = await fetchContentful(query_archiveRoute)
    let paths = []
    items[0].archiveRouteArray.map((obj: ArchivePath) => {
        if (!obj.paths) paths.push({ params: { path: [obj.link] } })
        else obj.paths.map(p => paths.push({ params: { path: [obj.id, p.link] } }))
    })

    return { paths, fallback: false }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { archivePathCollection: { items } } = await fetchContentful(query_archiveRoute)

    let filter
    let breadCrumbPaths
    const currentPagePath = items[0].archiveRouteArray.find(obj => obj.id === params.path[0])
    // ex: archive/season/1
    if (params.path.length === 2) {
        filter = currentPagePath.paths.find(p => p.link === params.path[1]).filter
        breadCrumbPaths = [currentPagePath.categoryName, currentPagePath.paths.find(p => p.link === params.path[1]).name]
    }
    // ex: archive/all
    if (params.path.length === 1) {
        filter = items[0].archiveRouteArray.find(obj => obj.link === params.path[0]).filter
        breadCrumbPaths = [currentPagePath.categoryName]
    }

    const descSearchQuery = generateSearchQuery(true, filter, null, limitSkipNum, true)
    const ascSearchQuery = generateSearchQuery(true, filter, null, limitSkipNum, false)
    const { archiveVideosCollection: { items: allDescArchives } } = await fetchContentful(descSearchQuery)
    const { archiveVideosCollection: { items: allAscArchives } } = await fetchContentful(ascSearchQuery)

    // スーツさんのアーカイブなので、vimeoIdではなく、youtubeIdを指定
    // filter archives only having youtubeId
    const allDescYoutubeArchives = allDescArchives.filter(ar => ar.youtubeId)
    const allAscYoutubeArchives = allAscArchives.filter(ar => ar.youtubeId)
    const filteredDescArchive = (params.path[0] === 'series' || params.path[0] === 'maniac') ? allAscYoutubeArchives : allDescYoutubeArchives
    const filteredAscArchive = (params.path[0] === 'series' || params.path[0] === 'maniac') ? allDescYoutubeArchives : allAscYoutubeArchives

    // Total nubmber of archives
    const { archiveVideosCollection: { total: totalNumOfArchives } } = await fetchContentful(`{
        archiveVideosCollection ${filter ? ('(where: ' + filter.replace(new RegExp(/'/, 'gi'), '"') + ')') : ''} {
            total
        }}`)

    return {
        props: {
            filteredDescArchive,
            filteredAscArchive,
            currentPaths: params.path,
            breadCrumbPaths,
            pathObj: items[0].archiveRouteArray,
            filter,
            totalNumOfArchives
        },
        revalidate: 1,
    }
}