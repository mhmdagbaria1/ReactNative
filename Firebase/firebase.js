import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYxAZHMPfoNCi5qh31_ZUrK6_-l7QC2Qo",
  authDomain: "reactproject-cecb7.firebaseapp.com",
  projectId: "reactproject-cecb7",
  storageBucket: "reactproject-cecb7.appspot.com",
  messagingSenderId: "558555153077",
  appId: "1:558555153077:web:79cc0d41af91526f3374fc",
  measurementId: "G-W9HRMPS2Y4",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };