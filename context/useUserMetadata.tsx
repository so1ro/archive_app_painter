import { useEffect, useState, createContext, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { postData } from '@/utils/helpers';
import { format, fromUnixTime, isBefore } from 'date-fns'
import { stripe } from '@/utils/stripe'

export const UserMetadataContext = createContext(null);

export const UserMetadataProvider = (props) => {

  // State
  const { user, isLoading } = useUser();
  const [{ isMetadataLoading }, setIsMetadataLoading] = useState<{ isMetadataLoading: boolean }>({ isMetadataLoading: false })
  const [{ User_Detail }, setUserDetail] = useState<{ User_Detail: object }>({ User_Detail: null })
  const [{ Subscription_Detail }, setSubscriptionDetail] = useState<{ Subscription_Detail: object }>({ Subscription_Detail: null })
  const [{ One_Pay_Detail }, setOnePayPermanentDetail] = useState<{ One_Pay_Detail: object }>({ One_Pay_Detail: null })
  const [{ error_metadata }, setErrorMetadata] = useState<{ error_metadata: string }>({ error_metadata: '' })
  const [{ isBeforeCancelDate }, setIsBeforeCancelDate] = useState<{ isBeforeCancelDate: boolean }>({ isBeforeCancelDate: false })
  // Subscription State "subscribe" || "unsubscribe" || "paused"
  const [{ subscription_state }, setSubscriptionState] = useState<{ subscription_state: string }>({ subscription_state: 'unsubscribe' })
  // Temporary check isSubscribing for after Payment and check via returning URL
  const [{ temporaryPaidCheck }, setTemporaryPaidCheck] = useState<{ temporaryPaidCheck: boolean }>({ temporaryPaidCheck: false })

  // State for Saved Data
  const [{ favoriteVideo }, setFavoriteVideo] = useState<{ favoriteVideo: [] }>({ favoriteVideo: [] })

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      setIsMetadataLoading({ isMetadataLoading: true })
      const getUserMetadata = async () => {
        try {
          const { user_metadata } = await postData({
            url: '/api/auth/fetch-user-metadata',
            data: { user_id: user.sub }
          }).then(data => data)

          // User_Detailを取得
          if (user_metadata.User_Detail) {
            const { User_Detail } = user_metadata
            setUserDetail({ User_Detail })
          }

          // ワンペイ永久購入済み One_Pay_Detailを取得
          if (user_metadata.One_Pay_Detail) {
            const { One_Pay_Detail } = user_metadata
            setOnePayPermanentDetail({ One_Pay_Detail })
          }

          // if favorite_video is saved on Auth0
          if (user_metadata.User_Detail.favorite_video) {
            setFavoriteVideo({ favoriteVideo: user_metadata.User_Detail.favorite_video })
          }

          // サブスクリプション購入済み Subscription_Detailを取得
          if (user_metadata.Subscription_Detail) {
            const { Subscription_Detail: { subscription_Id, criteria_OnePay_price } } = user_metadata

            const { subscriptionsObj } = await postData({
              url: '/api/stripe/retrieve-subscription',
              data: { subscription_Id }
            }).then(data => data)

            const Subscription_Detail = {
              customer_Id: subscriptionsObj.customer,
              price_Id: subscriptionsObj.plan.id,
              subscription_Price: subscriptionsObj.plan.amount,
              subscription_Description: subscriptionsObj.plan.nickname,
              subscription_Id: subscription_Id,
              subscription_Status: subscriptionsObj.status,
              cancel_at_period_end: subscriptionsObj.cancel_at_period_end,
              cancel_at: subscriptionsObj.cancel_at,
              canceled_at: subscriptionsObj.canceled_at,
              criteria_OnePay_price,
              pause_collection: subscriptionsObj.pause_collection,
            }
            setSubscriptionDetail({ Subscription_Detail })

            // Set Subscription_State
            !!Subscription_Detail.pause_collection || (
              Subscription_Detail.subscription_Status !== 'active' &&
              Subscription_Detail.subscription_Status !== 'trialing' &&
              Subscription_Detail.subscription_Status !== 'canceled'
            ) ?
              setSubscriptionState({ subscription_state: 'paused' }) :
              ((Subscription_Detail.subscription_Status === 'active' || Subscription_Detail.subscription_Status === 'trialing') && setSubscriptionState({ subscription_state: 'subscribe' }))

            // Convert Timestamps to readable one
            if (Subscription_Detail.cancel_at) {
              const today = new Date()
              const cancel_at = fromUnixTime(Subscription_Detail.cancel_at)
              Subscription_Detail.cancel_at = format(cancel_at, 'yyyy年 M月 d日 k時',)
              // Check if Today is before the cancel day
              setIsBeforeCancelDate({ isBeforeCancelDate: isBefore(today, cancel_at) })
            }

            if (Subscription_Detail.canceled_at) {
              const canceled_at = fromUnixTime(Subscription_Detail.canceled_at)
              Subscription_Detail.canceled_at = format(canceled_at, 'yyyy年 M月 d日',)
            }

            // if subscription is Paused
            if (Subscription_Detail?.pause_collection?.resumes_at) {
              const resumes_at = fromUnixTime(Subscription_Detail.pause_collection.resumes_at)
              Subscription_Detail.pause_collection.resumes_at = format(resumes_at, 'yyyy年 M月 d日 k時',)
            }


          }
        } catch (e) {
          setErrorMetadata({ error_metadata: e.message })
          throw new Error(e)
        }
        finally {
          setIsMetadataLoading({ isMetadataLoading: false })
        }
      }
      getUserMetadata();
    }
  }, [user])

  const value = {
    User_Detail,
    isMetadataLoading,
    subscription_state,
    Subscription_Detail,
    One_Pay_Detail,
    error_metadata,
    isBeforeCancelDate,
    temporaryPaidCheck,
    favoriteVideo,
    setFavoriteVideo,
    setTemporaryPaidCheck,
  }
  return <UserMetadataContext.Provider value={value} {...props} />;
};

export const useUserMetadata = () => {
  const context = useContext(UserMetadataContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};