import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Default empty config to prevent crash if file is missing
const defaultSecondaryConfig: FirebaseOptions = {
  apiKey: "AIzaSy-placeholder",
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder",
  storageBucket: "placeholder.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000"
};

// We initialize with a placeholder to avoid crashes. 
// Real initialization should happen when the config is available.
const app = initializeApp(defaultSecondaryConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// This flag helps the UI decide whether to show demo mode
export const isFirebaseEnabled = false;
