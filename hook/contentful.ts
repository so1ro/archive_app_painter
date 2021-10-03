const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
import { maxImportContent } from '@/hook/contentful-queries';

export async function fetchContentful(query: string) {
  // add a try / catch loop for nicer error handling
  try {
    const res = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${space}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        // throw our query (a string) into the body directly
        body: JSON.stringify({ query }),
      },
    );
    const { data } = await res.json();
    return data;
  } catch (e) {
    // add a descriptive error message first,
    // so we know which GraphQL query caused the issue
    console.error(`There was a problem retrieving entries with the query ${query}`);
    console.error(e);
  }
}

export function generateSearchQuery(order: boolean | null, filter: string | null, skipNum: number | null, limit: number | null, desc: boolean | null) {
  const regex = new RegExp(/'/, 'gi')
  const searchQuery = `{
    archiveVideosCollection ( 
      ${order ? (desc ? 'order : publishDate_DESC' : 'order : publishDate_ASC') : ''}
      ${filter ? (', where: ' + filter.replace(regex, '"')) : ''}
      ${skipNum ? (', skip: ' + skipNum) : ''}
      ${limit ? (', limit: ' + limit) : (', limit: ' + maxImportContent)}
      ) {
        items {
        sys {
          id
        }
        title
        thumbnail {
          url(transform: { resizeStrategy: FILL, cornerRadius: 20, quality: 90,format: PNG })
        }
        youtubeId
        vimeoId
        publishDate
        series
        ride
        special
        domesticRegion
        foreignRegion
        food
        year
        timestamp
        description{
          json
        }
        keyword
        prefecture
        maniac
        map
      }
    }
  }`
  // console.log('searchQuery:', searchQuery)

  return searchQuery
}