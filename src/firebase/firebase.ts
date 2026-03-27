import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
 apiKey: "AIzaSyCH11RVoGFzx-Qif_Uvx4l6ZDjfF6MzhfY",
  authDomain: "jksalon-14783.firebaseapp.com",
  projectId: "jksalon-14783",
  storageBucket: "jksalon-14783.firebasestorage.app",
  messagingSenderId: "216216306473",
  appId: "1:216216306473:web:a81f3d43d07143ffd46d38"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
