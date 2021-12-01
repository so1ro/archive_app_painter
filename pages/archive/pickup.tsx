import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from "next"
import NextLink from 'next/link'
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { useArchiveState } from "@/context/useArchiveState"
import { useMediaQuery } from '@/utils/useMediaQuery'
import { compareAsc } from 'date-fns'

import { query_archiveRoute, limitSkipNum, query_archiveTier } from "@/hook/contentful-queries"
import { fetchContentful, generateSearchQuery } from '@/hook/contentful'
import { isPast, add } from "date-fns"

import { List, ListItem, Code, VStack, Box, Flex, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useColorModeValue, HStack, Center, Link, useToast, Spinner } from '@chakra-ui/react'
import { css } from "@emotion/react"

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

export default function Pickup({
	allDescLatestArchives,
	allPickupArchives,
	currentPaths,
	breadCrumbPaths,
	pathObj,
	filter,
	totalNumOfArchives,
	tiers }: {
		allDescLatestArchives: AllArchives2Interface[]
		allPickupArchives: AllPickupArchives[]
		currentPaths: string[],
		breadCrumbPaths: string[],
		pathObj: ArchivePath[],
		filter: string | null,
		totalNumOfArchives: number | null,
		tiers: TierInterface[],
	}) {


	// Hook
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
		setIsShowingTierArchiveOnly,
		pickupArchives,
		setPickupArchives,
		nextPickUp_StartAt,
		setNextPickUp_StartAt, } = useArchiveState()
	const { user, error, isLoading } = useUser()
	const router = useRouter()
	const { locale } = useRouter()
	const toast = useToast()
	const isLargerThan992 = useMediaQuery("(min-width: 992px)")

	// Pickup randamly
	if (!pickupArchives || isPast(nextPickUp_StartAt)) {
		const pickupArchives = allPickupArchives.map(arc => {
			const currentTime = new Date()
			setNextPickUp_StartAt({ nextPickUp_StartAt: add(currentTime, { hours: 1 }) })
			const randomNum = getRandomInt(arc.paths.length)
			return { ...arc, paths: arc.paths[randomNum] }
		})
		setPickupArchives({ pickupArchives: pickupArchives })
	}

	// Function
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	// // Archive select
	// const filteredArchive = isArchiveDesc ? descArchive : ascArchive
	// const checkFavoriteRoute = () => router.asPath.includes('favorite')
	// let selectedArchive = isSeaching ? searchedArchiveResult :
	// 	(checkFavoriteRoute() ? favoriteArchive : filteredArchive)

	// Related to Tier
	const periodCurrentUserTier = periodCurrentUserTierFinder(tiers, User_Detail, locale)
	const tierLableInfo = tiers
		.filter(t => t.currency === User_Detail?.userCurrency)
		.map(t => ({ tierTitle: t.tierTitle, viewPeriod: t.viewPeriod }))
	// const isSelectedArchiveInTierPeriod = subscription_state === 'subscribe' ? true :
	// 	selectedArchive?.filter(arc => compareAsc(new Date(periodCurrentUserTier), new Date(arc.publishDate)) > 0).length > 0

	// // Effect
	// useEffect(() => {
	// 	// Only when you find router.query.id changing route, set isVideoMode true 
	// 	router.query.id && setIsVideoMode({ isVideoMode: true })
	// 	if (!router.query.id) {
	// 		window.scrollTo({ top: scrollY })
	// 		setScrollY({ scrollY: 0 })
	// 	}
	// }, [router.query.id])

	// useEffect(() => {
	// 	setDescArchive({ descArchive: filteredDescArchive })
	// 	setAscArchive({ ascArchive: filteredAscArchive })
	// 	setSkipNum({ skipNum: limitSkipNum })
	// 	setScrollY({ scrollY: 0 })
	// 	setIsArchiveDesc({ isArchiveDesc: true })
	// }, [currentPaths.join('/')])

	// // useEffect(() => {
	// // }, [router.asPath])

	// useEffect(() => {
	// 	// Always before changing route, set isVideoMode false 
	// 	const handleHistoryChange = (url, { shallow }) => { !url.includes('id=') && setIsVideoMode({ isVideoMode: false }) }
	// 	router.events.on('routeChangeStart', handleHistoryChange)
	// 	return () => { router.events.off('routeChangeStart', handleHistoryChange) }
	// }, [])

	// // favorite
	// useEffect(() => {
	// 	if (checkFavoriteRoute() && favoriteWork.length > 0) {
	// 		setIsFavoriteArchiveLoading({ isFavoriteArchiveLoading: true })
	// 		const fetchFavoriteArchives = async () => {
	// 			const filter = generateFavoriteFilter(favoriteWork.slice(0, limitSkipNum))
	// 			const { data: { archive2Collection: { items } } } = await postData({
	// 				url: '/api/graphqlSearch',
	// 				data: { order: false, keyword: null, filter, skipNum: 0, limit: limitSkipNum, desc: null }
	// 			})
	// 			const fetchedArchives = favoriteWork.slice(0, limitSkipNum).map(id => items.find(item => item.archiveNumber === id))
	// 			setFavoriteArchive({ favoriteArchive: fetchedArchives })
	// 			setIsFavoriteArchiveLoading({ isFavoriteArchiveLoading: false })
	// 		}
	// 		fetchFavoriteArchives()
	// 	}
	// }, [router.asPath, favoriteWork])


	// // Functions
	// const sortHandler = async (direction) => {
	// 	direction === 'desc' ? setIsArchiveDesc({ isArchiveDesc: true }) : setIsArchiveDesc({ isArchiveDesc: false })
	// }

	// const fetchContentHandler = async () => {
	// 	setIsFetchingMoreContent({ isFetchingMoreContent: true })
	// 	let res
	// 	if (!checkFavoriteRoute()) {
	// 		res = await postData({
	// 			url: '/api/graphqlSearch',
	// 			data: { order: true, keyword: null, filter, skipNum, limit: limitSkipNum, desc: (currentPaths[0] === 'series' || currentPaths[0] === 'maniac') ? !isArchiveDesc : isArchiveDesc }
	// 		})
	// 	} else {
	// 		const filter = generateFavoriteFilter(favoriteWork.slice(skipNum, skipNum + limitSkipNum))
	// 		res = await postData({
	// 			url: '/api/graphqlSearch',
	// 			data: { order: false, keyword: null, filter, skipNum: null, limit: null, desc: null }
	// 		})
	// 	}

	// 	if (res.data && isArchiveDesc && !checkFavoriteRoute()) {
	// 		const currentDescArchive = descArchive
	// 		setDescArchive({ descArchive: [...currentDescArchive, ...res.data.archive2Collection.items] })
	// 	}
	// 	if (res.data && !isArchiveDesc && !checkFavoriteRoute()) {
	// 		const currentAscArchive = ascArchive
	// 		setAscArchive({ ascArchive: [...currentAscArchive, ...res.data.archive2Collection.items] })
	// 	}
	// 	if (res.data && checkFavoriteRoute()) {
	// 		const currentFavoriteArchive = favoriteArchive
	// 		const additionalArchive = favoriteWork.slice(skipNum, skipNum + limitSkipNum).map(id => res.data.archive2Collection.items.find(item => item.youtubeId === id))
	// 		setFavoriteArchive({ favoriteArchive: [...currentFavoriteArchive, ...additionalArchive] })
	// 	}

	// 	const currentSkipNum = skipNum
	// 	setSkipNum({ skipNum: currentSkipNum + limitSkipNum })

	// 	if (res.error) toast({ duration: 6000, render: () => (<ToastError text={"ネット回線をご確認ください..."} />) })
	// 	setIsFetchingMoreContent({ isFetchingMoreContent: false })
	// }

	// const generateFavoriteFilter = (favoriteWork) => {
	// 	const favoriteNums = favoriteWork.map(n => (`{ archiveNumber: '${n}' }`))
	// 	return `{ OR: [${favoriteNums}] }`
	// }

	// const deleteFavorite = async () => {
	// 	setFavoriteWork({ favoriteWork: [] })
	// 	setFavoriteArchive({ favoriteArchive: [] })
	// 	try {
	// 		const { data } = await postData({
	// 			url: '/api/auth/upsert-favorite-work',
	// 			data: { auth0_UUID: user.sub, favoriteWork: [] }
	// 		}).then(data => data)
	// 	} catch (e) {
	// 		toast({ duration: 3000, render: () => (<ToastError text='サーバー上のお気に入り登録を削除できませんでした。' />) })
	// 	}
	// }

	// // Miscellaneous
	// const currentRoot = currentPaths.join('/')
	// const arrowSize = { base: 6, md: 8 }
	const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)
	const bgColor = useColorModeValue(bg_color_content.l, bg_color_content.d)
	const thumbnailAreaScrollCss = css`
        /* height */
        ::-webkit-scrollbar {
            height: ${isLargerThan992 ? '8px' : '0px'};
        }
        
        /* Track */
        ::-webkit-scrollbar-track {
            background:  ${bgColor};
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: ${useColorModeValue('#ddd', '#555')};
            border-radius : 8px
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: ${highLightColor};
        }
    `

	// Components
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

	// Main Component
	if (user && ((subscription_state === 'subscribe') || !!One_Pay_Detail)) {
		return (
			<>
				{!isVideoMode && !isLargerThan992 && <ArchiveDrawer pathObj={pathObj} />}
				{!isVideoMode &&
					<Flex flexGrow={1} direction='row' bg={bgColor}>
						<Grid templateColumns={{ base: '1fr', lg: '240px 1fr', xl: '300px 1fr' }} >
							<Box d={{ base: 'none', lg: 'block' }}><ArchiveSideNav pathObj={pathObj} onCloseDrawer={null} /></Box>
							<VStack spacing={20} px={{ base: 4, md: 8 }} pt={8} pb={24} overflow='hidden'>
								<VStack w='full' spacing={6} align='flex-start'>
									<Flex align='center' h='40px'>{locale === 'en' ? 'Latest' : '最新'}</Flex>
									<List w='full' overflowX='auto' whiteSpace='nowrap' mt={12} pb={4} borderTopWidth='0' css={thumbnailAreaScrollCss}>
										{allDescLatestArchives.slice(0, 5).map((i, j) => (
											<ListItem
												d='inline-block'
												verticalAlign='top'
												w='280px'
												mr={3}
												whiteSpace='pre-wrap'
												cursor='pointer'
												_last={{ marginRight: 0 }}
												key={j}>
												<ArchiveThumbnail
													key={j}
													archive={i}
													inVideoCompo={false}
													setSkipTime={null} playing={false}
													userTierPeriod={periodCurrentUserTier}
													tierLableInfo={tierLableInfo} />
											</ListItem>
										))}
									</List>
								</VStack>
								<VStack w='full' spacing={12} align='flex-start'>
									{pickupArchives.map((arc, i) =>
										<VStack w='full' alignItems='flex-start' spacing={6}>
											<Box>{arc.categoryName[locale] + ' : ' + arc.paths.name[locale]}</Box>
											{/* <HStack w='full' overflowX='auto'>{arc.paths.archives.map((i, j) => <Box w='300px'><ArchiveThumbnail
													key={j}
													archive={i}
													inVideoCompo={false}
													setSkipTime={null} playing={false}
													userTierPeriod={periodCurrentUserTier}
													tierLableInfo={tierLableInfo} /></Box>)
												}</HStack> */}

											<List w='full' overflowX='auto' whiteSpace='nowrap' pb={4} borderTopWidth='0' css={thumbnailAreaScrollCss}>
												{arc.paths.archives.map((i, j) => (
													<ListItem
														d='inline-block'
														verticalAlign='top'
														w='180px'
														mr={3}
														whiteSpace='pre-wrap'
														cursor='pointer'
														_last={{ marginRight: 0 }}
														key={j}>
														<ArchiveThumbnail
															key={j}
															archive={i}
															inVideoCompo={false}
															setSkipTime={null} playing={false}
															userTierPeriod={periodCurrentUserTier}
															tierLableInfo={tierLableInfo} />
													</ListItem>
												))}
											</List>
										</VStack>
									)}
								</VStack>
								{/* {isFavoriteArchiveLoading ? <SmallLoadingSpinner /> :
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
													{isSeaching && isShowingSearchResult && (searchedArchiveResult.length === limitSkipNum) &&
											</Grid>
												<Box>{`上位${limitSkipNum}件の結果を表示しています。`}</Box>}
											{isFetchingMoreContent && <Center>
												<Spinner thickness="3px" speed="0.65s" emptyColor="gray.200"
													color={useColorModeValue(highlight_color.l, highlight_color.d)} size="md" />
											</Center>}
										</>
										: 
										<Flex flexGrow={1}>
											{!isSeaching && <Center>該当する作品は見つかりませんでした。</Center>}
											{isSeaching && !isShowingSearchResult && !isWaitingSearchResult && <Center>入力中...</Center>}
											{isSeaching && !isShowingSearchResult && isWaitingSearchResult && <SmallLoadingSpinner />}
											{isSeaching && isShowingSearchResult && !isWaitingSearchResult &&
												<Center>検索の結果、該当する作品は見つかりませんでした。</Center>}
										</Flex>
										}
								{isShowingTierArchiveOnly && !isSelectedArchiveInTierPeriod && !checkFavoriteRoute() &&
									<ErrowMessageNotUserTierIncludingArchives />} */}
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

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {

	// Fetch Latest 20 Archives
	const descSearchQuery = generateSearchQuery(true, null, null, 20, true)
	const { archive2Collection: { items: allDescArchives } } = await fetchContentful(descSearchQuery)
	const allDescLatestArchives = allDescArchives.filter(ar => ar.archiveNumber)

	// Fetch Archives with category's paths
	const { archivePathCollection: { items } } = await fetchContentful(query_archiveRoute)
	const pickupArchives = await items[0].archiveRouteArray
		.filter(obj => obj.id !== 'all' && obj.id !== 'favorite')

	const paths = pickupArchives.map(obj => (obj.paths))
	const pathAndArchives = await Promise.all(paths.map(async (i) => {
		return await Promise.all(i.map(async j => {
			const searchQuery = generateSearchQuery(true, j.filter, null, 5, true)
			const { archive2Collection: { items: archives } } = await fetchContentful(searchQuery)
			return { ...j, archives }
		}))
	}))

	const allPickupArchives = pickupArchives.map((arc, i) => ({ ...arc, paths: pathAndArchives[i] }))


	// 

	const breadCrumbPaths = ["Pick up"]
	let filter

	// const descSearchQuery = generateSearchQuery(true, filter, null, limitSkipNum, true)
	// const ascSearchQuery = generateSearchQuery(true, filter, null, limitSkipNum, false)
	// const { archive2Collection: { items: allDescArchives } } = await fetchContentful(descSearchQuery)
	// const { archive2Collection: { items: allAscArchives } } = await fetchContentful(ascSearchQuery)

	// // filter archives only having archiveNumber
	// const allDescYoutubeArchives = allDescArchives.filter(ar => ar.archiveNumber)
	// const allAscYoutubeArchives = allAscArchives.filter(ar => ar.archiveNumber)
	// const filteredDescArchive = (params.path[0] === 'series' || params.path[0] === 'maniac') ? allAscYoutubeArchives : allDescYoutubeArchives
	// const filteredAscArchive = (params.path[0] === 'series' || params.path[0] === 'maniac') ? allDescYoutubeArchives : allAscYoutubeArchives

	// // Total nubmber of archives
	// const { archive2Collection: { total: totalNumOfArchives } } = await fetchContentful(`{
	//       archive2Collection ${filter ? ('(where: ' + filter.replace(new RegExp(/'/, 'gi'), '"') + ')') : ''} {
	//           total
	//       }}`)

	// Tier
	const tiersCollection = await fetchContentful(query_archiveTier)
	const tiers = tiersCollection.archivePricingTierCollection.items.map(t => ({ ...t, unit_amount: t.unitAmount, type: 'one_time' }))

	return {
		props: {
			allDescLatestArchives,
			allPickupArchives,
			// currentPaths: params.path,
			breadCrumbPaths,
			tiers,
			pathObj: items[0].archiveRouteArray,
			// filter,
			// totalNumOfArchives,
			// filteredDescArchive,
			// filteredAscArchive,
		},
		revalidate: 1,
	}
}