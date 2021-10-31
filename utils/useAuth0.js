import { stripe } from '@/utils/stripe'
import axios from 'axios'
import _ from 'lodash'
import { format, fromUnixTime } from "date-fns"

const getAuth0URL = (id) => {
    return `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${id}`
}

////////////////////////////////////////////////
// Get Auth0 Access Token
const auth0AccessToken = async () => {
    // Options of Fetch Access_token
    const options = {
        method: 'post',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
            grant_type: "client_credentials",
            client_id: `${process.env.AUTH0_MTOM_CLIENTID}`,
            client_secret: `${process.env.AUTH0_MTOM_CLIENT_SECRET}`
        }
    }
    const { access_token } = await axios(options)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })
    return access_token

}

////////////////////////////////////////////////
// Patch user's App_metadata to Auth0
const patchUserMetadataToAuth0 = async (user_id, token, metadata) => {
    const URL = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`
    const option = {
        url: URL,
        method: 'PATCH',
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            user_metadata: { ...metadata }
        }
    }

    const data = await axios(option)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })

    return data
}

////////////////////////////////////////////////
// Exported Function
////////////////////////////////////////////////

//// Get User metadata from Auth0
const getUserMetadata = async (user_id, token) => {
    const URL = getAuth0URL(user_id)
    const auth0Token = !!token ? token : await auth0AccessToken()

    const option = { headers: { authorization: `Bearer ${auth0Token}` } }
    const data = await axios(URL, option)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })

    return data
}


//// Send Subscription record to Auth0
const upsertSubscriptionRecord = async (event) => {

    const { id: subscription_Id, customer: customer_Id } = event

    try {
        const { metadata: { auth0_UUID } } = await stripe.customers.retrieve(customer_Id)
        const auth0Token = await auth0AccessToken()
        const metadata = {
            Subscription_Detail: { subscription_Id }
        }
        // canceled_at : If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with cancel_at_period_end, canceled_at will reflect the time of the most recent update request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (e) {
        //// Logging ////
        console.error(`upsertSubscriptionRecord(api/stripe/webhook) にてエラー。Auth0へSubscriptionの記録保存に失敗。subscriptionID : ${subscription_Id}, customerID : ${customer_Id}`, e)
        loggerError_Serverside(req, res, e, `upsertSubscriptionRecord(api/stripe/webhook) にてエラー。Auth0へSubscriptionの記録保存に失敗。subscriptionID : ${subscription_Id}, customerID : ${customer_Id}`)
        //// end of Logging ////      
        throw new Error(e)
    }
}

//// Send Charge (Payment Amount) record to Auth0
const upsertChargeRecord = async (event) => {

    const status = event.object // 'invoice' or 'refund'
    const customer_Id = event.customer
    const { id, currency } = event

    let amount
    if (status === 'invoice') currency === 'usd' ? amount = (event.amount_paid / 100) : amount = event.amount_paid
    if (status === 'charge') currency === 'usd' ? amount = ((event.amount_refunded * -1) / 100) : amount = event.amount_refunded * -1

    try {
        const { metadata: { auth0_UUID } } = await stripe.customers.retrieve(customer_Id)
        const auth0Token = await auth0AccessToken()
        const {
            user_metadata: {
                User_Detail: { past_charged_fee, userCurrency: currentUserCurrency },
                One_Pay_Detail }
        } = await getUserMetadata(auth0_UUID, auth0Token)


        const newChargedFeeRecord = (past_charged_fee + amount) || 0

        let metadata = {}
        let User_Detail = {
            past_charged_fee: newChargedFeeRecord,
            userCurrency: currentUserCurrency ? currentUserCurrency : currency
        }

        // When refunding, remove the History from One_Pay_Detail
        if (status === 'charge' && One_Pay_Detail) {
            const removed_History_OnePayDetail = One_Pay_Detail.filter(h => h.id !== id)
            metadata = { User_Detail, One_Pay_Detail: removed_History_OnePayDetail }
        } else {
            metadata = { User_Detail }
        }

        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (e) {
        //// Logging ////
        console.error(`upsertChargeRecord (api/stripe/webhook) にてエラー。Auth0へ"支払い累積"の記録保存に失敗。amount : ${amount}, customerID : ${customer_Id}`, e)
        loggerError_Serverside(req, res, e, `upsertChargeRecord (api/stripe/webhook) にてエラー。Auth0へ"支払い累積"の記録保存に失敗。amount : ${amount}, customerID : ${customer_Id}`)
        //// end of Logging ////      
        throw new Error(e)
    }
}

//// Send One-pay record to Auth0
const upsertOnePayRecord = async (event) => {

    const { amount, customer: customer_Id, created, invoice, id, currency } = event
    const practicalAmount = currency === 'usd' ? amount / 100 : amount

    try {
        const { metadata: { auth0_UUID, tier } } = await stripe.customers.retrieve(customer_Id)
        const auth0Token = await auth0AccessToken()

        // if it's subscription charge.succeeded, it returns here
        if (invoice) return // Subscription charge always has invoice

        const { user_metadata:
            { User_Detail: { past_charged_fee, userCurrency: currentUserCurrency },
                One_Pay_Detail: currentOnePayHistory } } = await getUserMetadata(auth0_UUID, auth0Token)

        const newChargedFeeRecord = (past_charged_fee + practicalAmount) || 0
        const newOnePayHistory = {
            tier,
            id,
            amount: practicalAmount,
            Date: format(fromUnixTime(created), 'yyyy/MM/dd HH:mm:ss')
        }

        let One_Pay_Detail = currentOnePayHistory ? [newOnePayHistory, ...currentOnePayHistory] : [newOnePayHistory]
        let userCurrency = currentUserCurrency ? currentUserCurrency : currency

        const metadata = {
            User_Detail: { past_charged_fee: newChargedFeeRecord, userCurrency },
            One_Pay_Detail
        }
        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (e) {
        //// Logging ////
        console.error(`upsertOnePayRecord (api/stripe/webhook) にてエラー。Auth0へOne_Pay_Detailの記録保存に失敗。customerID : ${customer_Id}`, e)
        loggerError_Serverside(req, res, e, `upsertOnePayRecord (api/stripe/webhook) にてエラー。Auth0へOne_Pay_Detailの記録保存に失敗。customerID : ${customer_Id}`)
        //// end of Logging ////      
        throw new Error(e)
    }
}

//// Send Favorite Video Id record to Auth0
const upsertFavoriteWork = async (auth0_UUID, favoriteWork) => {

    try {
        const auth0Token = await auth0AccessToken()
        const { user_metadata: { User_Detail: { past_charged_fee } } } = await getUserMetadata(auth0_UUID, auth0Token)
        const metadata = { User_Detail: { past_charged_fee, favorite_work: favoriteWork } }
        const data = await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)
        return data

    } catch (e) {
        console.error('Error in upsertFavoriteWork:', e)
        throw new Error(err)
    }
}

////////////////////////////////////////////////


export {
    getUserMetadata,
    upsertSubscriptionRecord,
    upsertChargeRecord,
    upsertOnePayRecord,
    upsertFavoriteWork,
}