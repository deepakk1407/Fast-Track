// =====================================================
// FAST-TRACK | Firebase Authentication
// =====================================================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    updateProfile
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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
// INITIALIZE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("🔥 FAST-TRACK Firebase initialized");


// =====================================================
// ELEMENTS
// =====================================================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

const toast = document.getElementById("toast");


// Login
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const rememberMe = document.getElementById("rememberMe");


// Register
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");

const jobSeeker = document.getElementById("jobSeeker");
const recruiter = document.getElementById("recruiter");

const registerPassword =
    document.getElementById("registerPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const terms = document.getElementById("terms");


// Forgot password
const forgotButton =
    document.getElementById("forgotButton");

const forgotModal =
    document.getElementById("forgotModal");

const resetForm =
    document.getElementById("resetForm");

const resetEmail =
    document.getElementById("resetEmail");

const cancelForgot =
    document.getElementById("cancelForgot");


// Google
const loginGoogle =
    document.getElementById("loginGoogle");

const registerGoogle =
    document.getElementById("registerGoogle");


// =====================================================
// TOAST
// =====================================================

function showToast(message, type = "success") {

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;

    toast.classList.remove(
        "show",
        "success",
        "error",
        "warning"
    );

    toast.classList.add(type);
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


// =====================================================
// LOGIN / REGISTER SWITCH
// =====================================================

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


if (loginTab) {
    loginTab.addEventListener("click", showLogin);
}

if (registerTab) {
    registerTab.addEventListener("click", showRegister);
}

if (goRegister) {
    goRegister.addEventListener("click", showRegister);
}

if (goLogin) {
    goLogin.addEventListener("click", showLogin);
}


// =====================================================
// REGISTER
// =====================================================

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        console.log("🔥 REGISTER BUTTON CLICKED");

        const name =
            registerName.value.trim();

        const email =
            registerEmail.value.trim();

        const password =
            registerPassword.value;

        const confirm =
            confirmPassword.value;


        let role = "";

        if (jobSeeker && jobSeeker.checked) {
            role = "Job Seeker";
        }

        if (recruiter && recruiter.checked) {
            role = "Recruiter";
        }


        // Validation

        if (name.length < 2) {

            showToast(
                "Please enter your full name.",
                "error"
            );

            return;
        }


        if (!email) {

            showToast(
                "Please enter your email.",
                "error"
            );

            return;
        }


        if (!role) {

            showToast(
                "Please select your role.",
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


        if (terms && !terms.checked) {

            showToast(
                "Please accept Terms & Conditions.",
                "error"
            );

            return;
        }


        try {

            showToast(
                "Creating your account...",
                "success"
            );


            // Create Firebase account

            const result =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                result.user;


            // Add display name

            await updateProfile(user, {
                displayName: name
            });


            // Save user data

            await setDoc(
                doc(db, "users", user.uid),
                {
                    uid: user.uid,
                    name: name,
                    email: email,
                    role: role,
                    profileCompleted: false,
                    createdAt: serverTimestamp()
                }
            );


            console.log(
                "✅ REGISTER SUCCESS",
                user.uid
            );


            showToast(
                "Account created successfully! 🎉",
                "success"
            );


            registerForm.reset();


            setTimeout(() => {

                showLogin();

                loginEmail.value = email;

                loginPassword.value = "";

            }, 1200);

        }

        catch (error) {

            console.error(
                "❌ REGISTER ERROR:",
                error
            );


            let message =
                "Registration failed.";


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message =
                    "This email is already registered.";

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Invalid email address.";

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message =
                    "Password is too weak.";

            }

            else {

                message =
                    error.message;
            }


            showToast(
                message,
                "error"
            );
        }

    });
}


// =====================================================
// LOGIN
// =====================================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        console.log("🔥 LOGIN BUTTON CLICKED");


        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        if (!email) {

            showToast(
                "Please enter your email.",
                "error"
            );

            return;
        }


        if (!password) {

            showToast(
                "Please enter your password.",
                "error"
            );

            return;
        }


        try {

            showToast(
                "Signing in...",
                "success"
            );


            // Remember me

            if (
                rememberMe &&
                rememberMe.checked
            ) {

                await setPersistence(
                    auth,
                    browserLocalPersistence
                );

            } else {

                await setPersistence(
                    auth,
                    browserSessionPersistence
                );
            }


            // Firebase login

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                result.user;


            console.log(
                "✅ LOGIN SUCCESS",
                user.uid
            );


            // Get Firestore profile

            let profile = {};


            try {

                const userDoc =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        )
                    );


                if (userDoc.exists()) {

                    profile =
                        userDoc.data();
                }

            }

            catch (profileError) {

                console.warn(
                    "Profile fetch error:",
                    profileError
                );
            }


            // Save local user

            localStorage.setItem(
                "fastTrackUser",
                JSON.stringify({

                    uid: user.uid,

                    name:
                        profile.name ||
                        user.displayName ||
                        "",

                    email:
                        user.email,

                    role:
                        profile.role ||
                        ""

                })
            );


            showToast(
                "Login successful! 🚀",
                "success"
            );


            // Dashboard

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 1000);

        }

        catch (error) {

            console.error(
                "❌ LOGIN ERROR:",
                error
            );


            let message =
                "Login failed.";


            switch (error.code) {

                case "auth/invalid-credential":

                    message =
                        "Invalid email or password.";

                    break;


                case "auth/user-not-found":

                    message =
                        "No account found with this email.";

                    break;


                case "auth/wrong-password":

                    message =
                        "Incorrect password.";

                    break;


                case "auth/invalid-email":

                    message =
                        "Invalid email address.";

                    break;


                case "auth/user-disabled":

                    message =
                        "This account has been disabled.";

                    break;


                case "auth/too-many-requests":

                    message =
                        "Too many attempts. Try again later.";

                    break;


                case "auth/network-request-failed":

                    message =
                        "Check your internet connection.";

                    break;


                default:

                    message =
                        error.message ||
                        "Login failed.";
            }


            showToast(
                message,
                "error"
            );
        }

    });
}


// =====================================================
// FORGOT PASSWORD
// =====================================================

if (forgotButton) {

    forgotButton.addEventListener("click", () => {

        if (forgotModal) {

            forgotModal.classList.add("active");

        }

        if (resetEmail && loginEmail) {

            resetEmail.value =
                loginEmail.value.trim();
        }

    });
}


if (cancelForgot) {

    cancelForgot.addEventListener("click", () => {

        if (forgotModal) {

            forgotModal.classList.remove("active");

        }

    });
}


if (resetForm) {

    resetForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email =
            resetEmail.value.trim();


        if (!email) {

            showToast(
                "Enter your email address.",
                "error"
            );

            return;
        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            if (forgotModal) {

                forgotModal.classList.remove(
                    "active"
                );
            }


            showToast(
                "Password reset link sent! 📩",
                "success"
            );

        }

        catch (error) {

            console.error(
                "Reset error:",
                error
            );

            showToast(
                error.message,
                "error"
            );
        }

    });
}


// =====================================================
// GOOGLE LOGIN
// =====================================================

async function googleLogin() {

    try {

        const provider =
            new GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        const result =
            await signInWithPopup(
                auth,
                provider
            );


        const user =
            result.user;


        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const userDoc =
            await getDoc(userRef);


        if (!userDoc.exists()) {

            await setDoc(
                userRef,
                {

                    uid:
                        user.uid,

                    name:
                        user.displayName || "",

                    email:
                        user.email || "",

                    role:
                        "Job Seeker",

                    profileCompleted:
                        false,

                    createdAt:
                        serverTimestamp()
                }
            );
        }


        localStorage.setItem(
            "fastTrackUser",
            JSON.stringify({

                uid:
                    user.uid,

                name:
                    user.displayName || "",

                email:
                    user.email || "",

                role:
                    "Job Seeker"

            })
        );


        showToast(
            "Google login successful! 🚀",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);

    }

    catch (error) {

        console.error(
            "❌ GOOGLE LOGIN ERROR:",
            error
        );


        if (
            error.code ===
            "auth/popup-closed-by-user"
        ) {
            return;
        }


        showToast(
            error.message,
            "error"
        );
    }
}


if (loginGoogle) {

    loginGoogle.addEventListener(
        "click",
        googleLogin
    );
}


if (registerGoogle) {

    registerGoogle.addEventListener(
        "click",
        googleLogin
    );
}


// =====================================================
// READY
// =====================================================

console.log(
    "🚀 FAST-TRACK Authentication Ready"
);
