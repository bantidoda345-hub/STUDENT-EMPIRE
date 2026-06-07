// Firebase Config

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

const provider = new firebase.auth.GoogleAuthProvider();


// Google Login

function googleLogin() {

auth.signInWithPopup(provider)

.then(async (result) => {

const user = result.user;

await db.collection("users")
.doc(user.uid)
.set({
uid: user.uid,
name: user.displayName,
email: user.email,
photo: user.photoURL,
createdAt: firebase.firestore.FieldValue.serverTimestamp()
}, { merge:true });

window.location.href = "home.html";

})

.catch((error) => {
alert(error.message);
});

}


// Auto Login Check

auth.onAuthStateChanged((user) => {

if(user){

console.log("Logged In:", user.displayName);

}

});
