const playListId = process.env.YOUTUBE_PLAYLISTID
const accessToken = process.env.YOUTUBE_ACCESS_TOKEN
const fields = 'id,media_type,media_url,owner,timestamp,permalink,like_count,comments_count,caption'
const limit = 36

// 以下を参照。将来の仕様変更に備え、作家さまにAPIキーを取得し提供してもらうこと
// https://mamewaza.com/support/blog/get-youtube-videoid-list.html
// 1. ”PlaylistId” をAPIキーとチャンネルIDから取得
// 2. それらを使って、GETリクエスト

export async function fetchYouTube() {
    // add a try / catch loop for nicer error handling
    try {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playListId}&maxResults=${limit}&key=${accessToken}`
        )
        const { items } = await res.json();
        return items;
    } catch (e) {
        // add a descriptive error message first,
        // so we know which GraphQL query caused the issue
        console.error(`There was a problem retrieving entries from YouTube`);
        console.error(e);
    }
}
