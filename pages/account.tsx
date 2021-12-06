import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { GetStaticProps } from "next"
import { format, parseISO } from "date-fns"

import { useUser } from '@auth0/nextjs-auth0'
import { useUserMetadata } from '@/context/useUserMetadata'
import { fetchAllPrices } from '@/hook/getStaticProps'
import { currencyUSDChecker, currentUserTierFinder, postData } from '@/utils/helpers'
import PriceList from '@/components/PriceList'
import { Toast } from '@/components/Toast'
import { fetchContentful } from '@/hook/contentful'
import { query_archivePricing, query_archiveTier } from '@/hook/contentful-queries'

import { VStack, Button, Box, Center, Text, useToast, HStack, useColorModeValue, Table, Thead, Th, Tbody, Tr, Td, TableCaption, useBreakpointValue, } from '@chakra-ui/react'
import PageShell from '@/components/PageShell'
import LoadingSpinner from '@/components/Spinner'
import { bg_color, border_color } from '@/styles/colorModeValue'

export default function Account({
  allPrices,
  landingPageText,
  tiers, }: {
    allPrices: AllPrices[],
    landingPageText: LandingPageText[],
    tiers: TierInterface[],
  }) {

  const { user, error, isLoading } = useUser()
  const {
    User_Detail,
    isMetadataLoading,
    subscription_state,
    Subscription_Detail,
    One_Pay_Detail,
    error_metadata,
    isBeforeCancelDate,
    temporaryPaidCheck,
    setTemporaryPaidCheck,
  } = useUserMetadata()

  // Hook
  const router = useRouter()
  const { locale } = router
  const localeAllPrices = allPrices.filter(price => User_Detail?.userCurrency ?
    User_Detail?.userCurrency === 'usd' ? price.currency === 'usd' : price.currency === 'jpy' :
    locale === 'en' ? price.currency === 'usd' : price.currency === 'jpy')
  const localeAllTiers = tiers
    .filter(tier => User_Detail?.userCurrency ?
      User_Detail?.userCurrency === 'usd' ? tier.currency === 'usd' : tier.currency === 'jpy' :
      locale === 'en' ? tier.currency === 'usd' : tier.currency === 'jpy')
    .filter(tier => tier.currency === 'usd' ?
      (tier.unit_amount / 100) - User_Detail?.past_charged_fee > 0 : tier.unit_amount - User_Detail?.past_charged_fee > 0)
  const toast = useToast()
  const tierList = tiers
    .filter(tier => User_Detail?.userCurrency ?
      User_Detail?.userCurrency === 'usd' ? tier.currency === 'usd' : tier.currency === 'jpy' :
      locale === 'en' ? tier.currency === 'usd' : tier.currency === 'jpy')

  // Miscellaneous
  const { sys: { id }, message, content, functions, merit, vimeoId, explain, annotation } = landingPageText[0]
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' })
  const bgColor = useColorModeValue(bg_color.l, bg_color.d)

  // useEffect
  useEffect(() => {
    if (user && typeof window !== 'undefined' && window.location.search.indexOf('session_id') > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const session_id = urlParams.get('session_id')
      const checkSession = async () => {
        const customerData: CustomerDataInterface = await postData({
          url: '/api/stripe/check-session',
          data: { session_id }
        }).then(data => data)

        if (customerData.customer_email === user.email) {
          setTemporaryPaidCheck({ temporaryPaidCheck: true })
        }
      }
      checkSession()
    }
  }, [user])

  // Function
  const handleCustomerPortal = async (customer_Id: string) => {
    const { url, error } = await postData({
      url: '/api/stripe/create-portal-link',
      data: { customer_Id }
    })
    if (error) return alert(error.message)
    window.location.assign(url)
  }

  const indexBgColor = useColorModeValue(border_color.l, border_color.d)

  // Component
  const CustomerPortalButton = () => (
    <Center mb={24}>
      <Button color='#fff' bg='#69b578' fontSize={{ base: 'xs', sm: 'md' }} onClick={() => {
        handleCustomerPortal(Subscription_Detail.customer_Id)
        toast({ duration: 3000, render: () => (<Toast text={"カスタマーポータルに移動中..."} />) })
      }}>
        {(Subscription_Detail?.cancel_at_period_end || subscription_state === 'paused') ?
          `サブスクリプションの再開 ／ お支払い履歴` : `プランの変更・キャンセル・一時停止 ／ 履歴`}
      </Button>
    </Center>
  )

  const UsernameTotalPayment = () => (
    <>
      <Box mb={2}>{user.email} 様</Box>
      <HStack mb={24}>
        <Box>{locale === 'en' ? 'Total payment' : 'これまでのお支払い（累積）'}</Box>
        <Box>{currencyUSDChecker(User_Detail?.userCurrency, locale) ?
          `$${User_Detail?.past_charged_fee} ／ ` : `${User_Detail?.past_charged_fee}円 ／ `}
          {currentUserTierFinder(tiers, User_Detail, locale) ?
            currentUserTierFinder(tiers, User_Detail, locale)?.tierTitle :
            locale === 'en' ? "No Tier" : 'まだ Tier に達していません。'}</Box>
      </HStack>
    </>
  )

  // Render
  if (error) return <div>{error.message}</div>

  // サブスクリプション購入後
  if ((!isLoading && !isMetadataLoading) && (subscription_state === 'subscribe' || One_Pay_Detail) && subscription_state !== 'paused') {

    // Subscription Status Table contents
    const subscription_table = Subscription_Detail && [
      {
        name: locale === 'en' ? 'Plan' : 'プラン',
        value: currencyUSDChecker(User_Detail?.userCurrency, locale) ?
          `$${Subscription_Detail.subscription_Price / 100} / month` : `${Subscription_Detail.subscription_Price}円／月`,
        display: true
      },
      {
        name: locale === 'en' ? 'Feature' : '特典',
        value: Subscription_Detail.subscription_Description,
        display: true
      },
      {
        name: locale === 'en' ? 'Status' : 'ステータス',
        value: Subscription_Detail.subscription_Status,
        display: true
      },
      {
        name: locale === 'en' ? 'Cancellation' : 'キャンセル',
        value: `このサブスクリプションは、\n${(Subscription_Detail.cancel_at ?? Subscription_Detail.canceled_at) + (isBeforeCancelDate ? 'までご利用いただけます。' : 'にキャンセルされました。')}`,
        display: Subscription_Detail.cancel_at_period_end || Subscription_Detail.canceled_at
      },
    ]

    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='640px'>
          <UsernameTotalPayment />

          {/* Subscription status table */}
          {subscription_table && <Box mb={24}>
            <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={8} pt={2} pb={4} bg={bgColor}>
              <Table variant="striped" colorScheme="gray" size={tableSize} whiteSpace='pre-wrap'>
                <TableCaption placement='top' mt={0} mb={2}>{locale === 'en' ? 'Subscription detail' : 'サブスクリプション詳細'}</TableCaption>
                <Tbody>
                  {subscription_table.map((s, i) => (s.display && (<Tr key={i}><Td w={{ base: '100px', sm: '200px' }}>{s.name}</Td><Td>{s.value}</Td></Tr>)))}
                </Tbody>
              </Table>
            </Box>
            {/* <Center mb={4}>サブスクリプションの詳細は、次のボタンからご確認いただけます。</Center> */}
            {subscription_state !== 'unsubscribe' && <CustomerPortalButton />}
          </Box>}
          {/* {subscription_state !== 'unsubscribe' && <> </>} */}

          {/* Tier status table */}
          {/* {tier_status && <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={24} pt={2} pb={4} bg={bgColor}>
            <Table variant="striped" colorScheme="gray" size={tableSize} whiteSpace='pre-wrap'>
              <TableCaption placement='top' mt={0} mb={2}>{locale === 'en' ? 'Tier detail' : 'Tier 詳細'}</TableCaption>
              <Tbody>
                {tier_status.map((s, i) => (s.display && (<Tr key={i}><Td w={{ base: '100px', sm: '200px' }}>{s.name}</Td><Td>{s.value}</Td></Tr>)))}
              </Tbody>
            </Table>
          </Box>} */}

          {subscription_state === 'unsubscribe' && <Box mb={24}>
            <Text mb={4}>サブスクリプションを開始することができます。</Text>
            <PriceList user={user} allPrices={localeAllPrices} annotation={annotation} returnPage={'account'} />
          </Box>}

          {subscription_state === 'unsubscribe' && localeAllTiers.length > 0 && <Box mb={24}>
            <Text mb={4}>Tier を追加購入することも可能です。</Text>
            <PriceList user={user} allPrices={localeAllTiers} annotation={null} returnPage={'account'} />
          </Box>}
          <Box mb={6}>{locale === 'en' ? 'Your subscription payment is accumulated. Even after stopping subscription, you can access the works published in a certain period according to your total payment.' : 'これまでのお支払いは累積されます。サブスクリプション終了後も、その金額に応じて下記期間の作品をご覧いただけます。'}</Box>

          <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={24} pt={2} pb={4} bg={bgColor}>
            <Table variant="striped" colorScheme="gray" size={tableSize} whiteSpace='pre-wrap'>
              {/* <TableCaption placement='top' mt={0} mb={2}>{locale === 'en' ? 'List Tier' : 'Tier 一覧'}</TableCaption> */}
              <Thead><Tr><Th>Tier</Th><Th>{locale === 'en' ? 'Access range' : '閲覧可能な作品'}</Th></Tr></Thead>
              <Tbody>
                {tierList.map((s, i) => (
                  <Tr key={i}><Td w={{ base: '100px', sm: '200px' }}>{s.tierTitle}{`　`}{currencyUSDChecker(User_Detail?.userCurrency, locale) ?
                    `($${s.unit_amount / 100})` : `（${s.unit_amount}円）`}</Td>
                    <Td>{
                      locale === 'en' ? `Works published by ${format(parseISO(s.viewPeriod), 'yyyy / MM / dd')}` :
                        `${format(parseISO(s.viewPeriod), 'yyyy / MM / dd')} までに公開された作品`
                    }</Td>
                  </Tr>))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </PageShell>)
  }

  // サブスクリプション未購入、ワンペイ永久ご視聴購入済み
  // if (!isLoading && !isMetadataLoading && (!Subscription_Detail && One_Pay_Detail)) {

  //   // Status Table contents
  //   const status = [
  //     {
  //       name: 'プラン',
  //       value: One_Pay_Detail.title,
  //     },
  //     {
  //       name: '特典',
  //       value: '期限なく、すべてのコンテンツをご視聴をいただけます。',
  //     },
  //     {
  //       name: '永久ご視聴',
  //       value: '○',
  //     },
  //   ]

  //   return (
  //     <PageShell customPT={null} customSpacing={null}>
  //       <Box w='full' maxW='640px'>
  //         <Box mb={4}>{user.email} 様</Box>
  //         <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={{ base: 16, lg: 24 }} pt={2} pb={4} bg={bgColor}>
  //           <Table variant="striped" colorScheme="gray" size={tableSize}>
  //             <TableCaption placement='top' mt={0} mb={2}>プラン詳細</TableCaption>
  //             <Tbody>
  //               {status.map((s, i) => (<Tr key={i}><Td>{s.name}</Td><Td>{s.value}</Td></Tr>))}
  //             </Tbody>
  //           </Table>
  //         </Box>
  //         {subscription_state === 'unsubscribe' && <>
  //           <Text mb={4}>サブスクリプションを開始することもできます。</Text>
  //           <PriceList user={user} allPrices={localeAllPrices} annotation={annotation} returnPage={'account'} />
  //         </>}
  //         {subscription_state !== 'unsubscribe' && <>
  //           <Center mb={4}>サブスクリプションの詳細は、次のボタンからご確認いただけます。</Center>
  //           <CustomerPortalButton />
  //         </>}

  //         {/* Tierプロモーション */}
  //         {localeAllTiers.length > 0 && <Box mt={{ base: 16, lg: 24 }}>
  //           <Text mb={4}>Tier をアップグレードすることもできます。</Text>
  //           <PriceList user={user} allPrices={localeAllTiers} annotation={null} returnPage={'account'} />
  //         </Box>}
  //       </Box>
  //     </PageShell>)
  // }


  // サブスクリプションのキャンセル後
  // 注：Stripe Dashboardからのキャンセルは、即日キャンセルになる
  // if (!isLoading && !isMetadataLoading &&
  //   (Subscription_Detail?.subscription_Status === 'canceled' && !One_Pay_Detail)) {
  //   return (
  //     <PageShell customPT={null} customSpacing={null}>
  //       <Box w='full' maxW='640px'>
  //         <UsernameTotalPayment />
  //         <Box>{Subscription_Detail.cancel_at ?? Subscription_Detail.canceled_at}にキャンセルされました。</Box>
  //         <Text mb={4}>新たにサブスクリプションを開始することも、Tier を購入することもできます。</Text>
  //         <VStack spacing={{ base: 16, lg: 24 }}>
  //           <PriceList user={user} allPrices={localeAllPrices} annotation={annotation} returnPage={'account'} />
  //           <PriceList user={user} allPrices={localeAllTiers} annotation={null} returnPage={'account'} />
  //         </VStack>
  //       </Box>
  //     </PageShell>
  //   )
  // }

  // サブスクリプションの一時停止 Paused
  if (!isLoading && !isMetadataLoading &&
    (Subscription_Detail && subscription_state === 'paused' && Subscription_Detail.pause_collection)) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='640px'>
          <UsernameTotalPayment />
          {Subscription_Detail.pause_collection.resumes_at ?
            <Box mb={6}>サブスクリプションは、{Subscription_Detail.pause_collection.resumes_at}に再開されます。</Box> :
            <Box mb={6}>サブスクリプションは、現在停止中です。次のボタンから再開することができます。</Box>}
          <CustomerPortalButton />

          {/* Tierプロモーション */}
          <Box mt={{ base: 24, lg: 32 }}>
            <Text mb={4}>Tier を追加購入することも可能です。</Text>
            <PriceList user={user} allPrices={localeAllTiers} annotation={null} returnPage={'account'} />
          </Box>
        </Box>
      </PageShell>
    )
  }
  // サブスクリプション status が incomplete / incomplete_expired / incomplete_expired / past_due の場合
  if (!isLoading && !isMetadataLoading &&
    (Subscription_Detail && subscription_state === 'paused' && !Subscription_Detail.pause_collection)) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='640px'>
          <UsernameTotalPayment />
          <CustomerPortalButton />
        </Box>
      </PageShell>
    )
  }

  // サインアップ後、サブスクリプション・ワンペイ永久ご視聴ともに未購入
  if (!isLoading && !isMetadataLoading && !Subscription_Detail && !One_Pay_Detail && !temporaryPaidCheck) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box>
          <UsernameTotalPayment />
          <Text mb={{ base: 14, md: 16 }}>{explain[locale]}</Text>
          <VStack spacing={{ base: 14, lg: 16 }}>
            <Box>
              <Text w='full' fontSize='xl' fontWeight='bold' mb={5} textAlign={{ base: 'center', sm: 'left' }}>{locale === 'en' ? 'Subscription Plan' : 'サブスクリプションプラン'}</Text>
              <PriceList user={user} allPrices={localeAllPrices} annotation={annotation} returnPage={'account'} />
            </Box>
            <Box>
              <Text w='full' fontSize='xl' fontWeight='bold' mb={5} textAlign={{ base: 'center', sm: 'left' }}>{locale === 'en' ? 'One-Pay Plan' : 'ワンペイプラン'}</Text>
              <PriceList user={user} allPrices={localeAllTiers} annotation={null} returnPage={'account'} />
            </Box>
          </VStack>
        </Box>
      </PageShell>)
  }

  // サブスクリプション、ワンペイ永久ご視聴の情報もないが、購入成功のリターンURLの場合
  if (!isLoading && !isMetadataLoading && !Subscription_Detail && !One_Pay_Detail && temporaryPaidCheck) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <Box w='full' maxW='640px'>
          <Box mb={8}>{user.email} 様</Box>
          <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={16} pt={2} pb={4} bg={bgColor}>
            <Table variant="striped" colorScheme="gray" size={tableSize} whiteSpace='pre-wrap'>
              <TableCaption placement='top' mt={0} mb={2}>プラン詳細</TableCaption>
              <Tbody><Tr><Td>状態</Td><Td>一時的に購入情報が取得できなくなっております。</Td></Tr></Tbody>
            </Table>
          </Box>
          <CustomerPortalButton />
        </Box>
      </PageShell>)
  }

  return <LoadingSpinner />
}

export const getStaticProps: GetStaticProps = async () => {
  // get Subscription Plans from Stripe
  const landingPageText = await fetchContentful(query_archivePricing) // This is for fetching Annotation under the price list
  const allPrices = await fetchAllPrices()
  const tiersCollection = await fetchContentful(query_archiveTier)
  const tiers = tiersCollection.archivePricingTierCollection.items.map(t => ({ ...t, unit_amount: t.unitAmount, type: 'one_time' }))

  return {
    props: {
      allPrices: [...allPrices],
      landingPageText: landingPageText.archivePricingCollection.items,
      tiers,
    },
    revalidate: 30
  }
}