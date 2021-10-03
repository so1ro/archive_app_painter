import { ReactNode } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useColorMode, useColorModeValue } from "@chakra-ui/react"

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import NavModalSPTB from '@/components/NavModalSPTB'
import Nav from '@/components/Nav';

import { bg_color } from '@/styles/colorModeValue';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: ReactNode }) {

    const router = useRouter()
    const currentHeadData = headData.find(data => data.path === router.pathname.split('/')[1]) ?? { path: '404', title: '404 | スーツ' }

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>{currentHeadData.title}</title>
                <meta property="og:title" content={currentHeadData.title} key="title" />
                {/* <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' /> */}
                <meta name="viewport" content="initial-scale=1.0, width=device-width, viewport-fit=cover" />
                <link rel="preload" href="/fonts/RocknRollOne-Regular.woff2" as="font" crossOrigin="" />
            </Head>
            <Flex flexDirection="column" minH="100vh" bg={useColorModeValue(bg_color.l, bg_color.d)}>
                <Nav />
                <NavModalSPTB />
                <Flex w="100%" flexGrow={1} ml="auto" mr="auto" direction="column">{children}</Flex>
                <Footer />
            </Flex>
        </>
    );
}

const headData = [
    { path: '', title: 'スーツ' },
    { path: 'archive', title: 'アーカイブ | スーツ' },
    { path: 'youtube', title: 'YouTube | スーツ' },
    { path: 'twitter', title: 'ツイッター | スーツ' },
    { path: 'instagram', title: 'インスタグラム | スーツ' },
    { path: 'account', title: 'アカウント | スーツ' },
    { path: 'facebook', title: 'Facebook | スーツ' },
    { path: 'contact', title: 'お問い合わせ | スーツ' },
    { path: 'contact_success', title: 'お問い合わせ | スーツ' },
    { path: '404', title: '404 | スーツ' },
]