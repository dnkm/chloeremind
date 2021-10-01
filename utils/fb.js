import firebase from 'firebase'
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOY3VBrSHgCFvyWGOaoitiPPem8ISC6eI",
  authDomain: "new-3361d.firebaseapp.com",
  projectId: "new-3361d",
  storageBucket: "new-3361d.appspot.com",
  messagingSenderId: "420861725551",
  appId: "1:420861725551:web:81f0659f9b585e9c34b69a"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase };