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
} from 'firebase/firestore'

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
// when we query this doc, onSnapshot will work
const q = query(colRef, where("author", "==", "khalil"))


// realtime collection data
onSnapshot(q, (snapshot) => {
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
    author: addBookForm.author.value
  }).then((res) => {
    addBookForm.reset()
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

