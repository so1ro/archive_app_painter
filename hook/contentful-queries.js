////// Graphql Chrome Extension //////
// URL: https://graphql.contentful.com/content/v1/spaces/ughdotpe40cx
// 下部の HTTP HEADERS に下記追加する。SecretはContentfulのwebhook設定から利用。
// {"Authorization": "Bearer ~~~~~"}

// All Archive
export const limitSkipNum = 30
export const maxImportContent = 5500
// Contentful.ts の foreignRegion に 検索項目 として、下記反映すること
// type.d.tsに Type definition として、下記反映すること
export const query_allArchives =
  `{
    archiveVideosCollection ( order : publishDate_DESC, limit : ${maxImportContent} ) {
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
  }
`

// Archive Dynamic Route Paths
export const query_archiveRoute =
  `{
  archivePathCollection {
    items {
      sys {
        id
      }
      archiveRouteArray
    }
  }
}`

// Top / Hero
export const query_allHeroImg =
  ` {
  topHeroImgsCollection(order : sys_publishedAt_DESC){
    items{
      imageCollection{
        items{
          sys{
            id
              }
                title
                fileName
                url(transform: { quality: 30 })
                width
              }
            }
          }
        }
      }
  `

// Top / Introduction
export const query_topIntro = `{
  topIntroCollection{
    items{
      sys{
        id
      }
      	text
        avatar{
          url
        }
    }
  }
}`

// Top / Shop
export const query_topShop = `{
  topShopCollection{
    items{
      sys{
        id
      }
      productName
      productImage{
        url
      }
      url      
    }
  }
}`

// Archive / Pricing
export const query_archivePricing = `{
  archivePricingCollection {
    items {
      sys {
        id
      }
      message
      content
      functions
      merit
      vimeoId
      explain
      annotation
    }
  }
}`

// Twitter
export const query_twitter = `{
  twitterCollection(order:order_ASC){
    items{
      sys{
        id
      }
      name
      twitterId
      path
      order
    }
  }
}`

//// Instagram ////
export const query_instagram = `{
  instagramCollection(order:order_ASC){
    items{
      sys{
        id
      }
      name
      instagramTopUrl
      order
      avatar {
        url(
          transform: { format:PNG,resizeStrategy: CROP, cornerRadius: -1 })
      }
    }
  }
}`

// How many photos to fetch
const num_photos = 16

export const query_instagram_image_official = `{
  instagramOfficialCollection(limit:${num_photos},order:sys_publishedAt_DESC) {
    items {
      sys {
        id
        publishedAt
      }
      image {
        url
      }
      instagramUrl
    }
  }
}`