// Twitter API client — fetches ALL posts from a user for a date range
// Uses twitter241 via RapidAPI

const RAPIDAPI_KEY = "3afa996a44msh75da4ed59b13bddp131341jsnef7c1836d5a9";
const RAPIDAPI_HOST = "twitter241.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

const headers = () => ({
  "Content-Type": "application/json",
  "x-rapidapi-host": RAPIDAPI_HOST,
  "x-rapidapi-key": RAPIDAPI_KEY,
});

// Fixed list of profiles — these are the only ones we fetch
export const TWITTER_PROFILES = [
  { handle: "Satoukibijusu", name: "Satoukibijusu" },
  { handle: "debinvest", name: "DebInvest" },
  { handle: "ParaBuilders", name: "ParaBuilders" },
  { handle: "zenderman100", name: "Zenderman" },
  { handle: "0x_Drocacoin", name: "Drocacoin" },
  { handle: "pepeusavant", name: "Pepeu Savant" },
  { handle: "GustavoNenesk", name: "Gustavo Nenesk" },
  { handle: "Milca0_", name: "MilcaO" },
  { handle: "RatazanaGold", name: "Ratazana Gold" },
  { handle: "notaboutdollar", name: "Dollar" },
  { handle: "0xCokinha", name: "Cokinha" },
  { handle: "zillinft", name: "Zilli NFT" },
];

export interface TweetData {
  id: string;
  text: string;
  created_at: string;
  views: number;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  bookmarks: number;
  url: string;
  author: string;
}

export interface CreatorTweetData {
  handle: string;
  name: string;
  tweets: TweetData[];
  totalViews: number;
  totalLikes: number;
  totalRetweets: number;
  totalReplies: number;
  error?: string;
}

const getFullText = (tweetResult: any): string => {
  const noteText = tweetResult?.note_tweet?.note_tweet_results?.result?.text;
  if (noteText) return noteText;
  return tweetResult?.legacy?.full_text || "";
};

const parseTweetEntry = (entry: any, handle: string): TweetData | null => {
  try {
    const content = entry?.content;
    if (!content || content.__typename === "TimelineTimelineCursor") return null;

    let tweetResult = content?.itemContent?.tweet_results?.result;
    if (!tweetResult) return null;
    if (tweetResult.__typename === "TweetTombstone") return null;
    if (tweetResult.__typename === "TweetWithVisibilityResults" && tweetResult.tweet) {
      tweetResult = tweetResult.tweet;
    }

    const legacy = tweetResult.legacy;
    if (!legacy) return null;

    const fullText = getFullText(tweetResult);
    const id = legacy.id_str || tweetResult.rest_id || "";
    if (!id) return null;

    const viewsRaw = tweetResult.views?.count;
    const views = viewsRaw ? parseInt(String(viewsRaw), 10) : 0;

    return {
      id,
      text: fullText,
      created_at: legacy.created_at || "",
      views: isNaN(views) ? 0 : views,
      likes: legacy.favorite_count ?? 0,
      retweets: legacy.retweet_count ?? 0,
      replies: legacy.reply_count ?? 0,
      quotes: legacy.quote_count ?? 0,
      bookmarks: legacy.bookmark_count ?? 0,
      url: `https://x.com/${handle}/status/${id}`,
      author: handle,
    };
  } catch {
    return null;
  }
};

export const fetchUserTweets = async (
  username: string,
  sinceDate: string,
  untilDate: string
): Promise<TweetData[]> => {
  const cleanHandle = username.replace("@", "");
  const query = `from:${cleanHandle} since:${sinceDate} until:${untilDate} -filter:replies`;

  const response = await fetch(
    `${BASE_URL}/search?query=${encodeURIComponent(query)}&count=100&type=Latest`,
    { method: "GET", headers: headers() }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  if (data.status !== "ok") {
    throw new Error(`API returned status: ${data.status}`);
  }

  const instructions = data?.result?.timeline?.instructions || [];
  const tweets: TweetData[] = [];
  const seen = new Set<string>();

  for (const instruction of instructions) {
    const entries = instruction?.entries || [];
    for (const entry of entries) {
      const parsed = parseTweetEntry(entry, cleanHandle);
      if (parsed && !seen.has(parsed.id)) {
        seen.add(parsed.id);
        tweets.push(parsed);
      }
    }
  }

  tweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  console.log(`@${cleanHandle}: ${tweets.length} posts`);
  return tweets;
};
