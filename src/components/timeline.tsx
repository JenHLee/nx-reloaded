import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

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
  width: 100%;
  flex-direction: column;
  overflow-y: auto;
`;

export default function timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  // useEffect with empty dependency array to run once on mount
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25),
      );
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
      });
    };
    fetchTweets();
    // clean up when it's unmounted (user is not seeing this component) // tear down or clean up function is able to be used.
    // When useEffect or this timeline.tsx component is not used -> call this function. (i.e. user loged out, user in other pages)
    // to save the money for firebase
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []); // Empty array ensures it runs only on mount

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} /> // Passing tweet data to Tweet component
      ))}
    </Wrapper>
  );
}
