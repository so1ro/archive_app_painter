import { upsertFavoriteWork } from '@/utils/useAuth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { loggerError_Serverside } from '@/utils/logger'

const upsertFavoriteWorkToAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth0_UUID, favoriteWork }: { auth0_UUID: string, favoriteWork: [] } = JSON.parse(req.body)

  if (req.method === 'POST') {
    try {
      // throw new Error('エラー in fetch-user-metadata')
      const data = await upsertFavoriteWork(auth0_UUID, favoriteWork)
      return res.status(200).json({ data })

    } catch (e) {
      //// Logging ////
      console.error('api/upsert-favorite-work にて、エラー。お気に入り動画は保存/削除ができませんでした。');
      loggerError_Serverside(req, res, e, 'api/upsert-favorite-work にて、エラー。お気に入り動画は保存/削除ができませんでした。')
      //// end of Logging ////
      res.status(400)
      return res.send({
        error: {
          message: e.message,
        }
      })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default upsertFavoriteWorkToAuth
