import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:  process.env.REACT_APP_FIREBASE_MESSAGINGSENDER_ID,
    appId:  process.env.REACT_APP_FIREBASE_APP_ID
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