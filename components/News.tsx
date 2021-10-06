import { useRouter } from 'next/router'
import Image from 'next/image'
import { format, parseISO } from "date-fns"
import { css } from "@emotion/react"

import { Container, VStack, Grid, Box, Text } from "@chakra-ui/react"
import NextLink from 'next/link';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { highlight_color } from '@/styles/colorModeValue';

export default function News({ newArchives }: { newArchives: AllArchives2Interface[] }) {

	const { locale } = useRouter()
	const imgCSS = css`
        img {
          border-radius: .6rem;
        }
    `

	return (
		<VStack spacing={24} w='full' maxW='640px'>
			<Text fontSize='2xl'>{locale === 'en' ? 'News' : '新着'}</Text>
			{newArchives.map(arc => (
				<Grid templateColumns='1fr 150px' w='full' gap={8} key={arc.sys.id}>
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
	);
}