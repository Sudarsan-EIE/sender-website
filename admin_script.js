console.log("✅ Script Loaded");

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASE_URL",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID",
    measurementId: "YOUR_FIREBASE_MEASUREMENT_ID"
};

// Initialize Firebase
console.log("✅ Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
console.log("✅ Firebase Initialized!");

let map, marker;

// Function to initialize/update the map
function initMap(lat, lng, placeName = "Tracking Bus") {
    if (!map) {
        map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        marker = L.marker([lat, lng]).addTo(map).bindPopup(`📍 ${placeName}`).openPopup();
    } else {
        map.setView([lat, lng], 13);
        marker.setLatLng([lat, lng]).bindPopup(`📍 ${placeName}`).openPopup();
    }
}

// Function to track bus in real-time
function trackBus() {
    const busName = document.getElementById("busName").value.trim();
    if (busName === "") {
        alert("⚠️ Please enter a bus name!");
        return;
    }

    console.log(`📡 Tracking Bus: ${busName}`);

    onValue(ref(database, `buses/${busName}/location`), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById("status").innerText = `📡 Live Location: Lat ${data.latitude}, Lng ${data.longitude}`;
            initMap(data.latitude, data.longitude, "Bus Location");
        } else {
            document.getElementById("status").innerText = "❌ No location data found!";
        }
    });
}

document.getElementById("trackBusBtn").addEventListener("click", trackBus);
