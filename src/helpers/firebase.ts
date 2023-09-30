import App from 'firebase/compat/app';

const firebaseConfig = {
    apiKey: "AIzaSyDw_e1j4pYZ5Ij7KWTQcwGW78IQbvsMd44",
    authDomain: "x-thesnakegame.firebaseapp.com",
    projectId: "x-thesnakegame",
    storageBucket: "x-thesnakegame.appspot.com",
    messagingSenderId: "447959547810",
    appId: "1:447959547810:web:24b0776d0263abde0cbcfb"
  };

// Initialize Firebase
export const fireApp = App.initializeApp(firebaseConfig);
