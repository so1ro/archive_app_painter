import { compareAsc } from "date-fns";

export const getURL = () => {
  const url =
    process?.env?.URL && process.env.URL !== ''
      ? process.env.URL
      : process?.env?.VERCEL_URL && process.env.VERCEL_URL !== ''
        ? process.env.VERCEL_URL
        : 'http://localhost:3000';
  return url.includes('http') ? url : `https://${url}`;
};

export const postData = async ({ url, /*token,*/ data = {} }) => {
  let res: any = {}
  res = await fetch(url, {
    method: 'POST',
    // headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (res.error) { throw new Error(res.error); }
  return res.json();
};

export const getData = async ({ url }) => {
  let res: any = {}
  res = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
  });

  if (res.error) { throw new Error(res.error); }
  return res.json();
};

export const toDateTime = (secs) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};


export const dailyNum = (array) => {
  const today = Date.now();
  const days = Math.floor(today / (1000 * 60 * 60 * 24));
  const number = array.length;
  return days % number;
}

export const arrayProceedHandler = (arr: AllArchivesInterface[], currentData: AllArchivesInterface) => {
  const index = arr.indexOf(currentData);
  let nextData
  if (index >= 0 && index < arr.length - 1) return nextData = arr[index + 1]
  else return nextData = arr[0]
}

export const currencyUSDChecker = (userCurrency, locale) => userCurrency ? userCurrency === 'usd' : locale === 'en'

export const periodCurrentUserTierFinder = (tiers, User_Detail, locale) => (
  tiers
    .filter(t => t.currency === User_Detail?.userCurrency)
    .map(t => ({ ...t, unit_amount: currencyUSDChecker(User_Detail?.userCurrency, locale) ? t.unit_amount / 100 : t.unit_amount }))
    .sort((a, b) => a.unit_amount - b.unit_amount)
    .filter(t => t.unit_amount <= User_Detail?.past_charged_fee).slice(-1)[0]?.viewPeriod
)

export const isArchiveNotInTierPeriod_userIsNotSubscriber_checker = (subscription_state, archive, userTierPeriod) => (
  subscription_state !== 'subscribe' && compareAsc(new Date(archive.publishDate), new Date(userTierPeriod)) >= 0
)
