import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
    apiKey: "AIzaSyCCKw1iPxxNOfutCteexQ3Uk4MLtv_V13U",
    authDomain: "textinput-857ed.firebaseapp.com",
    databaseURL: "https://textinput-857ed-default-rtdb.firebaseio.com",
    projectId: "textinput-857ed",
    storageBucket: "textinput-857ed.appspot.com",
    messagingSenderId: "723300397096",
    appId: "1:723300397096:web:7ff45d7c7a706dfd22851d",
    measurementId: "G-24LGDGW96V"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app)