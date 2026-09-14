import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecta",
    authDomain: "fast-track-6d262.firebaseapp.com",
    projectId: "fast-track-6d262",
    storageBucket: "fast-track-6d262.firebasestorage.app",
    messagingSenderId: "338934873510",
    appId: "1:338934873510:web:16b3211577dd2ce683a367",
    measurementId: "G-9TFBXV2PQM"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* =========================
   ELEMENTS
========================= */

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

const registerForm =
    document.getElementById("registerForm");

const registerButton =
    document.getElementById("registerButton");

const registerName =
    document.getElementById("registerName");

const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const terms =
    document.getElementById("terms");

const toast =
    document.getElementById("toast");


/* =========================
   TOAST
========================= */

function showToast(message, type = "success") {

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;

    toast.style.background =
        type === "error"
            ? "#dc2626"
            : "#111827";

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}


/* =========================
   TAB SWITCHING
========================= */

function showLogin() {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginBox.classList.add("active");
    registerBox.classList.remove("active");
}


function showRegister() {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerBox.classList.add("active");
    loginBox.classList.remove("active");
}


loginTab.addEventListener("click", showLogin);
registerTab.addEventListener("click", showRegister);

goRegister.addEventListener("click", showRegister);
goLogin.addEventListener("click", showLogin);


/* =========================
   REGISTER
========================= */

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        registerName.value.trim();

    const email =
        registerEmail.value.trim();

    const password =
        registerPassword.value;

    const confirm =
        confirmPassword.value;


    /* VALIDATION */

    if (!name) {
        showToast("Please enter your full name.", "error");
        return;
    }


    if (!email) {
        showToast("Please enter your email.", "error");
        return;
    }


    if (password.length < 6) {
        showToast(
            "Password must be at least 6 characters.",
            "error"
        );
        return;
    }


    if (password !== confirm) {
        showToast(
            "Passwords do not match.",
            "error"
        );
        return;
    }


    if (!terms.checked) {
        showToast(
            "Please accept Terms & Conditions.",
            "error"
        );
        return;
    }


    /* DISABLE BUTTON */

    registerButton.disabled = true;

    registerButton.textContent =
        "Creating Account...";


    try {

        /* CREATE FIREBASE ACCOUNT */

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = result.user;


        /* SAVE USER NAME */

        await updateProfile(user, {
            displayName: name
        });


        console.log(
            "REGISTER SUCCESS:",
            user
        );


        showToast(
            "🎉 Account created successfully!"
        );


        /* RESET FORM */

        registerForm.reset();


        /* RETURN TO LOGIN */

        setTimeout(() => {
            showLogin();
        }, 1500);


    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );


        let message =
            "Registration failed.";


        if (error.code ===
            "auth/email-already-in-use") {

            message =
                "This email is already registered.";

        } else if (error.code ===
            "auth/invalid-email") {

            message =
                "Please enter a valid email.";

        } else if (error.code ===
            "auth/weak-password") {

            message =
                "Password is too weak.";

        }


        showToast(
            message,
            "error"
        );


    } finally {

        registerButton.disabled = false;

        registerButton.textContent =
            "Create Account";

    }

});
