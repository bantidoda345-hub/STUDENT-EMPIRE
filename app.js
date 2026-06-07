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


// 🔥 ADMIN EMAIL (CHANGE THIS)
const ADMIN_EMAIL = "bantidoda345@gmail.com";


// ✅ FIX: SESSION PERSIST (MOST IMPORTANT)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);


// =========================
// 🔵 GOOGLE LOGIN
// =========================
function googleLogin() {

  auth.signInWithPopup(provider)
  .then(async (result) => {

    const user = result.user;

    // Save user in Firestore
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      name: user.displayName.toLowerCase(),
      originalName: user.displayName,
      email: user.email,
      photo: user.photoURL,
      online: true,
      role: user.email === ADMIN_EMAIL ? "admin" : "user",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Save session locally
    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      name: user.displayName,
      email: user.email
    }));

    localStorage.setItem("role", user.email === ADMIN_EMAIL ? "admin" : "user");

    // Redirect
    window.location.href = "home.html";

  })
  .catch((error) => {
    alert(error.message);
  });

}


// =========================
// 🔵 AUTO LOGIN CHECK
// =========================
auth.onAuthStateChanged((user) => {

  if(user){

    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      name: user.displayName,
      email: user.email
    }));

    localStorage.setItem("role", user.email === ADMIN_EMAIL ? "admin" : "user");

    console.log("Logged In:", user.displayName);

  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }

});
