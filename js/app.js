// /js/app.js
// Firebase initialization (ES module). Imported as <script type="module"> in pages.
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsabftqBfwYKT9wZhsINZXXMcy8MX3THg",
  authDomain: "burble-bb533.firebaseapp.com",
  projectId: "burble-bb533",
  storageBucket: "burble-bb533.firebasestorage.app",
  messagingSenderId: "997224317711",
  appId: "1:997224317711:web:80c55ebfceaf23adf4f47a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
