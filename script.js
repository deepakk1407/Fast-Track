import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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


// ===============================
// LOGIN / REGISTER TABS
// ===============================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

registerTab.addEventListener("click", () => {
    loginTab.classList.remove("active");
    registerTab.classList.add("active");

    loginBox.classList.remove("active");
    registerBox.classList.add("active");
});

loginTab.addEventListener("click", () => {
    registerTab.classList.remove("active");
    loginTab.classList.add("active");

    registerBox.classList.remove("active");
    loginBox.classList.add("active");
});


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        console.log("User created:", userCredential.user);

        alert("🎉 Account created successfully!");

        registerForm.reset();

        // Go back to Login
        registerTab.classList.remove("active");
        loginTab.classList.add("active");

        registerBox.classList.remove("active");
        loginBox.classList.add("active");

    } catch (error) {

        console.error(error);

        if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered.");
        }
        else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email.");
        }
        else if (error.code === "auth/weak-password") {
            alert("Password should be at least 6 characters.");
        }
        else {
            alert("Registration failed. Please try again.");
        }
    }
});
