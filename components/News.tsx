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
			width: 100%;
					
			> div {
				position: unset !important;
			}

			.image {
				object-fit: contain;
				width: 100% !important;
				position: relative !important;
				height: unset !important;
			}
    `
	const boxShadow = `0px 16px 31px 7px rgba(0, 0, 0, 0.2);`


	return (
		<VStack spacing={24} w='full' maxW='640px'>
			<Text fontSize='2xl'>{locale === 'en' ? 'News' : '新着'}</Text>
			{newArchives.map(arc => (
				<Grid templateColumns='1fr 150px' w='full' gap={8} key={arc.sys.id}>
					<VStack spacing={3} align='flex-start'>
						<Text fontSize='xl' fontWeight='semibold'>{locale === 'en' ? `' ${arc.title[locale]} ' was archived.` : `「${arc.title[locale]}」をアーカイブに追加しました。`}</Text>
						<Text fontSize='md'>{format(parseISO(arc.publishDate), 'yyyy/MM/dd')}</Text>
					</VStack>
					<Box css={imgCSS} overflow="hidden" borderRadius={8} w='full' boxShadow={boxShadow}>
						<Image
							src={arc.image.url}
							layout="fill"
							alt='Image'
							className={'image'} />
					</Box>
				</Grid>
			))}
		</VStack>
	);
}