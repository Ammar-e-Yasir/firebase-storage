console.log('connected');

let usernameEl = document.getElementById('username');
let emailEl = document.getElementById('email');
let passwordEl = document.getElementById('password');
let imageInputEl = document.getElementById('user-pic-input');
let storage = firebase.storage();


function register() {
    firebase.auth().createUserWithEmailAndPassword(emailEl.value, passwordEl.value)
        .then((userCredential) => {
            let file = imageInputEl.files[0];
            let userPicRef = storage.ref().child('images/' + file.name);
            userPicRef.put(file)
                .then(() => {
                    userPicRef.getDownloadURL()
                        .then((url) => {

                            let user = userCredential.user;
                            let dataToSave = {
                                email: user.email,
                                username: usernameEl.value,
                                UID: user.uid,
                                userPic: url,
                                userRole: 'donor'
                            }
                            saveUserInFirestore(dataToSave);
                            console.log('User add successfully..!');

                        })
                })






        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(error);
        });
}



function login() {
    firebase.auth().signInWithEmailAndPassword(emailEl.value, passwordEl.value)
        .then((userCredential) => {
            // console.log(userCredential);

            window.location = "./home.html";
            // saveUserInFirestore();
        })
        .catch((error) => {
            console.error(error);
        })

}

// function whoIsUser() {
//     setTimeout(() => {
//         const user = firebase.auth().currentUser;
//         console.log(user, 'inside who is user');
//     }, 3000)
// }
firebase.auth().onAuthStateChanged((user) => {
    console.log(user, '*********************');
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        fetchUsers();
        // ...
    } else {
        // User is signed out
        // ...

    }
});

function signout() {
    firebase.auth().signOut()
        .then(() => {
            window.location = './index.html';
        })

}

function sendPasswordResetEmail() {
    var emailAddress = emailEl.value;
    firebase.auth().sendPasswordResetEmail(emailAddress)
        .then(() => {
            console.log('email sent');
            // Password reset email sent!
            // ..
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(error);
        });
}

let db = firebase.firestore();

function saveUserInFirestore(dataToSave) {

    db.collection('users').doc(dataToSave.UID).set(dataToSave);

}

let userImage = document.getElementById('user-pic-img');

function fetchUsers() {
    let uid = firebase.auth().currentUser.uid;
    // console.log(uid);
    let docRef = db.collection('users').doc(uid);
    docRef.get()
        .then((doc) => {
            if (doc.exists) {
                let user = doc.data();
                userImage.src = user.userPic;
                userImage.className = 'user-pic-img';
                console.log(doc.data(), doc.id);

            } else {
                console.log('No such document');
            }

        })
        .catch((error) => {
            console.log(error);

        })



}











// let storage = firebase.storage();

// let imgEl = document.getElementById('trophy-pic')

// function uploadImage() {
//     let file = document.getElementById('champtrophy').files[0];
//     let imgRef = storage.ref().child('images/' + file.name);
//     imgRef.put(file)
//         .then(() => {
//             imgRef.getDownloadURL()
//                 .then((url) => {
//                     console.log(url);
//                     imgEl.src = url;
//                 })

//         });

// }

// allow read, write: if request.auth != null;