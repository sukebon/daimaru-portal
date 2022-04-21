import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC6hzvKb1T-wwASV9Cyon8clGmLUgVa-Rk',
  authDomain: 'daimaru-portal.firebaseapp.com',
  projectId: 'daimaru-portal',
  storageBucket: 'daimaru-portal.appspot.com',
  messagingSenderId: '534912969523',
  appId: '1:534912969523:web:0757766f68002ae72e2c46',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
