import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  initializeAppCheck, 
  ReCaptchaV3Provider 
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_API_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_API_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_API_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_API_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_API_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const appCheck = () => initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_KEY),
  isTokenAutoRefreshEnabled: true,
});
export const auth = getAuth(app);
export default app;