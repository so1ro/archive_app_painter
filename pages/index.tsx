import { useRouter } from 'next/router'
import Hero from '@/components/Hero'
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"
import { format, parseISO, formatISO } from "date-fns"

import { fetchContentful, generateSearchQuery } from "@/hook/contentful"
import { query_allHeroImg, query_topIntro, query_topShop } from "@/hook/contentful-queries"

import Image from 'next/image'
import { Container, VStack, Grid, Box, Text } from "@chakra-ui/react"
import { css } from "@emotion/react"
import TopIntro from '@/components/TopIntro'
import TopShop from '@/components/TopShop'
import PageShell from '@/components/PageShell'
import { dailyNum } from '@/utils/helpers'

export default function Home(
  {
    todayImgPair,
    introTextAvatar,
    productTextImage,
    newArchives,
  }: {
    todayImgPair: AllHeroImgInterface[],
    introTextAvatar: TopIntroTextAvatar
    productTextImage: TopShopTextImage[],
    newArchives: AllArchives2Interface[]
  }) {

  const { user, error, isLoading } = useUser()
  const { locale } = useRouter()

  const imgCSS = css`
        img {
          border-radius: .6rem;
        }
    `

  return (
    <>
      <Hero todayImgPair={todayImgPair} introTextAvatar={introTextAvatar} newArchives={newArchives} />
      {newArchives && <PageShell customPT={{ base: 24, lg: 32 }} customSpacing={null} id={'news'}>
        <VStack spacing={24} w='full' maxW='640px'>
          <Text fontSize='2xl'>{locale === 'en' ? 'News' : '新着'}</Text>
          {newArchives.map(arc => (
            <Grid templateColumns='1fr 150px' w='full' gap={8}>
              <VStack spacing={3} align='flex-start'>
                <Text fontSize='xl' fontWeight='semibold'>{locale === 'en' ? `' ${arc.title[locale]} ' was archived.` : `「${arc.title[locale]}」をアーカイブに追加しました。`}</Text>
                <Text fontSize='md'>{format(parseISO(arc.publishDate), 'yyyy/MM/dd')}</Text>
              </VStack>
              <Box css={imgCSS}>
                <Image
                  src={arc.image.url}
                  width='150px'
                  height='186px'
                  alt='Image' />
              </Box>
            </Grid>
          ))}
        </VStack>
        {/* <TopIntro introTextAvatar={introTextAvatar} /> */}
      </PageShell>}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const today = new Date()
  const NewsTimeRange = formatISO(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()), { representation: 'date' })
  const filter = `{publishDate_gte : "${NewsTimeRange}"}`
  const newArchiveSearchQuery = generateSearchQuery(true, filter, null, 3, true)
  const { archive2Collection: { items: newArchives } } = await fetchContentful(newArchiveSearchQuery)

  // get Archivce data from Contentful
  const { topHeroImgsCollection: { items: allHeroImg } } = await fetchContentful(query_allHeroImg)
  const { topIntroCollection: { items: introTextAvatar } } = await fetchContentful(query_topIntro)
  const { topShopCollection: { items: productTextImage } } = await fetchContentful(query_topShop)

  // Arrange Portrait First & Destructuring 
  const portraitFirstAllImg = allHeroImg.map(pair => pair.imageCollection.items.sort((a, b) => a.width - b.width))
  const todayImgPair = portraitFirstAllImg[dailyNum(portraitFirstAllImg)]

  return {
    props: {
      todayImgPair,
      introTextAvatar: introTextAvatar[0],
      productTextImage,
      newArchives,
    },
    revalidate: 3,
  }
}