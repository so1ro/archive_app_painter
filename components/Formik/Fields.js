import { useField } from 'formik'
import { Select, HStack, VStack, Input, Textarea, Text, useColorModeValue, Button, useToast } from '@chakra-ui/react'
import { highlight_color, text_color } from '@/styles/colorModeValue'
import { useRouter } from 'next/router'

const form_parts_spacing = 24
const form_label_mr = 4
const form_label_mb = 2

export const FormikInput = ({ label, ...props }) => {

	const [field, meta] = useField(props)
	const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)

	return (
		<VStack spacing={form_label_mb} alignItems='flex-start' mb={form_parts_spacing}>
			<HStack spacing={form_label_mr}>
				<label htmlFor={props.id || props.name}>{label}</label>
				{meta.touched && meta.error ? (
					<Text color={highlightColor} fontSize='sm'>{meta.error}</Text>
				) : null}
			</HStack>
			<Input {...field} {...props} />
		</VStack>
	)
}

export const FormikTextArea = ({ label, ...props }) => {

	const [field, meta] = useField(props)
	const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)

	return (
		<VStack spacing={form_label_mb} alignItems='flex-start' mb={form_parts_spacing}>
			<HStack spacing={form_label_mr}>
				<label htmlFor={props.id || props.name}>{label}</label>
				{meta.touched && meta.error ? (
					<Text as='span' color={highlightColor} fontSize='sm'>{meta.error}</Text>
				) : null}
			</HStack>
			<Textarea {...field} {...props} />
		</VStack>
	)
}


export const FormikSelect = ({ label, ...props }) => {

	const [field, meta] = useField(props)
	const textColor = useColorModeValue(text_color.l, text_color.d)
	const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)
	const { locale } = useRouter()

	let placeholder
	switch (props.name) {
		case 'plan':
			placeholder = locale === 'en' ? 'Please choose your plan on the table' : 'ご検討中のプランをお選びください。'
			break;
		case 'type':
			placeholder = locale === 'en' ? 'Please choose your creation type' : '制作物のタイプをお知らせください。'
			break;
		case 'snsIntegration':
			placeholder = locale === 'en' ? 'Yes / No / etc' : 'はい／いいえ／他'
			break;
	}

	return (
		<VStack spacing={form_label_mb} alignItems='flex-start' mb={form_parts_spacing}>
			<HStack spacing={form_label_mr}>
				<label htmlFor={props.id || props.name}>{label}</label>
				{meta.touched && meta.error ? (
					<Text as='span' color={highlightColor} fontSize='sm'>{meta.error}</Text>
				) : null}
			</HStack>
			<Select
				{...field} {...props}
				d='inline-block'
				placeholder={placeholder}
				w='none'
				borderColor="gray.500"
				borderRadius={4}>
			</Select>
		</VStack >
	)
}


export const FormikSubmitButton = ({ errors, touched }) => {

	const { locale } = useRouter()

	return (
		<Button
			type="submit"
			colorScheme='green'
			disabled={!!Object.keys(errors).length || !Object.keys(touched).length}>{locale === 'en' ? 'Submit' : '送信'}</Button>
	)
}