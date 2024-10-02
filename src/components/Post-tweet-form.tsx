import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const BaseButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #1d9bf0;
  cursor: pointer;
`;

const AttachFileBtn = styled(BaseButton)`
  text-align: center;
  font-weight: 600;
`;

const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled(BaseButton).attrs({ as: "input" })`
  background-color: #1d9bf0;
  color: white;
  border: none;
  font-size: 16px;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size / 1024 < 1000) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        const imgResult = await uploadBytes(locationRef, file);
        const imgUrl = await getDownloadURL(imgResult.ref);
        await updateDoc(doc, {
          img: imgUrl,
        });
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={7}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="Hello"
      />
      <AttachFileBtn htmlFor="file">
        {file ? "Photo added ✅" : "Add Photo"}
      </AttachFileBtn>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}

export default PostTweetForm;
