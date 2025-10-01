// Firebase initialization using environment variables with fallbacks for GitHub Pages.
// Replace fallback strings with your real Firebase project settings before deploying.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY || 'YOUR_ACTUAL_API_KEY',
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FB_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FB_SENDER_ID || 'SENDER_ID',
  appId: import.meta.env.VITE_FB_APP_ID || 'APP_ID',
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID || 'MEASUREMENT_ID'
};

let app;
export function getFirebaseApp(){
  if(!app) app = initializeApp(firebaseConfig);
  return app;
}
export const auth = getAuth(getFirebaseApp());
export const db = getFirestore(getFirebaseApp());
