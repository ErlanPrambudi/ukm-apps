// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "blog-hima.firebaseapp.com",
    projectId: "blog-hima",
    storageBucket: "blog-hima.appspot.com",
    messagingSenderId: "499214529375",
    appId: "1:499214529375:web:7085191e3ff2a18a6abcea"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);