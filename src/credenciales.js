// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDACz_m1IdfeNPRS19Nl1uZwi7-2rB0RHM",
  authDomain: "gestion-de-recursos-digitales.firebaseapp.com",
  projectId: "gestion-de-recursos-digitales",
  storageBucket: "gestion-de-recursos-digitales.appspot.com",
  messagingSenderId: "110428097607",
  appId: "1:110428097607:web:f9f5584c737b58a8e7f562",
  measurementId: "G-3Z1XQSB4LR"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default firebaseApp;