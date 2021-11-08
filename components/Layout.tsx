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
    const currentHeadData = headData.find(data => data.path === router.pathname.split('/')[1]) ?? { path: '404', title: '404 | 芝田美智子 ボタニカルアート 教室' }

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>{currentHeadData.title}</title>
                <meta property="og:title" content={currentHeadData.title} key="title" />
                {/* <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' /> */}
                <meta name="viewport" content="initial-scale=1.0, width=device-width, viewport-fit=cover" />
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
    { path: '', title: '芝田美智子 ボタニカルアート 教室' },
    { path: 'archive', title: 'アーカイブ | 芝田美智子 ボタニカルアート 教室' },
    { path: 'youtube', title: 'YouTube | 芝田美智子 ボタニカルアート 教室' },
    { path: 'twitter', title: 'ツイッター | 芝田美智子 ボタニカルアート 教室' },
    { path: 'instagram', title: 'インスタグラム | 芝田美智子 ボタニカルアート 教室' },
    { path: 'account', title: 'アカウント | 芝田美智子 ボタニカルアート 教室' },
    { path: 'facebook', title: 'Facebook | 芝田美智子 ボタニカルアート 教室' },
    { path: 'contact', title: 'お問い合わせ | 芝田美智子 ボタニカルアート 教室' },
    { path: 'contact_success', title: 'お問い合わせ | 芝田美智子 ボタニカルアート 教室' },
    { path: '404', title: '404 | 芝田美智子 ボタニカルアート 教室' },
]