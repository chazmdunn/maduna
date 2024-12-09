import axios from "axios";
import { TrendsData, Tags, TweetsData } from "./types";

const options = {
  method: "GET",
  url: "https://twitter241.p.rapidapi.com/search-v2",
  params: {
    type: "Top",
    count: "100",
    query: "#InternetComputer #ICP #WorldComputer",
  },
  headers: {
    "x-rapidapi-host": "twitter241.p.rapidapi.com",
    "x-rapidapi-key": "5bbbdeb4b3msh3726a295b073007p10d615jsn310abee0c63d", // Your RapidAPI key
  },
};

export const getTweets = async () => {
  // check if the data was fetched in the last 5 hours
  const lastFetched = localStorage.getItem("tweetsDate");
  if (
    lastFetched &&
    new Date().getTime() - parseInt(lastFetched) < 5 * 60 * 60 * 1000
  ) {
    return extractTweetsFields(JSON.parse(localStorage.getItem("tweets")));
  }
  try {
    const response = await axios.request(options);
    localStorage.setItem("tweets", JSON.stringify(response.data));
    localStorage.setItem("tweetsDate", new Date().getTime().toString());
    return extractTweetsFields(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const extractTweetsFields = (tweetsOject: any) => {
  let tweets: TweetsData[] = [];
  const usersModule =
    tweetsOject.result.timeline.instructions[0].entries[0].content.items;
  const tweetsModules =
    tweetsOject.result.timeline.instructions[0].entries.slice(1);
  const data2 = extractUsersModule(usersModule);
  const data1 = extractTweetsModule(tweetsModules);
  tweets = [...data1, ...data2];
  return tweets;
};

const extractUsersModule = (items: any) => {
  let tweets: TweetsData[] = [];
  items.forEach((item: any) => {
    tweets.push({
      value: item.item.itemContent.user_results.result.legacy.description,
      created_at: item.item.itemContent.user_results.result.legacy.created_at,
    });
  });
  return tweets;
};

const extractTweetsModule = (items: any) => {
  let tweets: TweetsData[] = [];
  items.forEach((item: any) => {
    tweets.push({
      value:
        item.content.itemContent?.tweet_results.result.legacy.full_text || "",
      created_at:
        item.content.itemContent?.tweet_results.result.legacy.created_at || "",
    });
    tweets.push({
      value:
        item.content.itemContent?.tweet_results.result.core.user_results.result
          .legacy.description || "",
      created_at:
        item.content.itemContent?.tweet_results.result.core.user_results.result
          .legacy.created_at || "",
    });
  });
  return tweets;
};

export const getHashtagsWithPopularity = (data: TweetsData[]): Tags[] => {
  const tagMap: Record<string, number> = {};

  data.forEach((tweet) => {
    const hashtags = tweet.value.match(/#\w+/g);
    if (hashtags) {
      hashtags.forEach((tag) => {
        const normalizedTag = tag.toUpperCase();
        tagMap[normalizedTag] = (tagMap[normalizedTag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagMap).map(([name, popularity]) => ({
    name,
    popularity,
  }));
};


export const convertToBubbleData = (tags: Tags[]): TrendsData[] => {
  const minPopularity = Math.min(...tags.map(tag => tag.popularity));
  const maxPopularity = Math.max(...tags.map(tag => tag.popularity));

  const normalizeScale = (popularity: number) => {
    if (minPopularity === maxPopularity) return 1;
    return ((popularity - minPopularity) / (maxPopularity - minPopularity)) * 4 + 1; 
  };


  const generateColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;


  return tags.map(tag => ({
    name: tag.name,
    scale: normalizeScale(tag.popularity),
    color: generateColor(),
  }));
}