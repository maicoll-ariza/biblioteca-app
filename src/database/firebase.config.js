import app from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrfgpm2cXNsdXyE0tQutZ1mvbBl3hGUDQ",
  authDomain: "biblioteca-app-f20cd.firebaseapp.com",
  projectId: "biblioteca-app-f20cd",
  storageBucket: "biblioteca-app-f20cd.appspot.com",
  messagingSenderId: "798091211708",
  appId: "1:798091211708:web:d54f1fa73f3645ecaa31b9"
};

// Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = app.auth()
const storage = app.storage()

export { db, auth, storage }