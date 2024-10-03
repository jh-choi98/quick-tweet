import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./Tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  img?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const parsedTweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, img } = doc.data();
      //   return { tweet, createdAt, userId, username, img, id: doc.id };
      // });
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const parsedTweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, img } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            img,
            id: doc.id,
          };
        });
        setTweets(parsedTweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}

export default Timeline;

/* 
getDocs vs onSnapshot
- getDocs를 사용하면 데이터를 한 번만 가져온다. 따라서, 그 이후에 업데이트되는 내용은 반영하지 않는다.
- onSnapshot을 사용하면 Firestore의 실시간 변화를 계속해서 모니터링할 수 있다. 데이터가 추가, 삭제, 수정될 때마다
  자동으로 업데이트된다.

unsubscribe는 Firebase에서 실시간 데이터 구독을 관리하는 함수. 이 함수는 Firestore에서
데이터의 실시간 변화를 감지하고, 구독을 해제할 수 있게 해준다.
Firestore에서 onSnapshot 함수는 지정된 쿼리에 대한 실시간 업데이트를 받는 함수.
하지만, 이런 실시간 구독을 해제하지 않으면 컴포넌트가 더이상 필요 없을 때에도 동작한다.
이를 방지하기 위해 구독 해제 기능이 필요하다.
unsubscribe는 실시간으로 Firestore에서 데이터를 받기 위해 설정된 구독을 취소하는 함수.
이 함수는 onSnapshot을 호출할 때 반환된다.

onSnapshot을 호출하면, Firestore는 해당 쿼리에 대한 실시간 구독을 시작한다. 이때, Firesotre는
데이터를 구독할 수 있는 리스너를 추가하는데, 데이터가 변경될 때마다 이 리스너가 호출된다. onSnapshot이 
반환하는 값은 이 리스너를 제거하는 함수(unsubscribe)이다. 

useEffect훅과 함께 사용하여 컴포넌트가 언마운트될 때, 자동으로 실행되는 cleanup function으로 
구독을 해제한다.
return () => {
      unsubscribe && unsubscribe();
};

*/
