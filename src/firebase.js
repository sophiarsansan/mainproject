// firebase.js
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDHPsJBVplOqIKxcRRPr_LfQSFSuMZ5O00",
    authDomain: "react-mainproject.firebaseapp.com",
    databaseURL: "https://react-mainproject-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "react-mainproject",
    storageBucket: "react-mainproject.appspot.com",
    messagingSenderId: "551409855787",
    appId: "1:551409855787:web:5af60fc123beee0472a96e",
    measurementId: "G-J6BWCMEFHN"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
