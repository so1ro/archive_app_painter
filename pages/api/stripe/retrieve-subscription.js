import { stripe } from '@/utils/stripe'

const retrieveSubscription = async (req, res) => {
  const { subscription_Id } = JSON.parse(req.body)

  if (req.method === 'POST') {
    try {

      const subscriptionsObj = await stripe.subscriptions.retrieve(subscription_Id)
      return res.status(200).json({ subscriptionsObj })

    } catch (e) {
      //// Logging ////
      console.error('api/stripe/retrieve-subscription にてエラー。【重症】ログイン後、サブスクリプション購入済みのお客様がサブスクリプション情報の取得に失敗。')
      loggerError_Serverside(req, res, e, 'api/stripe/retrieve-subscription にてエラー。【重症】ログイン後、サブスクリプション購入済みのお客様がサブスクリプション情報の取得に失敗。')
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

export default retrieveSubscription
