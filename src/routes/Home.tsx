import styled from "styled-components";
import PostTweetForm from "../components/Post-tweet-form";
import Timeline from "../components/Timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  height: 100vh;
`;

function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}

export default Home;
