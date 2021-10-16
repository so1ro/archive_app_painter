import { useRouter } from 'next/router'
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { GetStaticProps } from "next"
import { useMediaQuery } from '@/utils/useMediaQuery'
import NextLink from 'next/link'

import { fetchContentful } from "@/hook/contentful"
import { query_archivePricing, query_archiveTier } from "@/hook/contentful-queries"

import { Heading, Box, Text, Button } from "@chakra-ui/react"
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
    tier, }:
    {
      // allArchives: AllArchivesInterface[],
      allPrices: AllPrices[],
      landingPageText: LandingPageText[],
      tier: TierInterface[],
    }) {

  const { sys: { id }, message, content, functions, merit, vimeoId, explain, annotation } = landingPageText[0]
  const meritListItems = [content, functions, merit]
  const { user, error, isLoading } = useUser()
  const { User_Detail, isMetadataLoading, subscription_state, One_Pay_Detail, error_metadata } = useUserMetadata()
  const isLargerThan768 = useMediaQuery("(min-width: 768px)")
  const messageWithoutNewline = message.replace('\n', '')
  const router = useRouter()
  const { locale } = router
  const localeAllPrices = allPrices.filter(price => locale === 'en' ? price.currency === 'usd' : price.currency === 'jpy')

  if (error) return <div>{error.message}</div>
  if (error_metadata) return <div>{error_metadata}</div>

  //// Landing Page ////
  if (
    (!isLoading && !isMetadataLoading) &&
    (!user || ((!!subscription_state && (subscription_state === 'unsubscribe' || subscription_state === 'paused')) && !One_Pay_Detail))) {

    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box>
          <Heading
            as='h2'
            size="lg"
            textAlign={{ base: 'left', md: 'center' }}
            whiteSpace='pre-wrap'
            lineHeight={{ base: '32px', md: '42px' }}
            mb={6}>
            {!isLargerThan768 ? messageWithoutNewline : message}
          </Heading>
          <ArchiveMeritList meritListItems={meritListItems} />
        </Box>
        <Box>
          <Text mb={6}>{explain}</Text>
          <VideoVimeoLT vimeoId={vimeoId} aspect={'52.7%'} autoplay={false} borderRadius={null} />
        </Box>
        {/* サブスクリプションもワンペイ永久ご視聴もご購入前 */}
        {subscription_state === 'unsubscribe' &&
          <PriceList user={user} allPrices={localeAllPrices} annotation={annotation} isOnePayPermanent={false} />}
        {/* サブスクリプションが一時停止の場合 */}
        {subscription_state === 'paused' &&
          <NextLink href={'/account'}>
            <Button color='#fff' bg='#69b578' fontSize={{ base: 'xs', sm: 'md' }} >アカウントページへ</Button>
          </NextLink>}
      </PageShell>
    )
  }

  //// Redirect to Archive Page ////
  if (
    (!isLoading && !isMetadataLoading) &&
    (user && ((subscription_state === 'subscribe') || !!One_Pay_Detail))) {
    if (typeof window !== 'undefined') router.push('/archive/all')
    return <LoadingSpinner />
  }
  return <LoadingSpinner />
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  // const archiveData = await fetchContentful(query_allArchives)
  const allPrices = await fetchAllPrices()
  const landingPageText = await fetchContentful(query_archivePricing)
  const tier = await fetchContentful(query_archiveTier)

  return {
    props: {
      // allArchives: archiveData.kasumibroVideoCollection.items,
      allPrices: [...allPrices],
      landingPageText: landingPageText.archivePricingCollection.items,
      tier: tier.archivePricingTierCollection.items,
    },
    revalidate: 30
  }
}