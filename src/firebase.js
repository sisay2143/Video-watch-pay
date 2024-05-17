import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAF1az1UCK2jPHEMoWj8NWLaQIZ4yDx_ag",
  authDomain: "miniproject-25ae5.firebaseapp.com",
  projectId: "miniproject-25ae5",
  storageBucket: "miniproject-25ae5.appspot.com",
  messagingSenderId: "669755928350",
  appId: "1:669755928350:web:bf581749ce08c2c5a3a30f",
  measurementId: "G-G6671504C3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export { ref, listAll, getStorage, getDownloadURL };