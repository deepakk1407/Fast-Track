// =====================================================
// FAST-TRACK - Authentication Script
// Existing index.html compatible
// Firebase Authentication + Firestore
// Professional Popup Notifications
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecto",
    authDomain: "fast-track-6d262.firebaseapp.com",
    projectId: "fast-track-6d262",
    storageBucket: "fast-track-6d262.firebasestorage.app",
    messagingSenderId: "338934873510",
    appId: "1:338934873510:web:16b3211577dd2ce683a367",
    measurementId: "G-9TFBXV2PQM"
};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =====================================================
// ELEMENTS
// =====================================================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const rememberMe = document.getElementById("rememberMe");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

const jobSeeker = document.getElementById("jobSeeker");
const recruiter = document.getElementById("recruiter");

const terms = document.getElementById("terms");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

const forgotButton = document.getElementById("forgotButton");
const forgotModal = document.getElementById("forgotModal");
const resetForm = document.getElementById("resetForm");
const resetEmail = document.getElementById("resetEmail");
const cancelForgot = document.getElementById("cancelForgot");


// =====================================================
// PROFESSIONAL POPUP
// =====================================================

function showPopup(type, title, message) {

    let popup = document.getElementById("fastTrackPopup");

    if (!popup) {

        popup = document.createElement("div");

        popup.id = "fastTrackPopup";

        popup.innerHTML = `
            <div class="ft-popup-box">

                <div class="ft-popup-icon" id="ftPopupIcon">
                    ✓
                </div>

                <div class="ft-popup-content">
                    <div class="ft-popup-title" id="ftPopupTitle">
                        Success
                    </div>

                    <div class="ft-popup-message" id="ftPopupMessage">
                        Operation completed successfully.
                    </div>
                </div>

                <button class="ft-popup-close" id="ftPopupClose">
                    ×
                </button>

                <div class="ft-popup-progress"></div>

            </div>
        `;

        document.body.appendChild(popup);

        const style = document.createElement("style");

        style.textContent = `

            #fastTrackPopup {
                position: fixed;
                top: 25px;
                right: 25px;
                z-index: 99999;
                pointer-events: none;
                opacity: 0;
                transform: translateX(120%);
                transition:
                    opacity .35s ease,
                    transform .35s ease;
            }

            #fastTrackPopup.show {
                opacity: 1;
                transform: translateX(0);
            }

            .ft-popup-box {
                position: relative;
                width: 370px;
                min-height: 90px;
                padding: 18px 45px 18px 18px;

                display: flex;
                align-items: center;
                gap: 15px;

                background: rgba(255,255,255,.97);
                border: 1px solid rgba(0,0,0,.08);
                border-radius: 18px;

                box-shadow:
                    0 20px 50px rgba(0,0,0,.18),
                    0 5px 15px rgba(0,0,0,.08);

                backdrop-filter: blur(15px);

                font-family:
                    Inter,
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    sans-serif;

                overflow: hidden;
            }

            .ft-popup-icon {
                width: 48px;
                height: 48px;
                min-width: 48px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                font-size: 24px;
                font-weight: 800;

                color: white;
                background: #16a34a;

                box-shadow:
                    0 8px 20px rgba(22,163,74,.25);
            }

            .ft-popup-content {
                flex: 1;
            }

            .ft-popup-title {
                font-size: 16px;
                font-weight: 800;
                color: #111827;
                margin-bottom: 4px;
            }

            .ft-popup-message {
                font-size: 13px;
                line-height: 1.45;
                color: #6b7280;
            }

            .ft-popup-close {
                position: absolute;
                top: 10px;
                right: 12px;

                border: none;
                background: transparent;

                font-size: 22px;
                color: #9ca3af;

                cursor: pointer;

                pointer-events: auto;
            }

            .ft-popup-close:hover {
                color: #111827;
            }

            .ft-popup-progress {
                position: absolute;
                bottom: 0;
                left: 0;

                height: 3px;
                width: 100%;

                background: #16a34a;

                animation: ftPopupProgress 4s linear forwards;
            }

            @keyframes ftPopupProgress {
                from {
                    width: 100%;
                }

                to {
                    width: 0%;
                }
            }

            #fastTrackPopup.error .ft-popup-icon {
                background: #dc2626;
                box-shadow:
                    0 8px 20px rgba(220,38,38,.25);
            }

            #fastTrackPopup.error .ft-popup-progress {
                background: #dc2626;
            }

            #fastTrackPopup.warning .ft-popup-icon {
                background: #f59e0b;
                box-shadow:
                    0 8px 20px rgba(245,158,11,.25);
            }

            #fastTrackPopup.warning .ft-popup-progress {
                background: #f59e0b;
            }

            #fastTrackPopup.info .ft-popup-icon {
                background: #2563eb;
                box-shadow:
                    0 8px 20px rgba(37,99,235,.25);
            }

            #fastTrackPopup.info .ft-popup-progress {
                background: #2563eb;
            }

            @media (max-width: 480px) {

                #fastTrackPopup {
                    left: 15px;
                    right: 15px;
                    top: 15px;
                    transform: translateY(-120%);
                }

                #fastTrackPopup.show {
                    transform: translateY(0);
                }

                .ft-popup-box {
                    width: auto;
                }
            }

        `;

        document.head.appendChild(style);

        document
            .getElementById("ftPopupClose")
            .addEventListener("click", hidePopup);
    }

    const icon = document.getElementById("ftPopupIcon");
    const titleElement = document.getElementById("ftPopupTitle");
    const messageElement = document.getElementById("ftPopupMessage");

    popup.className = "";

    if (type === "error") {
        icon.innerHTML = "!";
        popup.classList.add("error");
    }

    else if (type === "warning") {
        icon.innerHTML = "!";
        popup.classList.add("warning");
    }

    else if (type === "info") {
        icon.innerHTML = "i";
        popup.classList.add("info");
    }

    else {
        icon.innerHTML = "✓";
    }

    titleElement.textContent = title;
    messageElement.textContent = message;

    // Restart progress animation
    const progress = popup.querySelector(".ft-popup-progress");

    progress.style.animation = "none";
    progress.offsetHeight;
    progress.style.animation = "ftPopupProgress 4s linear forwards";

    popup.classList.add("show");

    clearTimeout(window.fastTrackPopupTimer);

    window.fastTrackPopupTimer = setTimeout(() => {
        hidePopup();
    }, 4000);
}


function hidePopup() {

    const popup = document.getElementById("fastTrackPopup");

    if (popup) {
        popup.classList.remove("show");
    }
}


// =====================================================
// ERROR MESSAGE HANDLER
// =====================================================

function firebaseError(error) {

    console.log("Firebase Error:", error);

    switch (error.code) {

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/weak-password":
            return "Password must be at least 6 characters.";

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Invalid email or password.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";

        case "auth/user-disabled":
            return "This account has been disabled.";

        default:
            return error.message || "Something went wrong. Please try again.";
    }
}


// =====================================================
// TAB SWITCHING
// =====================================================

function showLogin() {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginBox.style.display = "block";
    registerBox.style.display = "none";
}


function showRegister() {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    loginBox.style.display = "none";
    registerBox.style.display = "block";
}


loginTab.addEventListener("click", showLogin);

registerTab.addEventListener("click", showRegister);

goRegister.addEventListener("click", function (e) {

    e.preventDefault();

    showRegister();
});


goLogin.addEventListener("click", function (e) {

    e.preventDefault();

    showLogin();
});


// =====================================================
// PASSWORD SHOW / HIDE
// =====================================================

function setupPasswordToggle(buttonId, inputId) {

    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) return;

    button.addEventListener("click", function () {

        if (input.type === "password") {

            input.type = "text";

            button.textContent = "🙈";

        } else {

            input.type = "password";

            button.textContent = "👁";
        }
    });
}


setupPasswordToggle("loginEye", "loginPassword");

setupPasswordToggle("registerEye", "registerPassword");

setupPasswordToggle("confirmEye", "confirmPassword");


// =====================================================
// PASSWORD STRENGTH
// =====================================================

registerPassword.addEventListener("input", function () {

    const password = registerPassword.value;

    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    if (!strengthBar || !strengthText) return;

    let strength = 0;

    if (password.length >= 6)
        strength++;

    if (password.length >= 10)
        strength++;

    if (/[A-Z]/.test(password))
        strength++;

    if (/[0-9]/.test(password))
        strength++;

    if (/[^A-Za-z0-9]/.test(password))
        strength++;

    if (password.length === 0) {

        strengthBar.style.width = "0%";
        strengthText.textContent = "";

    } else if (strength <= 2) {

        strengthBar.style.width = "35%";
        strengthText.textContent = "Weak password";

    } else if (strength <= 4) {

        strengthBar.style.width = "70%";
        strengthText.textContent = "Medium password";

    } else {

        strengthBar.style.width = "100%";
        strengthText.textContent = "Strong password";
    }
});


// =====================================================
// REGISTER
// =====================================================

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = confirmPassword.value;

    let role = "";

    if (jobSeeker && jobSeeker.checked) {
        role = "jobseeker";
    }

    if (recruiter && recruiter.checked) {
        role = "recruiter";
    }


    // Validation

    if (!name) {

        showPopup(
            "error",
            "Registration Failed",
            "Please enter your full name."
        );

        registerName.focus();
        return;
    }


    if (!email) {

        showPopup(
            "error",
            "Registration Failed",
            "Please enter your email address."
        );

        registerEmail.focus();
        return;
    }


    if (!role) {

        showPopup(
            "warning",
            "Select Account Type",
            "Please select Job Seeker or Recruiter."
        );

        return;
    }


    if (password.length < 6) {

        showPopup(
            "error",
            "Weak Password",
            "Password must contain at least 6 characters."
        );

        return;
    }


    if (password !== confirm) {

        showPopup(
            "error",
            "Password Mismatch",
            "Password and confirm password do not match."
        );

        return;
    }


    if (terms && !terms.checked) {

        showPopup(
            "warning",
            "Terms Required",
            "Please accept the Terms & Conditions."
        );

        return;
    }


    // Disable button

    const button = registerForm.querySelector("button[type='submit']");

    const originalText = button ? button.textContent : "";

    if (button) {

        button.disabled = true;
        button.textContent = "Creating Account...";
    }


    try {

        // Create Firebase account

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;


        // Save profile

        await setDoc(
            doc(db, "users", user.uid),
            {
                name: name,
                email: email,
                role: role,

                skills: [],
                projects: [],
                certificates: [],

                education: null,

                resumeUploaded: false,

                matchScore: 0,

                createdAt: serverTimestamp()
            }
        );


        showPopup(
            "success",
            "Account Created!",
            "Your FAST-TRACK account has been created successfully."
        );


        registerForm.reset();

        const strengthBar =
            document.getElementById("strengthBar");

        const strengthText =
            document.getElementById("strengthText");

        if (strengthBar)
            strengthBar.style.width = "0%";

        if (strengthText)
            strengthText.textContent = "";


        setTimeout(() => {

            showLogin();

            loginEmail.value = email;

        }, 1200);


    } catch (error) {

        showPopup(
            "error",
            "Registration Failed",
            firebaseError(error)
        );

    } finally {

        if (button) {

            button.disabled = false;
            button.textContent = originalText;
        }
    }

});


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;


    if (!email) {

        showPopup(
            "error",
            "Login Failed",
            "Please enter your email address."
        );

        return;
    }


    if (!password) {

        showPopup(
            "error",
            "Login Failed",
            "Please enter your password."
        );

        return;
    }


    const button = loginForm.querySelector("button[type='submit']");

    const originalText = button ? button.textContent : "";

    if (button) {

        button.disabled = true;
        button.textContent = "Signing In...";
    }


    try {

        // Remember me

        await setPersistence(
            auth,
            rememberMe && rememberMe.checked
                ? browserLocalPersistence
                : browserSessionPersistence
        );


        // Firebase login

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;


        // Get profile

        let profile = null;

        try {

            const profileSnap =
                await getDoc(
                    doc(db, "users", user.uid)
                );

            if (profileSnap.exists()) {

                profile = profileSnap.data();
            }

        } catch (profileError) {

            console.log(
                "Profile fetch error:",
                profileError
            );
        }


        // Store user locally

        localStorage.setItem(
            "fastTrackUser",
            JSON.stringify({
                uid: user.uid,
                name: profile?.name || "User",
                email: user.email,
                role: profile?.role || "jobseeker"
            })
        );


        showPopup(
            "success",
            "Welcome Back!",
            `Login successful. Welcome ${profile?.name || "to FAST-TRACK"}!`
        );


        setTimeout(() => {

            window.locat
