// Firebase initialization placeholder. Fill with real config when ready.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  appId: 'YOUR_APP_ID'
};

let app;
export function getFirebaseApp(){
  if(!app) app = initializeApp(firebaseConfig);
  return app;
}
export function getFirebaseAuth(){
  return getAuth(getFirebaseApp());
}
