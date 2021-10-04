import Router from 'next/router'
// import { useState } from "react"
import * as Yup from "yup"
import { Formik, Form, } from 'formik'
import { FormikInput, FormikSelect, FormikSubmitButton, FormikTextArea } from '@/components/Formik/Fields'
import { useRouter } from 'next/router'

import { useColorModeValue } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/toast"
import { Toast, ToastError } from '@/components/Toast'
import { highlight_color, text_color } from '@/styles/colorModeValue'

export default function ApplyForm(
	{ userEmail, auth0_UUID }: { userEmail?: string, auth0_UUID?: string }
) {

	// const [response, setResponse] = useState({ type: '', message: '', })
	const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)
	const blurTextColor = useColorModeValue(text_color.l, text_color.d)
	const toast = useToast()
	const { locale, route } = useRouter()

	// Function
	const handleSubmit = async (values) => {

		try {
			toast({
				duration: 6000, render: () => (
					<Toast text={
						// route.includes('account') ?
						// locale === 'en' ? "Sending your application..." : "申請を送信中..." :
						locale === 'en' ? "Sending your message..." : "お問合せを送信中..."} />
				)
			})
			// api/contact
			const res = await fetch('/api/contact', {
				method: 'POST',
				body: JSON.stringify({ ...values, route }),
				headers: { 'Content-Type': 'application/json' },
			})
			const json = await res.json()

			// api/auth/upsert-user-metadata
			// if (route.includes('account')) {
			// 	const { name, plan, snsIntegration, snsURL, type, } = values
			// 	const sendBody = { auth0_UUID, meta: { isApplied: true, name, plan, snsIntegration, snsURL, type, } }
			// 	await fetch('/api/auth/upsert-user-metadata', {
			// 		method: 'POST',
			// 		body: JSON.stringify(sendBody),
			// 		headers: { 'Content-Type': 'application/json' },
			// 	})
			// }

			if (json.success) {
				//成功したらsuccessページに飛ぶ
				// if (route.includes('account')) Router.reload()
				// if (route.includes('contact')) 
				Router.push(`/${locale}/contact_success`)
			} else {
				toast({
					status: 'error',
					isClosable: true,
					duration: 9000,
					render: () => (<ToastError text={"送信中にエラーが発生しました。"} />)
				})
			}

		} catch (e) {
			toast({
				description: locale === 'en' ?
					'Your email was not sent. Could you please send an email to the following email address. masamichi.kagaya.ap+archive-app-official@gmail.com' :
					'ネットワーク障害でメールの送信が完了しませんでした。お手数をおかけして申し訳ございません。迅速に対応いたしますので、次のアドレスまでご連絡ください。masamichi.kagaya.ap+archive-app-official@gmail.com',
				status: "error",
				duration: null,
				isClosable: true,
			})
		}
	}

	return (
		<>
			<Formik
				initialValues={{
					name: '',
					email: userEmail ?? '',
					// plan: '',
					// snsIntegration: '',
					// snsURL: '',
					// followerNumber: '',
					// type: '',
					message: '',
				}}
				validationSchema={Yup.object({
					name: Yup.string()
						.max(30, 'Must be 30 characters or less')
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					email: Yup.string()
						.email('Invalid email address')
						.required('Required'),
					// plan: Yup.string()
					// 	.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					// snsIntegration: route.includes('account') ? Yup.string()
					// 	.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`) : null,
					// snsURL: Yup.string()
					// 	.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					// followerNumber: route.includes('account') ? Yup.number()
					// 	.positive(`${locale === 'en' ? '* Please enter positive number.' : '※ 正の整数をご入力ください。'}`)
					// 	.integer()
					// 	.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`) : null,
					// type: Yup.string()
					// 	.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					message: Yup.string()
						.max(2000, 'Must be 2000 characters or less')
					// .required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
				})}
				onSubmit={(values, { setSubmitting }) => {
					setTimeout(() => {
						handleSubmit(values)
						setSubmitting(false)
					}, 400)
				}}>

				{({ errors, touched }) => (
					<Form>
						<FormikInput label={locale === 'en' ? 'Name' : 'お名前'}
							name="name" type="text" mb={3} variant="flushed" borderColor='gray.500'
							focusBorderColor={highlightColor} />
						<FormikInput label={locale === 'en' ? 'Email address' : 'メールアドレス'}
							name="email" type="text"
							mb={3} variant="unstyled"
							color={blurTextColor}
							borderBottom='1px solid' borderRadius={0} pb={2} borderColor='gray.500'
							value={userEmail} isReadOnly={userEmail ? true : false} />
						{/* <FormikSelect label={locale === 'en' ? 'Plan' : 'プラン'} name="plan">
							{applyText.plan[locale].map(plan => <option value={plan.value} key={plan.value}>{plan.text}</option>)}
						</FormikSelect> */}
						{/* {route.includes('account') && <FormikSelect label={locale === 'en' ? 'Do you want SNS integration?' : 'SNSの統合もご希望ですか?'} name="snsIntegration">
							{<option value={'yes'}>{locale === 'en' ? 'Yes' : 'はい'}</option>}
							{<option value={'no'}>{locale === 'en' ? 'No' : 'いいえ'}</option>}
							{<option value={'considering'}>{locale === 'en' ? 'Still considering' : 'まだ検討中'}</option>}
						</FormikSelect>} */}
						{/* <FormikInput label={locale === 'en' ? 'URL of your main SNS' : 'あなたのプロジェクトにおける最も重要なSNS (URL)'}
							name="snsURL" type="text"
							mb={3} variant="flushed" borderColor='gray.500'
							focusBorderColor={highlightColor} />
						{route.includes('account') && <FormikInput label={locale === 'en' ? 'Current number of followers in your SNS' : 'あなたのSNSの現在のフォロワー数'}
							name="followerNumber" type="text"
							mb={3} variant="flushed" borderColor='gray.500'
							focusBorderColor={highlightColor} />} */}
						{/* <FormikSelect label={locale === 'en' ? 'Creation Type' : '創作物のタイプ'} name="type">
							{applyText.type[locale].map(type => <option value={type} key={type}>{type}</option>)}
						</FormikSelect> */}
						<FormikTextArea
							label={
								// route.includes('account') ?
								// 	locale === 'en' ? 'Message (Question or other SNS urls other than above)' : '備考（ご質問や上記以外のSNS）' :
								locale === 'en' ? 'Message' : 'メッセージ'
							}
							name="message" whiteSpace='pre-wrap'
							px={6} py={4} mb={3}
							size="xl" rows={10}
							borderColor='gray.500'
							focusBorderColor={highlightColor}
							borderRadius={4}
							lineHeight={1.6} />
						<FormikSubmitButton errors={errors} touched={touched} />
					</Form>
				)}

			</Formik>
		</>
	)
}