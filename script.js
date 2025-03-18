document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Script Loaded");

    const signupBtn = document.getElementById("signupBtn");
    const loginBtn = document.getElementById("loginBtn");
    const sendLocationBtn = document.getElementById("sendLocationBtn");
    const showLogin = document.getElementById("showLogin");
    
    signupBtn.addEventListener("click", handleSignup);
    loginBtn.addEventListener("click", handleLogin);
    showLogin.addEventListener("click", showLoginPage);
    sendLocationBtn.addEventListener("click", sendLocation);
    
    let map, marker;
    
    function initMap(lat, lng, placeName = "Tracking Bus") {
        if (!map) {
            map = L.map('map').setView([lat, lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        }
        if (!marker) {
            marker = L.marker([lat, lng]).addTo(map).bindPopup(`📍 ${placeName}`).openPopup();
        } else {
            marker.setLatLng([lat, lng]).bindPopup(`📍 ${placeName}`).openPopup();
        }
    }

    function getPlaceName(lat, lng) {
        return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(response => response.json())
            .then(data => data.display_name || "Unknown Location")
            .catch(() => "Unknown Location");
    }

    function sendLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const placeName = await getPlaceName(lat, lng);
                document.getElementById("status").innerText = `📍 ${placeName} (Lat: ${lat}, Lng: ${lng})`;
                initMap(lat, lng, placeName);
            });
        }
    }

    function showLoginPage() {
        document.getElementById("signupPage").style.display = "none";
        document.getElementById("loginPage").style.display = "block";
    }

    function handleSignup() {
        alert("Signup successful! Please log in.");
        showLoginPage();
    }

    function handleLogin() {
        alert("Login successful!");
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("busPage").style.display = "block";
    }
});
