// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  
import { getAuth } from "firebase/auth";            
import { getAnalytics } from "firebase/analytics";  


const firebaseConfig = {
  apiKey: "AIzaSyCvAxfziu-SumtUS21YmQV3mfKojgoKBSk",
  authDomain: "gamevault-c4cf0.firebaseapp.com",
  projectId: "gamevault-c4cf0",
  storageBucket: "gamevault-c4cf0.appspot.com",
  messagingSenderId: "833893891870",
  appId: "1:833893891870:web:c757f99da0dff624f8d30f",
  measurementId: "G-QLXEFSX7KH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  
const auth = getAuth(app);     
const analytics = getAnalytics(app);

export { app, db, auth };  
