import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../routes/firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweet(tweets);
  };

  // useEffect with empty dependency array to run once on mount
  useEffect(() => {
    fetchTweets();
  }, []); // Empty array ensures it runs only on mount

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} /> // Passing tweet data to Tweet component
      ))}
    </Wrapper>
  );
}
