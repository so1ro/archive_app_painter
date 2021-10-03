import { stripe } from '@/utils/stripe';
import _ from 'lodash'

export async function fetchAllPrices() {
    // add a try / catch loop for nicer error handling
    try {
        const prices = await stripe.prices.list();
        return await prices.data
            .filter(price => price.type === 'recurring' || 'one_time')
            .filter(price => (price.nickname && price.active))
            .sort((a, b) => a.unit_amount - b.unit_amount)
            .map(prod => _.pick(prod, ['id', 'nickname', 'unit_amount', 'type', 'recurring', 'active', 'livemode']))

    } catch (e) {
        // add a descriptive error message first,
        console.error(`There was a problem retrieving Subscription Plans`);
        console.error(e);
    }
}
