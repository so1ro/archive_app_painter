import { fetchContentful, generateSearchQuery } from '@/hook/contentful'
import { NextApiRequest, NextApiResponse } from 'next'
import Fuse from 'fuse.js'
import { limitSkipNum } from '@/hook/contentful-queries'
import { loggerError_Serverside } from '@/utils/logger'

const graphqlSearch = async (req: NextApiRequest, res: NextApiResponse) => {

  const {
    order,
    keyword,
    filter,
    skipNum,
    limit,
    desc
  }: {
    order: boolean | null,
    keyword: string | null,
    filter: string | null,
    skipNum: number | null,
    limit: number | null,
    desc: boolean | null
  } = JSON.parse(req.body)


  if (req.method === 'POST') {
    try {

      const searchQuery = generateSearchQuery(order, filter, skipNum, limit, desc)
      const data = await fetchContentful(searchQuery)

      // Fuse-search
      const options = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        includeMatches: true,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        threshold: 0.5,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        keys: [
          // contentful-queries.js の query_allArchives の項目を入れること
          'title.en',
          'title.ja',
          'publishDate',
          'timestamp',
          'keyword',
          'color',
          'season',
          'species',
          'createdYear',
        ]
      }

      if (!keyword) {
        return res.status(200).json({ data })
      } else {
        const fuse = new Fuse(data.archive2Collection.items, options)
        const result = await fuse.search(keyword)
        const searchedArchive = result?.map(archive => archive.item).slice(0, limitSkipNum)

        return res.status(200).json({ searchedArchive })
      }


    } catch (e) {
      //// Logging ////
      console.error('api/graphqlSearchにてエラー。スクロールボトムのよるアーカイブコンテンツ追加エラー、または検索エラーが発生。')
      loggerError_Serverside(req, res, e, 'api/graphqlSearchにてエラー。スクロールボトムのよるアーカイブコンテンツ追加エラー、または検索エラーが発生。')
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

export default graphqlSearch
