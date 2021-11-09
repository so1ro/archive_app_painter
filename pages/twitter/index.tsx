import { GetStaticProps, GetStaticPaths } from "next"
import { getTweets } from '@/lib/twitter'
import { query_twitter } from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful'

import { fetchTweetAst } from 'static-tweets'
import { Tweet } from 'react-static-tweets'
import PageShell from '@/components/PageShell'
import 'react-static-tweets/styles.css'
import { css } from "@emotion/react"
import { VStack, Box } from '@chakra-ui/react'
import { useColorModeValue } from "@chakra-ui/react"
import { card_background_color, highlight_color } from '@/styles/colorModeValue'
import NavSNS from '@/components/NavSNS'

export default function Twitter({ twitterAST }) {

    // const navItems = items.map(item => ({ id: item.sys.id, name: item.name, path: item.path }))
    const twitterBlockquoteWrap = css`
    .static-tweet{
        margin-bottom: 50px;
    }
    .static-tweet:first-of-type {
        margin-top: 12px;
    } 
    .static-tweet-body {
        background: ${useColorModeValue(card_background_color.l, card_background_color.d)};
        border-color : ${useColorModeValue('', '#263743')};
        color : ${useColorModeValue('', '#fff')};
    }
    
    .static-tweet-body .static-tweet-body {
        border-color : ${useColorModeValue('', '#666')};
        margin-bottom: 8px;
    }
    
    .static-tweet-header-name, .static-tweet-header-username{
        color : ${useColorModeValue('', '#fff')};
    }

    .static-tweet-header-name {
        white-space: pre-wrap;
        line-height : 1.4;
    }
    
    .static-tweet-p a {
        color : ${useColorModeValue('', highlight_color.d)};
    }
    
    .image-container {
        border-radius: 0.4rem;
        overflow: hidden;
    }
    .static-tweet-emoji {
        display: inline-block;
    }
`
    return (
        <Box css={twitterBlockquoteWrap}>
            <PageShell customPT={{ base: 0, lg: 0 }} customSpacing={{ base: 0 }}>
                <NavSNS items={null} />
                {twitterAST.map(ast => (<Tweet key={ast.id} id={ast.id} ast={ast.tweetAst} />))}
            </PageShell>
        </Box>
    )
}

// export const getStaticPaths: GetStaticPaths = async () => {

//     const { twitterCollection } = await fetchContentful(query_twitter)
//     const paths = twitterCollection.items.map((col) => ({
//         params: { path: col.path }
//     }))

//     return { paths, fallback: false }
// }

export const getStaticProps: GetStaticProps = async ({ params }) => {

    // const { twitterCollection } = await fetchContentful(query_twitter)
    // const twitterItem = await twitterCollection.items.find(col => col.path === params.path)
    const { data } = await getTweets()
    const allTweetId = data.map(t => t.id)

    let twitterAST = []
    for (const id of allTweetId) {
        const tweetAst = await fetchTweetAst(id)
        twitterAST.push({ id, tweetAst })
    }

    return {
        props: {
            twitterAST,
            // items: twitterCollection.items 
        },
        revalidate: 1,
    }
}