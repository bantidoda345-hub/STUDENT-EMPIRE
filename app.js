const provider = new firebase.auth.GoogleAuthProvider();

function googleLogin(){

auth.signInWithPopup(provider)

.then(async(result)=>{

const user = result.user;

await db.collection("users")
.doc(user.uid)
.set({

uid:user.uid,
name:user.displayName,
email:user.email,
photo:user.photoURL,
online:true,
createdAt:
firebase.firestore.FieldValue.serverTimestamp()

},{merge:true});

alert("Welcome " + user.displayName);

loadUsers();
loadRequests();

})

.catch(error=>{

alert(error.message);

});

}

function logout(){

auth.signOut()
.then(()=>{

location.reload();

});

}

async function loadUsers(){

const currentUser = auth.currentUser;

const usersList =
document.getElementById("usersList");

if(!usersList) return;

usersList.innerHTML = "";

const snapshot =
await db.collection("users").get();

snapshot.forEach(doc=>{

const user = doc.data();

if(user.uid !== currentUser.uid){

usersList.innerHTML += `

<div class="user">

<img
src="${user.photo}"
width="45"
height="45"
style="
border-radius:50%;
margin-right:10px;
">

<div>

<b>${user.name}</b><br>

<small>${user.email}</small>

</div>

<button
class="add-btn"
onclick="sendFriendRequest('${user.uid}')">

Add

</button>

</div>

`;

}

});

}

async function sendFriendRequest(receiverId){

const sender = auth.currentUser;

const requestId =
sender.uid + "_" + receiverId;

await db.collection("friendRequests")
.doc(requestId)
.set({

senderId:sender.uid,
senderName:sender.displayName,

receiverId:receiverId,

status:"pending",

createdAt:
firebase.firestore.FieldValue.serverTimestamp()

});

alert("Friend Request Sent");

}

async function loadRequests(){

const currentUser =
auth.currentUser;

const snapshot = await db
.collection("friendRequests")
.where("receiverId","==",currentUser.uid)
.where("status","==","pending")
.get();

snapshot.forEach(doc=>{

const req = doc.data();

document.getElementById("usersList")
.innerHTML += `

<div class="user">

<div>

<b>${req.senderName}</b><br>

<small>Friend Request</small>

</div>

<button
class="add-btn"
onclick="acceptRequest('${doc.id}','${req.senderId}')">

Accept

</button>

</div>

`;

});

}

async function acceptRequest(
requestId,
senderId
){

const currentUser =
auth.currentUser;

await db.collection("friends")
.add({

user1:senderId,
user2:currentUser.uid,

createdAt:
firebase.firestore.FieldValue.serverTimestamp()

});

await db.collection("friendRequests")
.doc(requestId)
.update({

status:"accepted"

});

alert("Friend Added");

loadUsers();

}

auth.onAuthStateChanged(async(user)=>{

if(user){

document.querySelector(".welcome")
.innerHTML = `

<img
src="${user.photoURL}"
style="
width:100px;
height:100px;
border-radius:50%;
">

<h2>
${user.displayName}
</h2>

<p>
${user.email}
</p>

<button
class="login-btn"
onclick="logout()">

Logout

</button>

`;

loadUsers();

loadRequests();

}

});
