import { stripe } from '@/utils/stripe'
import { postData } from '@/utils/helpers'
import { upsertSubscriptionRecord, upsertChargeRecord, upsertOnePayRecord } from '@/utils/useAuth0'

// Stripe requires the raw body to construct the event.
export const config = {
    api: {
        bodyParser: false
    }
}

async function buffer(readable) {
    const chunks = []
    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        )
    }
    return Buffer.concat(chunks)
}

const relevantEvents = new Set([
    'invoice.payment_succeeded',
    'charge.succeeded',
    'charge.refunded',
    // 'checkout.session.completed',
    // 'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);

// Match the raw body to content type application/json
const webhookHandler = async (req, res) => {
    if (req.method === 'POST') {
        const buf = await buffer(req)
        const sig = req.headers['stripe-signature']

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?
            process.env.STRIPE_WEBHOOK_SECRET_LIVE : process.env.STRIPE_WEBHOOK_SECRET

        let event

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
        } catch (e) {
            console.log(`❌ Error message: ${e.message}`)
            return res.status(400).send(`Webhook Error: ${e.message}`)
        }

        if (relevantEvents.has(event.type)) {
            try {
                // Handle the event
                switch (event.type) {
                    case 'customer.subscription.created':
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscriptionSession = event.data.object
                        console.log('subscriptionSession:', subscriptionSession)
                        await upsertSubscriptionRecord(subscriptionSession)
                        break

                    // Subscription
                    case 'invoice.payment_succeeded':
                        const subscriptionPaymentSession = event.data.object
                        console.log('subscriptionPaymentSession', subscriptionPaymentSession)
                        await upsertChargeRecord(subscriptionPaymentSession)
                        break

                    // One Pay
                    case 'charge.succeeded':
                        const chargeOnePayPaymentSession = event.data.object
                        console.log('chargeOnePayPaymentSession:', chargeOnePayPaymentSession)
                        await upsertOnePayRecord(chargeOnePayPaymentSession)
                        break

                    // Refund
                    case 'charge.refunded':
                        const refundSession = event.data.object
                        console.log('refound:', refundSession)
                        await upsertChargeRecord(refundSession)
                        break

                    default:
                        console.log(`Unhandled event type ${event.type}`)
                }

            } catch (e) {
                //// Logging ////
                console.error(`api/stripe/webhook にてエラー。${event.type}の処理で、エラーが発生しました。`, e)
                loggerError_Serverside(req, res, e, `api/stripe/webhook にてエラー。${event.type}の処理で、エラーが発生しました。`)
                //// end of Logging ////      
                return res.json({ error: 'Webhook handler failed. View logs.' })
            }
        }

        // Return a response to acknowledge receipt of the event
        res.json({ received: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method Not Allowed')
    }
}

export default webhookHandler