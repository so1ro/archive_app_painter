import { GetStaticProps } from "next"
import PageShell from '@/components/PageShell'
import { Text, Box, } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ApplyForm from '@/components/ApplyForm'
import { fetchContentful } from '@/hook/contentful'
// import { query_applyText } from '@/hook/contentful-queries'

const Contact = ({ applyText }) => {

  const { locale } = useRouter()
  return (
    <PageShell customPT={null} customSpacing={null}>
      <Box w='full' maxW='640px'>
        <Text as='h2' fontSize='4xl' mb={12}>{locale === 'en' ? 'Contact' : 'お問い合わせ'}</Text>
        {/* <Text whiteSpace='pre-wrap' mb={24}>
          {locale === 'en' ?
            'We only reply to content authors / copyright owners.' :
            '作家ご本人（著作権所有者）様からのお問い合わせにのみ、お返事させていただいております。'}
        </Text> */}
        <ApplyForm />
      </Box>
    </PageShell>
  )
}


// export const getStaticProps: GetStaticProps = async () => {
//   // get Subscription Plans from Stripe
//   const { archiveAppApplyCollection: { items } } = await fetchContentful(query_applyText) // This is for fetching Annotation under the price list
//   const applyText = items[0].applyText

//   return {
//     props: { applyText },
//     revalidate: 1
//   }
// }

export default Contact