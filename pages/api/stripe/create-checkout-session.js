import { stripe } from '@/utils/stripe';
import { getURL } from '@/utils/helpers';
import { parseJSON } from 'date-fns';

const domain = process.env.NEXT_PUBLIC_DOMAIN

const createCheckoutSession = async (req, res) => {
  const { price, type, user_uuid, user_email, criteriaOnePayPrice } = JSON.parse(req.body);

  if (req.method === 'POST') {
    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const customerData = {
        metadata: {
          auth0_UUID: user_uuid,
          criteria_OnePay_price: criteriaOnePayPrice
        }
      }
      if (user_email) customerData.email = user_email;
      const customer = await stripe.customers.create(customerData)

      // Mode
      const mode = type === 'recurring' ? 'subscription' : 'payment'
      const session = await stripe.checkout.sessions.create({
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
        // billing_address_collection: 'required',
        // subscription_data: {},
        success_url: `${domain}/account/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domain}/account/`
      })

      return res.status(200).json({ sessionId: session.id });
    } catch (e) {
      //// Logging ////
      console.error('api/create-checkout-session にてエラー。【重要】お客様がチェックアウトに失敗。')
      loggerError_Serverside(req, res, e, 'api/create-checkout-session にてエラー。【重要】お客様がチェックアウトに失敗。')
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




  //// nextjs-subscription-payments ////
  // if (req.method === 'POST') {
  //   const token = req.headers.token;
  //   const { price, quantity = 1, metadata = {} } = req.body;

  //   try {
  //     const user = await getUser(token);
  //     const customer = await createOrRetrieveCustomer({
  //       uuid: user.id,
  //       email: user.email
  //     });

  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       billing_address_collection: 'required',
  //       customer,
  //       line_items: [
  //         {
  //           price,
  //           quantity
  //         }
  //       ],
  //       mode: 'subscription',
  //       allow_promotion_codes: true,
  //       subscription_data: {
  //         trial_from_plan: true,
  //         metadata
  //       },
  //       success_url: `${getURL()}/account`,
  //       cancel_url: `${getURL()}/`
  //     });

  //     return res.status(200).json({ sessionId: session.id });
  //   } catch (err) {
  //     console.log(err);
  //     res
  //       .status(500)
  //       .json({ error: { statusCode: 500, message: err.message } });
  //   }
  // } else {
  //   res.setHeader('Allow', 'POST');
  //   res.status(405).end('Method Not Allowed');

};

export default createCheckoutSession;
