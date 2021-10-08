import { useUser } from '@auth0/nextjs-auth0'
import { useLayoutEffect, useState } from 'react'
import { useUserMetadata } from '@/context/useUserMetadata'
import { fetchContentful } from '@/hook/contentful'
import NextLink from 'next/link'
import { query_allArchives2, query_storageUrl } from '@/hook/contentful-queries'
import _ from 'lodash'
import { postData } from '@/utils/helpers'

import ZoomImgModal from '@/components/ZoomImgModal'
import VideoYouTube from '@/components/VideoYouTube'
import { Center, Flex, VStack, HStack, Box, List, ListItem, Link, useColorModeValue, Tabs, TabList, TabPanels, Tab, TabPanel, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast } from '@chakra-ui/react'
import { css } from "@emotion/react"
import { GetStaticProps, GetStaticPaths } from "next"
import { highlight_color } from '@/styles/colorModeValue'
import TimeFormat from 'hh-mm-ss'
import { useRouter } from 'next/router'
import { ViewIcon } from '@chakra-ui/icons'
import { BrushIcon, FavoriteHeartIcon } from '@/styles/icons'
import { Toast, ToastError } from '@/components/Toast'
import LoadingSpinner from '@/components/Spinner'

export default function Archive1({ archive, path }:
	{ archive: AllArchives2Interface, path: string }) {

	// Hook
	const { user, error, isLoading } = useUser()
	const { locale } = useRouter()
	const { isMetadataLoading,
		subscription_state,
		One_Pay_Detail,
		favoriteWork,
		setFavoriteWork } = useUserMetadata()
	const toast = useToast()

	// State
	const [{ isAccordionOpen }, setIsAccordionOpen] = useState<{ isAccordionOpen: boolean }>({ isAccordionOpen: false })
	const [{ publishedDate }, setPublishedDate] = useState<{ publishedDate: string }>({ publishedDate: null })

	const [{ skipTime }, setSkipTime] = useState<{ skipTime: number }>({ skipTime: 0 })
	const [{ isQuitVideo }, setIsQuitVideo] = useState<{ isQuitVideo: boolean }>({ isQuitVideo: false })
	const [{ isAutoPlay }, setIsAutoPlay] = useState<{ isAutoPlay: boolean }>({ isAutoPlay: false })

	const [{ skipTimeLearnVideo }, setSkipTimeLearnVideo] = useState<{ skipTimeLearnVideo: number }>({ skipTimeLearnVideo: 0 })
	const [{ isQuitLearnVideo }, setIsQuitLearnVideo] = useState<{ isQuitLearnVideo: boolean }>({ isQuitLearnVideo: false })
	const [{ isAutoPlayLearnVideo }, setIsAutoPlayLearnVideo] = useState<{ isAutoPlayLearnVideo: boolean }>({ isAutoPlayLearnVideo: false })

	// Effect
	// useLayoutEffect(() => setPublishedDate({ publishedDate: format(parseISO(archive.publishDate), "yyyy/MM/dd") }), [archive])

	// Miscellaneous
	const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)
	const selectedColorScheme = { color: highLightColor, borderColor: highLightColor }
	const iconSize = { base: 6, md: 7 }
	const favoriteButtonText = favoriteWork.includes(archive.archiveNumber) ? 'お気に入りから削除中...' : 'お気に入りに保存中...'
	const favoriteButtonErrorText = favoriteWork.includes(archive.archiveNumber) ? 'お気に入りから削除できませんでした。' : 'お気に入りは保存されませんでした。'
	const accordionCss = css`
        .chakra-accordion__item:last-of-type {
        border-bottom-width: 0;
        }
    `

	// Function
	const stopSkipPlayVideoHandler = async (skipTime: number, isAutoPlay: boolean) => {
		setIsQuitVideo({ isQuitVideo: true })
		await setSkipTime({ skipTime })
		setIsQuitVideo({ isQuitVideo: false })
		setIsAutoPlay({ isAutoPlay })
	}

	const stopSkipPlayLearningVideoHandler = async (skipTimeLearnVideo: number, isAutoPlayLearnVideo: boolean) => {
		setIsQuitLearnVideo({ isQuitLearnVideo: true })
		await setSkipTimeLearnVideo({ skipTimeLearnVideo })
		setIsQuitLearnVideo({ isQuitLearnVideo: false })
		setIsAutoPlayLearnVideo({ isAutoPlayLearnVideo })
	}

	const favoriteHandler = async (id) => {
		const currentFavoriteWork = favoriteWork
		favoriteWork.includes(id) ? _.pull(currentFavoriteWork, id) : currentFavoriteWork.unshift(id)
		setFavoriteWork({ favoriteWork: currentFavoriteWork })
		try {
			const { data } = await postData({
				url: '/api/auth/upsert-favorite-work',
				data: { auth0_UUID: user.sub, favoriteWork }
			}).then(data => data)
		} catch (e) {
			toast({ duration: 3000, render: () => (<ToastError text={favoriteButtonErrorText} />) })
		}
	}

	// Component
	const ErrowMessage = () => (
		<Center w='full' px={6}>
			<Box>アーカイブのご購入を確認できませんでした。ご購入は<NextLink href='/archive' passHref><Link className='active'>こちら</Link></NextLink>から。</Box>
		</Center>
	)

	const FavoriteButton = () => (
		<FavoriteHeartIcon
			width={iconSize} height={iconSize} cursor='pointer'
			color={favoriteWork.includes(archive.archiveNumber) && highLightColor}
			onClick={() => {
				toast({ duration: 3000, render: () => (<Toast text={favoriteButtonText} />) })
				favoriteHandler(archive.archiveNumber)
			}} />
	)

	if (user && ((subscription_state === 'subscribe') || !!One_Pay_Detail)) {
		return (
			<>
				<VStack w='full' maxW={{ base: '1000px' }} py={{ base: 12, lg: 24 }} spacing={24} margin='0 auto'>
					<Tabs w='full' id={`archive-tab-id`} isFitted>
						<TabList d={archive?.learningVideoId ? 'flex' : 'none'}>
							<Tab _selected={selectedColorScheme} onClick={() => stopSkipPlayLearningVideoHandler(0, false)}><ViewIcon mr={2} />{locale === 'en' ? 'View' : '観る'}</Tab>
							<Tab _selected={selectedColorScheme} onClick={() => stopSkipPlayVideoHandler(0, false)}>
								<BrushIcon mr={2} w={4} h={4} />{locale === 'en' ? 'Learn' : '学ぶ'}
							</Tab>
						</TabList>
						<TabPanels>
							<TabPanel p={0}>
								<VStack w='full' spacing={archive?.youtubeId ? { base: 0, lg: 12 } : 6} pt={archive?.learningVideoId ? { base: 10, md: 20 } : 0}>
									<VStack w='full' spacing={archive?.timestamp ? 6 : 4}>
										{archive?.youtubeId && <VideoYouTube
											youtubeId={archive?.youtubeId}
											aspect={null}
											autoplay={isAutoPlay}
											borderRadius={0}
											skipTime={skipTime}
											isQuitVideo={isQuitVideo}
											onRouterPush={null} />}
										{archive?.timestamp &&
											<HStack w='full' align='flex-start' justify='space-between' >
												<Accordion w='full' css={accordionCss}
													onChange={() => setIsAccordionOpen({ isAccordionOpen: !isAccordionOpen })} allowToggle>
													<AccordionItem mb={8} borderTopWidth={0} borderBottomWidth={0} id="calculator-accordion-1">
														<AccordionButton p={0} justifyContent='flex-start'>
															<AccordionIcon w={8} h={8} mr={2} />{locale === 'en' ? 'Timestamps' : 'もくじ'}
														</AccordionButton>
														<AccordionPanel pb={4} px={0} fontSize={{ base: 'sm', lg: 'md' }}>
															<Box w='full' px={2} pb={4}>
																{archive.timestamp.map((stamp, i) => (
																	<List fontSize={['md']} key={i} >
																		<ListItem fontSize={{ base: 'sm', lg: 'md' }} mb={1}>
																			<Link
																				mr={2} color={highLightColor}
																				onClick={() => stopSkipPlayVideoHandler(TimeFormat.toS(stamp.time), true)}
																			>{stamp.time}</Link>
																			{stamp.indexText}
																		</ListItem>
																	</List>
																))}
															</Box>
														</AccordionPanel>
													</AccordionItem>
												</Accordion>
												<FavoriteButton />
											</HStack>}
										{archive?.youtubeId && !archive?.timestamp &&
											<Box w='full' textAlign='right'><FavoriteButton /></Box>}

									</VStack>
									<ZoomImgModal archive={archive} path={path} />
									{!archive?.youtubeId &&
										<Box w='full' textAlign='left'>
											<FavoriteButton />
										</Box>}
								</VStack>
							</TabPanel>

							<TabPanel p={0}>
								<VStack w='full' spacing={archive?.learningVideoId ? 24 : 0} pt={20}>
									<VStack w='full' spacing={archive?.learningVideoTimestamp ? 6 : 0}>
										{archive?.learningVideoId && <VideoYouTube
											youtubeId={archive?.learningVideoId}
											aspect={null}
											autoplay={isAutoPlayLearnVideo}
											borderRadius={0}
											skipTime={skipTimeLearnVideo}
											isQuitVideo={isQuitLearnVideo}
											onRouterPush={null} />}
										{archive?.learningVideoTimestamp && <Box w='full' pb={4}>
											{archive.learningVideoTimestamp.map((stamp, i) => (
												<List fontSize={['md']} key={i} >
													<ListItem fontSize={{ base: 'sm', lg: 'md' }} mb={1}>
														<Link
															mr={2} color={highLightColor}
															onClick={() => stopSkipPlayLearningVideoHandler(TimeFormat.toS(stamp.time), true)}
														>{stamp.time}</Link>
														{stamp.indexText}
													</ListItem>
												</List>
											))}
										</Box>}
									</VStack>
								</VStack>
							</TabPanel>

						</TabPanels>
					</Tabs>

					{(archive?.title || archive?.createdYear || archive?.size) && <Box w='full' pb={4}>
						<List fontSize={['md']} mt={12}>
							{archive.title &&
								<ListItem mb={1}> タイトル : {archive.title[locale]} </ListItem>}
							{archive.createdYear &&
								<ListItem mb={1}> 作成年 : {archive.createdYear} </ListItem>}
							{archive.size &&
								<ListItem mb={1}> 実際のサイズ : W {archive.size.width} x H {archive.size.height} {archive.size.unit}  </ListItem>}
						</List>
					</Box>}
				</VStack>
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

	const data = await fetchContentful(query_allArchives2)
	const items: AllArchives2Interface[] = data.archive2Collection.items

	let paths = []
	locales.forEach((locale) => {
		items.map(obj => paths.push({ params: { archive: obj.archiveNumber }, locale }))
	})

	return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

	const data = await fetchContentful(query_allArchives2)
	const items: AllArchives2Interface[] = data.archive2Collection.items

	const archive = items.filter(item => item.archiveNumber === params.archive)
	const { storageUrl: { path } } = await fetchContentful(query_storageUrl)

	return {
		props: {
			archive: archive[0],
			archiveNumber: params.archive,
			path
		},
		revalidate: 1,
	}
}