import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons"
import { Box, HStack } from "@chakra-ui/react"

export function Toast({ text }) {
	return (
		<HStack color="white" p={4} bg="#69b578" borderRadius={6} align='flex-start' spacing={4}>
			<CheckCircleIcon w={6} h={6} color="white" /><Box whiteSpace='pre-wrap'>{text}</Box>
		</HStack>
	)
}

export function ToastError({ text }) {
	return (
		<HStack color="white" p={4} bg="red.300" borderRadius={6} align='flex-start' spacing={4}>
			<InfoIcon w={6} h={6} color="white" /><Box whiteSpace='pre-wrap'>{text}</Box>
		</HStack>
	)
}