import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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


/* =========================
   INITIALIZE FIREBASE
========================= */

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

const registerForm = document.getElementById("registerForm");

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
    }, 5000);
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
   REGISTER ACCOUNT
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


    /* =========================
       VALIDATION
    ========================= */

    if (name === "") {

        showToast(
            "Please enter your full name.",
            "error"
        );

        return;
    }


    if (email === "") {

        showToast(
            "Please enter your email.",
            "error"
        );

        return;
    }


    if (password.length < 6) {

        showToast(
            "Password must contain at least 6 characters.",
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


    /* =========================
       CREATE ACCOUNT
    ========================= */

    registerButton.disabled = true;

    registerButton.textContent =
        "Creating Account...";


    try {

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            result.user;


        /* =========================
           SAVE USER NAME
        ========================= */

        await updateProfile(user, {
            displayName: name
        });


        console.log(
            "ACCOUNT CREATED:",
            user
        );


        showToast(
            "🎉 Account created successfully!"
        );


        registerForm.reset();


        /* =========================
           GO TO LOGIN
        ========================= */

        setTimeout(() => {

            showLogin();

        }, 1500);


    } catch (error) {

        console.error(
            "FIREBASE ERROR:",
            error
        );


        /* SHOW EXACT FIREBASE ERROR */

        const code =
            error.code || "unknown-error";

        const message =
            error.message || "Unknown error";


        showToast(
            code + " | " + message,
            "error"
        );


    } finally {

        registerButton.disabled = false;

        registerButton.textContent =
            "Create Account";
    }

});
