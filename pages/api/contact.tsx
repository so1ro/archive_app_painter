import { NextApiRequest, NextApiResponse } from 'next'
import { loggerError_Serverside } from '@/utils/logger'
import nodemailer from 'nodemailer'

const ContactApi = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {

		const mailhtml = () => {
			switch (req.body.route) {
				// case '/account':
				// 	return `<div>
				// 	<p><b>お名前（作家名）</b></p>
				// 	<p>${req.body.name}</p><br />
				// 	<p><b>メールアドレス</b></p>
				// 	<p>${req.body.email}</p><br />
				// 	<p><b>ご検討中のプランをお選びください。</b></p>
				// 	<p>${req.body.plan}</p><br />
				// 	<p><b>SNSの統合もご希望ですか?</b></p>
				// 	<p>${req.body.snsIntegration}</p><br />
				// 	<p><b>あなたのSNSのURL</b></p>
				// 	<p>${req.body.snsURL}</p><br />
				// 	<p><b>あなたのSNSの現在のフォロワー数</b></p>
				// 	<p>${req.body.followerNumber}</p><br />
				// 	<p><b>創作物のタイプをお知らせください。</b></p>
				// 	<p>${req.body.type}</p><br />
				// 	<p><b>備考（ご質問や上記以外のSNS）</b></p>
				// 	<p>${req.body.message.replace(regex, '<br />')}</p>
				// </div>`

				case '/contact':
					return `<div>
					<p><b>お名前</b></p>
					<p>${req.body.name}</p><br />
					<p><b>メールアドレス</b></p>
					<p>${req.body.email}</p><br />
					<p><b>ご検討中のプランをお選びください。</b></p>
					<p>${req.body.plan}</p><br />
					<p><b>あなたのSNSのURL</b></p>
					<p>${req.body.snsURL}</p><br />
					<p><b>創作物のタイプをお知らせください。</b></p>
					<p>${req.body.type}</p><br />
					<p><b>メッセージ</b></p>
					<p>${req.body.message.replace(regex, '<br />')}</p>
				</div>`
			}
		}
		const regex = new RegExp(/\n/, 'gi') // New line : change \n to <br />
		const mailData = {
			from: req.body.email,
			to: 'masamichi.kagaya.ap+archive-app-official@gmail.com',
			// Someday combine Apply and Contact with "{req.body.plan ? 'Apply Archive app from' : 'Contact from'}"
			subject:
				// req.body.route.includes('account') ?
				// 	`Apply to Archive app from ${req.body.name}` :
				`Inquiry to Archive app from ${req.body.name}`,
			// Someday combine Apply and Contact with "{req.body.name && <p> ~ </p>}"
			html: mailhtml(),
			text: req.body.message,
		}

		const transporter = nodemailer.createTransport({
			port: 465,
			host: "smtp.gmail.com",
			auth: {
				user: process.env.CONTACT_SMTP_ADDRESS,
				pass: process.env.CONTACT_SMTP_PASSWORD,
			},
			secure: true,
		})

		try {
			const result = await transporter.sendMail(mailData, function (err, info) {
				if (err) {
					res.status(400)
					return res.send({ error: { message: err } })
				}
				// else console.log(info)
			})
			res.status(200).send({ success: { message: 'mail was sent' } })

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

export default ContactApi