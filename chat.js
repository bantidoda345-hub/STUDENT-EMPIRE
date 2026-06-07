// ================= FIREBASE =================
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let activeChat = null;

// ================= LOGIN =================
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  db.collection("users").doc(user.uid).set({
    uid: user.uid,
    name: user.displayName || "No Name",
    phone: user.phoneNumber || "",
    photo: user.photoURL || ""
  }, { merge: true });

  loadUsers();
  loadRequests();
});

// ================= LOAD USERS =================
function loadUsers(){

  db.collection("users").onSnapshot(snap => {

    let html = "";

    snap.forEach(doc => {

      let u = doc.data();

      if(u.uid !== currentUser.uid){

        html += `
          <div class="user">

            <b>${u.name}</b><br>
            <small>${u.phone || ""}</small><br>

            <button onclick="sendRequest('${u.uid}')">
              Add Friend
            </button>

            <button onclick="openChat('${u.uid}')">
              Chat
            </button>

          </div>
        `;
      }
    });

    document.getElementById("users").innerHTML = html;
  });
}

// ================= FRIEND REQUEST =================
function sendRequest(to){

  db.collection("requests").add({
    from: currentUser.uid,
    to: to,
    status: "pending",
    time: Date.now()
  });

  alert("Friend Request Sent");
}

// ================= LOAD REQUESTS =================
function loadRequests(){

  db.collection("requests")
    .where("to","==",currentUser.uid)
    .where("status","==","pending")
    .onSnapshot(snap => {

      let html = "";

      snap.forEach(doc => {

        let r = doc.data();

        html += `
          <div style="padding:10px;border-bottom:1px solid #333;">

            <p>👤 Friend Request</p>

            <button onclick="acceptReq('${doc.id}','${r.from}')">
              Accept
            </button>

          </div>
        `;
      });

      document.getElementById("requests").innerHTML = html;
    });
}

// ================= ACCEPT REQUEST =================
function acceptReq(id, from){

  db.collection("requests").doc(id).update({
    status: "accepted"
  });

  db.collection("friends").doc(currentUser.uid).set({
    [from]: true
  }, { merge: true });

  db.collection("friends").doc(from).set({
    [currentUser.uid]: true
  }, { merge: true });

  alert("Friend Added");
}

// ================= CHAT ID =================
function chatId(a,b){
  return a > b ? a + "_" + b : b + "_" + a;
}

// ================= OPEN CHAT =================
function openChat(uid){

  activeChat = uid;

  let id = chatId(currentUser.uid, uid);

  db.collection("chats")
    .doc(id)
    .collection("messages")
    .orderBy("time")
    .onSnapshot(snap => {

      let html = "";

      snap.forEach(doc => {

        let m = doc.data();

        html += `
          <div class="msg ${m.sender === currentUser.uid ? 'me' : 'other'}">
            ${m.text}
          </div>
        `;
      });

      document.getElementById("chatBox").innerHTML = html;
    });
}

// ================= SEND MESSAGE =================
function sendMessage(){

  let text = document.getElementById("msg").value;

  if(!text || !activeChat) return;

  let id = chatId(currentUser.uid, activeChat);

  db.collection("chats")
    .doc(id)
    .collection("messages")
    .add({
      text: text,
      sender: currentUser.uid,
      time: Date.now()
    });

  document.getElementById("msg").value = "";
                            }
