import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCcjvNWZLLtCZDXblSXYCYuVXRb8KLZ0_w",
    authDomain: "post-it-9bf3e.firebaseapp.com",
    projectId: "post-it-9bf3e",
    storageBucket: "post-it-9bf3e.appspot.com",
    messagingSenderId: "801965010330",
    appId: "1:801965010330:web:d6ad679df4d6d3c725de23"
};

let app;
if (firebase.getApps().length === 0){
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.getApp();
}

export default app;
export const auth = getAuth();
export const projectFireStore = getFirestore();
export const projectStorage = getStorage()