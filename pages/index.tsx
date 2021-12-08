import Hero from '@/components/Hero'
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"
import { formatISO } from "date-fns"
import { dailyNum } from '@/utils/helpers'

import { fetchContentful, generateSearchQuery } from "@/hook/contentful"
import { query_allHeroImg, query_topIntro, query_topShop } from "@/hook/contentful-queries"

import PageShell from '@/components/PageShell'
import News from '@/components/News'

export default function Home(
  {
    heroSlideImgs,
    introTextAvatar,
    productTextImage,
    newArchives,
  }: {
    heroSlideImgs: AllHeroImgInterface[],
    introTextAvatar: TopIntroTextAvatar
    productTextImage: TopShopTextImage[],
    newArchives: AllArchives2Interface[]
  }) {

  const { user, error, isLoading } = useUser()
  return (
    <>
      <Hero heroSlideImgs={heroSlideImgs[0].imageCollection.items} introTextAvatar={introTextAvatar} newArchives={newArchives} />
      {!!newArchives?.length &&
        <PageShell customPT={{ base: 24, lg: 32 }} customSpacing={null} id={'news'}>
          <News newArchives={newArchives} />
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
  const { topHeroImgsCollection: { items: heroSlideImgs } } = await fetchContentful(query_allHeroImg)
  const { topIntroCollection: { items: introTextAvatar } } = await fetchContentful(query_topIntro)
  const { topShopCollection: { items: productTextImage } } = await fetchContentful(query_topShop)

  // Arrange Portrait First & Destructuring 
  // const portraitFirstAllImg = allHeroImg.map(pair => pair.imageCollection.items.sort((a, b) => a.width - b.width))
  // const todayImgPair = portraitFirstAllImg[dailyNum(portraitFirstAllImg)]

  return {
    props: {
      heroSlideImgs,
      introTextAvatar: introTextAvatar[0],
      productTextImage,
      newArchives,
    },
    revalidate: 3,
  }
}