import { stripe } from '@/utils/stripe'

const domain = process.env.NEXT_PUBLIC_DOMAIN

const createCheckoutSession = async (req, res) => {
  const { price, type, tier_title, unit_amount, currency, user_uuid, user_email, return_page } = JSON.parse(req.body)

  if (req.method === 'POST') {
    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const customerData = price ? { metadata: { auth0_UUID: user_uuid } } : { metadata: { auth0_UUID: user_uuid, tier: tier_title } }
      if (user_email) customerData.email = user_email
      const customer = await stripe.customers.create(customerData)

      // Mode
      const mode = type === 'recurring' ? 'subscription' : 'payment'

      //// Session ////
      let session
      if (price) {
        session = await stripe.checkout.sessions.create({
          mode,
          payment_method_types: ['card'],
          customer: customer.id,
          line_items: [
            {
              price,
              quantity: 1
            }
          ],
          allow_promotion_codes: true,
          // subscription_data: {},
          success_url: `${domain}/account/?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${domain}/${return_page}`
        })
      }

      if (!price) {
        session = await stripe.checkout.sessions.create({
          mode,
          payment_method_types: ['card'],
          customer: customer.id,
          line_items: [
            {
              price_data: {
                // price,
                currency,
                product_data: {
                  name: tier_title,
                },
                unit_amount,
              },
              quantity: 1,
            }
          ],
          allow_promotion_codes: true,
          // billing_address_collection: 'required',
          success_url: `${domain}/account/?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${domain}/${return_page}`
        })
      }
      //// End of Session ////

      return res.status(200).json({ sessionId: session.id })
    } catch (e) {
      //// Logging ////
      console.error('api/create-checkout-session にてエラー。【重要】お客様がチェックアウトに失敗。')
      loggerError_Serverside(req, res, e, 'api/create-checkout-session にてエラー。【重要】お客様がチェックアウトに失敗。')
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

export default createCheckoutSession
