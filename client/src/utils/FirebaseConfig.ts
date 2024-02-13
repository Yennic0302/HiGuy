// eslint-disable-next-line import/no-extraneous-dependencies
import { initializeApp } from "firebase/app";
// eslint-disable-next-line import/no-extraneous-dependencies
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDS6-39K9P3-n7avYe39vi3Y6HDAtuSC00",
  authDomain: "higuy-d92ec.firebaseapp.com",
  projectId: "higuy-d92ec",
  storageBucket: "higuy-d92ec.appspot.com",
  messagingSenderId: "626851297624",
  appId: "1:626851297624:web:1efe792369a29683e44d2d",
  measurementId: "G-QY3JV9L6QE",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
