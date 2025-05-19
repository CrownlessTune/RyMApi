
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyBBN-vMDOTdz86uxF1JnCO5OGcR_ccurxc",
  authDomain: "rymapi.firebaseapp.com",
  projectId: "rymapi",
  storageBucket: "rymapi.appspot.com",
  messagingSenderId: "89497614420",
  appId: "1:89497614420:web:xxxxxxxxxxxxxxxx" // <- este aparece junto a los demás datos
}
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 
export const analytics = getAnalytics(app); 