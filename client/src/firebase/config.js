// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZUsOEdCRUQlhRo7DvdiHXj8fOg-NEiZM",
  authDomain: "note-app-b160e.firebaseapp.com",
  projectId: "note-app-b160e",
  storageBucket: "note-app-b160e.appspot.com",
  messagingSenderId: "917591702712",
  appId: "1:917591702712:web:775989615d3916b483c84d",
  measurementId: "G-BGY1XHEKF1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
