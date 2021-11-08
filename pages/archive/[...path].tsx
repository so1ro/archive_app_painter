import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from "next"
import NextLink from 'next/link'
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { useArchiveState } from "@/context/useArchiveState"
import { useMediaQuery } from '@/utils/useMediaQuery'
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { compareAsc } from 'date-fns'

import { query_archiveRoute, limitSkipNum, query_archiveTier } from "@/hook/contentful-queries"
import { fetchContentful, generateSearchQuery } from '@/hook/contentful'
import { format, parseISO, compareDesc } from "date-fns"

import { Code, VStack, Box, Flex, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useColorModeValue, HStack, Center, Link, useToast, Spinner } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChevronRightIcon } from '@chakra-ui/icons'

import Video from '@/components/Video'
import ArchiveThumbnail from '@/components/ArchiveThumbnail'
import ArchiveDrawer from "@/components/ArchiveDrawer"
import ArchiveSideNav from '@/components/ArchiveSideNav'

import LoadingSpinner from '@/components/Spinner'
import { bg_color_content, highlight_color } from '@/styles/colorModeValue'
import ArchiveSearch from '@/components/ArchiveSearch'
import Alert from '@/components/AlertDialog'
import { periodCurrentUserTierFinder, postData } from '@/utils/helpers'
import { ToastError } from '@/components/Toast'

export default function ArchiveRoute({
    filteredDescArchive,
    filteredAscArchive,
    currentPaths,
    breadCrumbPaths,
    pathObj,
    filter,
    totalNumOfArchives,
    tiers }: {
        filteredDescArchive: AllArchives2Interface[],
        filteredAscArchive: AllArchives2Interface[],
        currentPaths: string[],
        breadCrumbPaths: string[],
        pathObj: ArchivePath[],
        filter: string | null,
        totalNumOfArchives: number | null,
        tiers: TierInterface[],
    }) {

    // Hook
    const { user, error, isLoading } = useUser()
    const router = useRouter()
    const { locale } = useRouter()
    const {
        User_Detail,
        isMetadataLoading,
        subscription_state,
        One_Pay_Detail,
        error_metadata,
        favoriteWork,
        setFavoriteWork } = useUserMetadata()
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
        setScrollY,
        isShowingTierArchiveOnly,
        setIsShowingTierArchiveOnly, } = useArchiveState()
    const isLargerThan992 = useMediaQuery("(min-width: 992px)")
    const toast = useToast()
    useBottomScrollListener(() => {
        // When Searching, not fetch
        if (checkFavoriteRoute() && (skipNum >= favoriteWork.length)) return
        if (!checkFavoriteRoute() && isSeaching || (skipNum >= totalNumOfArchives) || isVideoMode) return
        fetchContentHandler()
    }, { offset: 300 })

    // State
    const [{ descArchive }, setDescArchive] = useState<{ descArchive: AllArchives2Interface[] | null }>({ descArchive: null })
    const [{ ascArchive }, setAscArchive] = useState<{ ascArchive: AllArchives2Interface[] | null }>({ ascArchive: null })
    const [{ favoriteArchive }, setFavoriteArchive] = useState<{ favoriteArchive: AllArchives2Interface[] | null }>({ favoriteArchive: null })
    const [{ skipNum }, setSkipNum] = useState<{ skipNum: number }>({ skipNum: limitSkipNum })
    const [{ isFavoriteArchiveLoading }, setIsFavoriteArchiveLoading] = useState<{ isFavoriteArchiveLoading: boolean }>({ isFavoriteArchiveLoading: false })

    // Archive select
    const filteredArchive = isArchiveDesc ? descArchive : ascArchive
    const checkFavoriteRoute = () => router.asPath.includes('favorite')
    let selectedArchive = isSeaching ? searchedArchiveResult :
        (checkFavoriteRoute() ? favoriteArchive : filteredArchive)

    // Related to Tier
    const periodCurrentUserTier = periodCurrentUserTierFinder(tiers, User_Detail, locale)
    const tierLableInfo = tiers
        .filter(t => t.currency === User_Detail?.userCurrency)
        .map(t => ({ tierTitle: t.tierTitle, viewPeriod: t.viewPeriod }))
    const isSelectedArchiveInTierPeriod = subscription_state === 'subscribe' ? true :
        selectedArchive?.filter(arc => compareAsc(new Date(periodCurrentUserTier), new Date(arc.publishDate)) > 0).length > 0

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
        if (checkFavoriteRoute() && favoriteWork.length > 0) {
            setIsFavoriteArchiveLoading({ isFavoriteArchiveLoading: true })
            const fetchFavoriteArchives = async () => {
                const filter = generateFavoriteFilter(favoriteWork.slice(0, limitSkipNum))
                const { data: { archive2Collection: { items } } } = await postData({
                    url: '/api/graphqlSearch',
                    data: { order: false, keyword: null, filter, skipNum: 0, limit: limitSkipNum, desc: null }
                })
                const fetchedArchives = favoriteWork.slice(0, limitSkipNum).map(id => items.find(item => item.archiveNumber === id))
                setFavoriteArchive({ favoriteArchive: fetchedArchives })
                setIsFavoriteArchiveLoading({ isFavoriteArchiveLoading: false })
            }
            fetchFavoriteArchives()
        }
    }, [router.asPath, favoriteWork])


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
            const filter = generateFavoriteFilter(favoriteWork.slice(skipNum, skipNum + limitSkipNum))
            res = await postData({
                url: '/api/graphqlSearch',
                data: { order: false, keyword: null, filter, skipNum: null, limit: null, desc: null }
            })
        }

        if (res.data && isArchiveDesc && !checkFavoriteRoute()) {
            const currentDescArchive = descArchive
            setDescArchive({ descArchive: [...currentDescArchive, ...res.data.archive2Collection.items] })
        }
        if (res.data && !isArchiveDesc && !checkFavoriteRoute()) {
            const currentAscArchive = ascArchive
            setAscArchive({ ascArchive: [...currentAscArchive, ...res.data.archive2Collection.items] })
        }
        if (res.data && checkFavoriteRoute()) {
            const currentFavoriteArchive = favoriteArchive
            const additionalArchive = favoriteWork.slice(skipNum, skipNum + limitSkipNum).map(id => res.data.archive2Collection.items.find(item => item.youtubeId === id))
            setFavoriteArchive({ favoriteArchive: [...currentFavoriteArchive, ...additionalArchive] })
        }

        const currentSkipNum = skipNum
        setSkipNum({ skipNum: currentSkipNum + limitSkipNum })

        if (res.error) toast({ duration: 6000, render: () => (<ToastError text={"ネット回線をご確認ください..."} />) })
        setIsFetchingMoreContent({ isFetchingMoreContent: false })
    }

    const generateFavoriteFilter = (favoriteWork) => {
        const favoriteNums = favoriteWork.map(n => (`{ archiveNumber: '${n}' }`))
        return `{ OR: [${favoriteNums}] }`
    }

    const deleteFavorite = async () => {
        setFavoriteWork({ favoriteWork: [] })
        setFavoriteArchive({ favoriteArchive: [] })
        try {
            const { data } = await postData({
                url: '/api/auth/upsert-favorite-work',
                data: { auth0_UUID: user.sub, favoriteWork: [] }
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
            {locale === 'en' ?
                <Box>We could not find your purchase record of our archive.<br />Please purchase from <NextLink href='/archive' passHref><Link className='active'>here</Link></NextLink></Box> :
                <Box>アーカイブのご購入を確認できませんでした。ご購入は<NextLink href='/archive' passHref><Link className='active'>こちら</Link></NextLink>から。</Box>}
        </Center>
    )

    const ErrowMessageNotUserTierIncludingArchives = () => (
        <Center w='full' px={6}>
            {locale === 'en' ?
                <Box>Your tier doesn't include this category's archives.<br /><br />
                    Check all archives?<br />
                    <Link onClick={() => setIsShowingTierArchiveOnly({ isShowingTierArchiveOnly: !isShowingTierArchiveOnly })} color={highLightColor}>
                        Show all Tier</Link><br /><br />
                    Do you want to change your Tier?<br />
                    Please upgrade your Tier or start Subscription from <NextLink href='/account' passHref><Link className='active'>Account page</Link></NextLink>.
                </Box> :
                <Box>このカテゴリーのアーカイブは、ご購入いただいた Tier に含まれておりません。<br /><br />
                    すべての Tier をご覧になりますか？<br />
                    <Link onClick={() => setIsShowingTierArchiveOnly({ isShowingTierArchiveOnly: !isShowingTierArchiveOnly })} color={highLightColor}>
                        すべての Tier を表示</Link><br /><br />
                    Tier のアップグレードまたは、サブスクリプションの開始は<NextLink href='/account' passHref><Link className='active'>アカウントページ</Link></NextLink>から。
                </Box>}
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
                            <Box d={{ base: 'none', lg: 'block' }}><ArchiveSideNav pathObj={pathObj} onCloseDrawer={null} /></Box>
                            <VStack spacing={8} px={{ base: 4, md: 8 }} pt={8} pb={24} w='full'>
                                <Flex justify={{ base: 'none', md: 'space-between' }} flexDirection={{ base: 'column', md: 'row' }} w='full' align='center'>
                                    <HStack spacing={4} mb={{ base: 2, md: 0 }}>
                                        <BreadcrumbNav paths={breadCrumbPaths} />
                                        {checkFavoriteRoute() && <Alert buttonText='リセット' onDelete={deleteFavorite} />}
                                    </HStack>
                                    <HStack spacing={{ base: 3, sm: 6, md: 8 }}>
                                        <SortArrow />
                                        {totalNumOfArchives <= 1000 && <ArchiveSearch filter={!checkFavoriteRoute() ? filter : generateFavoriteFilter(favoriteWork)} />}
                                    </HStack>
                                </Flex>
                                {isFavoriteArchiveLoading ? <SmallLoadingSpinner /> :
                                    !!selectedArchive?.length ?
                                        <>
                                            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)', '4xl': 'repeat(5, 1fr)' }} gap={{ base: 6, md: 8 }} cursor='pointer' w='full'>
                                                {selectedArchive.map((archive) =>
                                                    <ArchiveThumbnail
                                                        key={archive.sys.id}
                                                        archive={archive}
                                                        inVideoCompo={false}
                                                        setSkipTime={null} playing={false}
                                                        userTierPeriod={periodCurrentUserTier}
                                                        tierLableInfo={tierLableInfo} />)}
                                            </Grid>
                                            {isSeaching && isShowingSearchResult && (searchedArchiveResult.length === limitSkipNum) &&
                                                <Box>{`上位${limitSkipNum}件の結果を表示しています。`}</Box>}
                                            {isFetchingMoreContent && <Center>
                                                <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200"
                                                    color={useColorModeValue(highlight_color.l, highlight_color.d)} size="md" />
                                            </Center>}
                                        </>
                                        : <Flex flexGrow={1}>
                                            {!isSeaching && <Center>該当する作品は見つかりませんでした。</Center>}
                                            {isSeaching && !isShowingSearchResult && !isWaitingSearchResult && <Center>入力中...</Center>}
                                            {isSeaching && !isShowingSearchResult && isWaitingSearchResult && <SmallLoadingSpinner />}
                                            {isSeaching && isShowingSearchResult && !isWaitingSearchResult &&
                                                <Center>検索の結果、該当する作品は見つかりませんでした。</Center>}
                                        </Flex>}
                                {isShowingTierArchiveOnly && !isSelectedArchiveInTierPeriod && !checkFavoriteRoute() &&
                                    <ErrowMessageNotUserTierIncludingArchives />}
                            </VStack>
                        </Grid>
                    </Flex>}
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


export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

    const { archivePathCollection: { items } } = await fetchContentful(query_archiveRoute)
    let paths = []

    items[0].archiveRouteArray.map((obj: ArchivePath) => {
        locales.forEach((locale) => {
            if (!obj.paths) {
                paths.push({ params: { path: [obj.link] }, locale })
            }
            else {
                obj.paths.map(p => paths.push({ params: { path: [obj.id, p.link] }, locale }))
            }
        })
    })

    return { paths, fallback: false }
}


export const getStaticProps: GetStaticProps = async ({ locale, params }) => {

    const { archivePathCollection: { items } } = await fetchContentful(query_archiveRoute)

    let filter
    let breadCrumbPaths
    const currentPagePath = items[0].archiveRouteArray.find(obj => obj.id === params.path[0])
    // ex: archive/season/1
    if (params.path.length === 2) {
        filter = currentPagePath.paths.find(p => p.link === params.path[1]).filter
        breadCrumbPaths = [currentPagePath.categoryName[locale], currentPagePath.paths.find(p => p.link === params.path[1]).name[locale]]
    }
    // ex: archive/all
    if (params.path.length === 1) {
        filter = items[0].archiveRouteArray.find(obj => obj.link === params.path[0]).filter
        breadCrumbPaths = [currentPagePath.categoryName[locale]]
    }

    const descSearchQuery = generateSearchQuery(true, filter, null, limitSkipNum, true)
    const ascSearchQuery = generateSearchQuery(true, filter, null, limitSkipNum, false)
    const { archive2Collection: { items: allDescArchives } } = await fetchContentful(descSearchQuery)
    const { archive2Collection: { items: allAscArchives } } = await fetchContentful(ascSearchQuery)

    // filter archives only having archiveNumber
    const allDescYoutubeArchives = allDescArchives.filter(ar => ar.archiveNumber)
    const allAscYoutubeArchives = allAscArchives.filter(ar => ar.archiveNumber)
    const filteredDescArchive = (params.path[0] === 'series' || params.path[0] === 'maniac') ? allAscYoutubeArchives : allDescYoutubeArchives
    const filteredAscArchive = (params.path[0] === 'series' || params.path[0] === 'maniac') ? allDescYoutubeArchives : allAscYoutubeArchives

    // Total nubmber of archives
    const { archive2Collection: { total: totalNumOfArchives } } = await fetchContentful(`{
        archive2Collection ${filter ? ('(where: ' + filter.replace(new RegExp(/'/, 'gi'), '"') + ')') : ''} {
            total
        }}`)

    // Tier
    const tiersCollection = await fetchContentful(query_archiveTier)
    const tiers = tiersCollection.archivePricingTierCollection.items.map(t => ({ ...t, unit_amount: t.unitAmount, type: 'one_time' }))

    return {
        props: {
            filteredDescArchive,
            filteredAscArchive,
            currentPaths: params.path,
            breadCrumbPaths,
            pathObj: items[0].archiveRouteArray,
            filter,
            totalNumOfArchives,
            tiers
        },
        revalidate: 1,
    }
}