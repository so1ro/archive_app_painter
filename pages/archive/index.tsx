import { useRouter } from 'next/router'
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { GetStaticProps } from "next"
import { useMediaQuery } from '@/utils/useMediaQuery'
import NextLink from 'next/link'

import { fetchContentful } from "@/hook/contentful"
import { query_archivePricing, query_archiveTier } from "@/hook/contentful-queries"

import { VStack, Heading, Box, Text, Button } from "@chakra-ui/react"
import { fetchAllPrices } from '@/hook/getStaticProps'
import PriceList from '@/components/PriceList'
import ArchiveMeritList from "@/components/ArchiveMeritList"
import VideoVimeoLT from "@/components/VideoVimeoLT"
import PageShell from '@/components/PageShell'
import LoadingSpinner from '@/components/Spinner'

export default function Archive(
  {
    // allArchives,
    allPrices,
    landingPageText,
    tiers, }:
    {
      // allArchives: AllArchivesInterface[],
      allPrices: AllPrices[],
      landingPageText: LandingPageText[],
      tiers: TierInterface[],
    }) {

  const router = useRouter()
  const { locale } = useRouter()
  const { sys: { id }, message, content, functions, merit, vimeoId, explain, annotation } = landingPageText[0]
  const meritListItems = [content, functions, merit]
  const { user, error, isLoading } = useUser()
  const { User_Detail, isMetadataLoading, subscription_state, One_Pay_Detail, error_metadata } = useUserMetadata()
  const isLargerThan768 = useMediaQuery("(min-width: 768px)")
  const messageWithoutNewline = message[locale].replace('\n', '')
  const localeAllPrices = allPrices.filter(price => locale === 'en' ? price.currency === 'usd' : price.currency === 'jpy')
  const localeAllTiers = tiers.filter(tier => locale === 'en' ? tier.currency === 'usd' : tier.currency === 'jpy')

  if (error) return <div>{error.message}</div>
  if (error_metadata) return <div>{error_metadata}</div>

  //// Landing Page ////
  if (
    (!isLoading && !isMetadataLoading) &&
    (!user || ((!!subscription_state && (subscription_state === 'unsubscribe' || subscription_state === 'paused')) && !One_Pay_Detail))) {

    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full'>
          <Heading
            as='h2'
            size="lg"
            textAlign={{ base: 'left', md: 'center' }}
            whiteSpace='pre-wrap'
            lineHeight={{ base: '32px', md: '42px' }}
            mb={{ base: 8, md: 20 }}
          >
            {!isLargerThan768 ? messageWithoutNewline : message[locale]}
          </Heading>
          <VideoVimeoLT vimeoId={vimeoId} aspect={'52.7%'} autoplay={false} borderRadius={null} />
        </Box>
        <ArchiveMeritList meritListItems={meritListItems} />
        <VStack spacing={10}>
          <Text w='full' whiteSpace='pre-wrap'>{explain[locale]}</Text>
          {subscription_state === 'unsubscribe' &&
            <PriceList user={user} allPrices={localeAllPrices} annotation={annotation ?? null} returnPage={'archive'} />}
          {/* サブスクリプションもワンペイ永久ご視聴もご購入前 */}
          <PriceList user={user} allPrices={localeAllTiers} annotation={null} returnPage={'archive'} />
          {/* サブスクリプションが一時停止の場合 */}
          {subscription_state === 'paused' &&
            <NextLink href={'/account'}>
              <Button color='#fff' bg='#69b578' fontSize={{ base: 'xs', sm: 'md' }} >アカウントページへ</Button>
            </NextLink>}
        </VStack>
      </PageShell>
    )
  }

  //// Redirect to Archive Page ////
  if (
    (!isLoading && !isMetadataLoading) &&
    (user && ((subscription_state === 'subscribe') || !!One_Pay_Detail))) {
    if (typeof window !== 'undefined') router.push('/archive/pickup')
    return <LoadingSpinner />
  }
  return <LoadingSpinner />
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  // const archiveData = await fetchContentful(query_allArchives)
  const allPrices = await fetchAllPrices()
  const landingPageText = await fetchContentful(query_archivePricing)
  const tiersCollection = await fetchContentful(query_archiveTier)
  const tiers = tiersCollection.archivePricingTierCollection.items.map(t => ({ ...t, unit_amount: t.unitAmount, type: 'one_time' }))

  return {
    props: {
      // allArchives: archiveData.kasumibroVideoCollection.items,
      allPrices: [...allPrices],
      landingPageText: landingPageText.archivePricingCollection.items,
      tiers
    },
    revalidate: 30
  }
}