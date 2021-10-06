import { getTweets } from '@/lib/twitter'
import { loggerError_Serverside } from '@/utils/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetchTweetAst } from 'static-tweets'


const twitter = async (req: NextApiRequest, res: NextApiResponse) => {

	try {

		const { data } = await getTweets()
		const allTweetId = data.map(t => t.id)

		let twitterAST = []
		for (const id of allTweetId) {
			const tweetAst = await fetchTweetAst(id)
			twitterAST.push({ id, tweetAst })
		}

		return res.status(200).json({ twitterAST })

	} catch (e) {
		//// Logging ////
		console.error('api/twetter にてエラー。ツイッターの新規読み込みに失敗。')
		loggerError_Serverside(req, res, e, 'api/twetter にてエラー。ツイッターの新規読み込みに失敗。')
		//// end of Logging ////
		res.status(400)
		return res.send({
			error: {
				message: e.message,
			}
		})
	}
}

export default twitter
