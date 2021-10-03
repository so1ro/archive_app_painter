import { NextApiRequest, NextApiResponse } from 'next'
import { loggerError_Serverside } from '@/utils/logger'

const contactApi = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {

		const contact = req.body
		const finalContactData = {
			...contact,
			replyTo: process.env.CONTACT_EMAIL,
			accessKey: process.env.STATIC_FORMS_ACCESS_KEY,
		}

		try {
			const result = await fetch('https://api.staticforms.xyz/submit', {
				method: 'POST',
				body: JSON.stringify(finalContactData),
				headers: { 'Content-Type': 'application/json' },
			})
			const json = await result.json()

			if (json.success) {
				//成功したら json を return
				return res.status(200).json(json)

			} else {
				res.status(400)
				return res.send({
					error: {
						message: json.message,
					}
				})
			}

		} catch (e) {
			//// Logging ////
			console.error('api/contactにて、エラー。メッセージは送信されませんでした。', e);
			loggerError_Serverside(req, res, e, 'api/contactにて、エラー。メッセージは送信されませんでした。')
			//// end of Logging ////
		}

	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end('Method Not Allowed')
	}
}

export default contactApi