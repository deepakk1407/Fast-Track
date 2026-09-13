import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecto",
    authDomain: "fast-track-6d262.firebaseapp.com",
    projectId: "fast-track-6d262",
    storageBucket: "fast-track-6d262.firebasestorage.app",
    messagingSenderId: "338934873510",
    appId: "1:338934873510:web:16b3211577dd2ce683a367",
    measurementId: "G-9TFBXV2PQM"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// HTML elements

const userName = document.getElementById("userName");
const nameCard = document.getElementById("nameCard");
const emailCard = document.getElementById("emailCard");
const roleCard = document.getElementById("roleCard");
const logoutBtn = document.getElementById("logoutBtn");


// Check login status

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        // User is not logged in
        window.location.href = "index.html";

        return;
    }


    try {

        // Get user data from Firestore

        const userDoc = await getDoc(
            doc(db, "users", user.uid)
        );


        if (userDoc.exists()) {

            const data = userDoc.data();


            // Display user information

            userName.textContent = data.name || "User";

            nameCard.textContent = data.name || "Not available";

            emailCard.textContent = data.email || user.email;

            roleCard.textContent = data.role || "Not available";

        } else {

            userName.textContent = "User";

            nameCard.textContent = "Not available";

            emailCard.textContent = user.email;

            roleCard.textContent = "Not available";

        }


    } catch (error) {

        console.error(
            "Error loading user data:",
            error
        );

        alert(
            "Unable to load your profile."
        );

    }

});


// Logout

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "index.html";

    } catch (error) {

        console.error(error);

        alert("Logout failed. Please try again.");

    }

});
