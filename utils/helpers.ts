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