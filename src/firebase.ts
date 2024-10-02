import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVQc322xsmfbSEs2tv22UEXvLuh-c7A38",
  authDomain: "quick-tweet-b902a.firebaseapp.com",
  projectId: "quick-tweet-b902a",
  storageBucket: "quick-tweet-b902a.appspot.com",
  messagingSenderId: "257278941862",
  appId: "1:257278941862:web:00e099ae381943af377267",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
