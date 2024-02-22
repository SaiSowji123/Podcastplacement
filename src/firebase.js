// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtnYEnq322Q1o7a2-r-qMChbLxqD0i7gM",
  authDomain: "podcast-mp.firebaseapp.com",
  projectId: "podcast-mp",
  storageBucket: "podcast-mp.appspot.com",
  messagingSenderId: "23922851283",
  appId: "1:23922851283:web:67397dcf00ccf28e730326",
  measurementId: "G-SXB0G4RM2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, storage };