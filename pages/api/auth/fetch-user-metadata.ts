import { getUserMetadata } from '@/utils/useAuth0';
import { NextApiRequest, NextApiResponse } from 'next'
import { loggerError_Serverside } from '@/utils/logger';

const retrieveUserMetadata = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id }: { user_id: string } = JSON.parse(req.body);

  if (req.method === 'POST') {
    try {
      const { user_metadata }: { user_metadata: object } = await getUserMetadata(user_id)
      return res.status(200).json({ user_metadata });

    } catch (e) {
      //// Logging ////
      console.error('api/fetch-user-metadata にてエラー。user_metadataの取得に失敗。')
      loggerError_Serverside(req, res, e, 'api/fetch-user-metadata にてエラー。user_metadataの取得に失敗。')
      //// end of Logging ////      
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        }
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default retrieveUserMetadata;
