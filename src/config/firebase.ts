// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_APP_APIKEY,
  authDomain: env.VITE_APP_AUTHDOMAIN,
  projectId: env.VITE_APP_PROJECTID,
  storageBucket: env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: env.VITE_APP_MESSAGINGSENDERID,
  appId: env.VITE_APP_APPID,
  measurementId: env.VITE_APP_MEASUREMENTID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
