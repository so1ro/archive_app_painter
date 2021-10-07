import { useRouter } from 'next/router'
import Image from 'next/image'
import { format, parseISO } from "date-fns"
import { css } from "@emotion/react"

import { Code, VStack, Grid, Box, Text, HStack } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/react"
import { text_color } from '@/styles/colorModeValue';

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
	const textColor = useColorModeValue(text_color.l, text_color.d)

	// Function
	const pickHandler = (input: AllArchives2Interface, key: string) => {
		let pickedValues = { 'en': [], 'ja': [], }
		input[key].map(c => {
			pickedValues.en.push(c.split('_')[0].charAt(0).toUpperCase() + c.split('_')[0].slice(1))
			pickedValues.ja.push(c.split('_')[1])
		})
		return pickedValues
	}

	// Component
	const Label = ({ arg }) => <Code colorScheme='none' mb={1} mr={2} border='1px solid' borderColor={textColor} borderRadius={20} px={3} fontSize='xs' key={arg}>{arg}</Code>

	return (
		<VStack spacing={24} w='full' maxW='640px'>
			<Text fontSize='2xl'>{locale === 'en' ? 'News' : '新着'}</Text>
			{newArchives.map(arc => (
				<Grid templateColumns={{ base: '1fr 100px', sm: '1fr 150px' }} w='full' gap={{ base: 4, sm: 8 }} key={arc.sys.id}>
					<VStack spacing={6} align='flex-start'>
						<VStack spacing={2} align='flex-start'>
							<Text fontSize={{ base: 'md', sm: 'xl' }} fontWeight='semibold'>
								{locale === 'en' ? `' ${arc.title[locale]} ' was archived.` : `「${arc.title[locale]}」をアーカイブに追加しました。`}
							</Text>
							<Text fontSize={{ base: 'sm', sm: 'md' }} >{format(parseISO(arc.publishDate), 'yyyy/MM/dd')}</Text>
						</VStack>
						<Box>
							{pickHandler(arc, 'species')[locale].map(sp => <Label arg={sp} />)}
							{pickHandler(arc, 'season')[locale].map(se => <Label arg={se} />)}
							{pickHandler(arc, 'color')[locale].map(c => <Label arg={c} />)}
						</Box>
					</VStack>
					<Box><Box css={imgCSS} overflow="hidden" borderRadius={8} w='full' boxShadow={boxShadow}>
						<Image
							src={arc.image.url}
							layout="fill"
							alt='Image'
							className={'image'} />
					</Box></Box>
				</Grid>
			))}
		</VStack>
	);
}