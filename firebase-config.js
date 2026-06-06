const firebaseConfig = {
  apiKey: "AIzaSyBL9NlJqnueA_-5a78H9pwWpjMkWenq7YE",
  authDomain: "student-empires.firebaseapp.com",
  projectId: "student-empires",
  storageBucket: "student-empires.firebasestorage.app",
  messagingSenderId: "509106125707",
  appId: "1:509106125707:web:9b79f87b9a9f0fa71b8d8e",
  measurementId: "G-ETHZNFTT7S"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
