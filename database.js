import firebase from 'firebase/app'
import "firebase/database"


  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCcM08_eUc8GzBpJ3j19__3h6VDwZi1nwU",
    authDomain: "idagdb.firebaseapp.com",
    databaseURL: "https://idagdb.firebaseio.com",
    projectId: "idagdb",
    storageBucket: "idagdb.appspot.com",
    messagingSenderId: "969158868158"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
  export const connectedRef = firebase.database().ref(".info/connected");
  connectedRef.on('value', (snap) => {
      (snap.val() === true ? console.log("connected") : console.log("not connected"))
  })

 