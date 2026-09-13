import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* ===============================
   FIREBASE
================================ */

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


/* ===============================
   LOGIN / REGISTER TABS
================================ */

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


/* ===============================
   PASSWORD SHOW / HIDE
================================ */

const loginPassword = document.getElementById("loginPassword");
const loginEye = document.getElementById("loginEye");

if (loginEye && loginPassword) {

    loginEye.addEventListener("click", () => {

        if (loginPassword.type === "password") {

            loginPassword.type = "text";
            loginEye.textContent = "🙈";

        } else {

            loginPassword.type = "password";
            loginEye.textContent = "👁️";

        }

    });

}


/* ===============================
   REGISTER PASSWORD SHOW / HIDE
================================ */

const registerPassword =
    document.getElementById("registerPassword");

const registerEye =
    document.getElementById("registerEye");

if (registerEye && registerPassword) {

    registerEye.addEventListener("click", () => {

        if (registerPassword.type === "password") {

            registerPassword.type = "text";
            registerEye.textContent = "🙈";

        } else {

            registerPassword.type = "password";
            registerEye.textContent = "👁️";

        }

    });

}


/* ===============================
   CONFIRM PASSWORD SHOW / HIDE
================================ */

const confirmPassword =
    document.getElementById("confirmPassword");

const confirmEye =
    document.getElementById("confirmEye");

if (confirmEye && confirmPassword) {

    confirmEye.addEventListener("click", () => {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";
            confirmEye.textContent = "🙈";

        } else {

            confirmPassword.type = "password";
            confirmEye.textContent = "👁️";

        }

    });

}


/* ===============================
   REGISTER
================================ */

const registerForm =
    document.getElementById("registerForm");


registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const role =
        document.querySelector(
            'input[name="role"]:checked'
        )?.value;

    const password =
        document.getElementById("registerPassword").value;

    const confirmPasswordValue =
        document.getElementById("confirmPassword").value;


    if (password !== confirmPasswordValue) {

        alert("Passwords do not match!");

        return;
    }


    if (!role) {

        alert("Please select your role.");

        return;
    }


    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = userCredential.user;


        await setDoc(
            doc(db, "users", user.uid),
            {
                name: name,
                email: email,
                role: role,
                createdAt: serverTimestamp()
            }
        );


        console.log(
            "User created:",
            user.uid
        );


        alert("🎉 Account created successfully!");


        registerForm.reset();


        registerTab.classList.remove("active");

        loginTab.classList.add("active");

        registerBox.classList.remove("active");

        loginBox.classList.add("active");


    } catch (error) {

        console.error(error);


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            alert(
                "This email is already registered."
            );

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            alert(
                "Please enter a valid email."
            );

        }

        else if (
            error.code ===
            "auth/weak-password"
        ) {

            alert(
                "Password should be at least 6 characters."
            );

        }

        else {

            alert(
                "Registration failed. Please try again."
            );

        }

    }

});


/* ===============================
   LOGIN
================================ */

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;
    const rememberMe =
    document.getElementById("rememberMe");


    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = userCredential.user;


        console.log(
            "Login successful:",
            user.uid
        );


        alert("✅ Login successful!");


        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);


        if (
            error.code ===
                "auth/invalid-credential" ||

            error.code ===
                "auth/wrong-password" ||

            error.code ===
                "auth/user-not-found"
        ) {

            alert(
                "❌ Invalid email or password."
            );

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            alert(
                "Please enter a valid email."
            );

        }

        else {

            alert(
                "Login failed. Please try again."
            );

        }

    }

});


/* ===============================
   AUTH SESSION CHECK
================================ */

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log(
            "User is logged in:",
            user.email
        );

    } else {

        console.log(
            "No user is logged in."
        );

    }

});
