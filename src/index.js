import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore'

import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDD4XooElkXAbmBZMFoCEmpBmhKGYTvjvA",
  authDomain: "fir-9-project-66d57.firebaseapp.com",
  projectId: "fir-9-project-66d57",
  storageBucket: "fir-9-project-66d57.appspot.com",
  messagingSenderId: "42354614598",
  appId: "1:42354614598:web:ee2da9ce1367632c5b8547"
};

// initializeApp
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref 
const colRef = collection(db, 'books')

// get collection data

// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id })
//     })
//     console.log(books)
//   })
//   .catch(err => console.error(err.message))

// query
// when we query this doc, onSnapshot will work, // Order by
const q = query(colRef, where("author", "==", "khalil"), orderBy("createdAt"))


// realtime collection data
const realtimeCol = onSnapshot(q, (snapshot) => {
  let books = []
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id })
  })
  console.log(books)
})

// adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  }).then((res) => {
    addBookForm.reset()
  }).catch(err => {
    console.log(err.message)
  })
})

// deleting document
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // get the document from db
  const docRef = doc(db, 'books', deleteBookForm.id.value)

  // delete the doc
  deleteDoc(docRef).then((res) => {
    deleteBookForm.reset()
  })
})

// get single document 
const docRef = doc(db, 'books', 'ofBVblVnpS2RsfH1bnYw')
// getDoc(docRef).then((doc) => {
//   console.log(doc.data(),)
// })

// realtime get one doc
const realtimeSingleDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})


// updating a form 
const updateForm = document.querySelector(".update")
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // document reference
  const docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'updated title',
  }).then(() => {
    updateForm.reset()
  })
})

// sign up users
const signupForm = document.querySelector(".signup")
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value
  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    // console.log("user created", cred.user)
    signupForm.reset()
  }).catch(err => {
    console.log(err.message)
  })
})

// login 
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password).then(() => {
    // console.log("user logined ")
  }).catch(err => {
    console.log(err.message)
  })
})

// logout
const logoutBtn = document.querySelector('.logout')
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault()
  signOut(auth).then(() => {
    // console.log("user signout")
  }).catch(err => {
    console.log(err.message)
  })
})

// subscribing to auth changes
const authState = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user)
})

// unsubcribing from changes
const unsubcribeBtn = document.querySelector('.unsubscribe')

unsubcribeBtn.addEventListener('click', (e)=>{
  e.preventDefault()
  console.log('Unsubscribing')
  realtimeCol()
  realtimeSingleDoc
  authState()
})