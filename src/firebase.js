import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyDYatIE0jz6zk2RBUDFtu-L0x8juaq221g",
	authDomain: "reacttagram.firebaseapp.com",
	databaseURL: "https://reacttagram.firebaseio.com",
	projectId: "reacttagram",
	storageBucket: "reacttagram.appspot.com",
	messagingSenderId: "694938508744",
	appId: "1:694938508744:web:8eed125a23db72e7a3f4fd",
	measurementId: "G-CJXF20WQVT",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage()

export { db, auth, provider, storage };
