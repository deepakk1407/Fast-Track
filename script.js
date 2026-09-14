// =====================================================
// FAST-TRACK | FIREBASE AUTHENTICATION
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
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("🔥 FAST-TRACK Firebase initialized");


// =====================================================
// ELEMENTS
// =====================================================

const $ = id => document.getElementById(id);

const loginTab = $("loginTab");
const registerTab = $("registerTab");

const loginBox = $("loginBox");
const registerBox = $("registerBox");

const loginForm = $("loginForm");
const registerForm = $("registerForm");

const goRegister = $("goRegister");
const goLogin = $("goLogin");

const loginEmail = $("loginEmail");
const loginPassword = $("loginPassword");
const rememberMe = $("rememberMe");

const registerName = $("registerName");
const registerEmail = $("registerEmail");
const jobSeeker = $("jobSeeker");
const recruiter = $("recruiter");
const registerPassword = $("registerPassword");
const confirmPassword = $("confirmPassword");
const terms = $("terms");

const forgotButton = $("forgotButton");
const forgotModal = $("forgotModal");
const resetForm = $("resetForm");
const resetEmail = $("resetEmail");
const cancelForgot = $("cancelForgot");

const loginGoogle = $("loginGoogle");
const registerGoogle = $("registerGoogle");

const loginEye = $("loginEye");
const registerEye = $("registerEye");
const confirmEye = $("confirmEye");

const strengthBar = $("strengthBar");
const strengthText = $("strengthText");

const toast = $("toast");
const toastIcon = $("toastIcon");
const toastTitle = $("toastTitle");
const toastMessage = $("toastMessage");
const toastClose = $("toastClose");


// =====================================================
// PROFESSIONAL TOAST
// =====================================================

let toastTimer;

function showToast(message, type = "success", title = "") {

    if (!toast) {
        console.log(message);
        return;
    }

    clearTimeout(toastTimer);

    const titles = {
        success: "Success",
        error: "Something went wrong",
        warning: "Attention",
        loading: "Please wait"
    };

    const icons = {
        success: "✓",
        error: "!",
        warning: "!",
        loading: "..."
    };

    toastIcon.textContent = icons[type] || "✓";
    toastTitle.textContent = title || titles[type] || "Notification";
    toastMessage.textContent = message;

    toast.classList.remove(
        "success",
        "error",
        "warning",
        "loading",
        "show"
    );

    toast.classList.add(type);
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}


if (toastClose) {
    toastClose.addEventListener("click", () => {
        toast.classList.remove("show");
    });
}


// =====================================================
// SWITCH LOGIN / REGISTER
// =====================================================

function showLogin() {

    loginTab?.classList.add("active");
    registerTab?.classList.remove("active");

    loginBox?.classList.add("active");
    registerBox?.classList.remove("active");
}


function showRegister() {

    registerTab?.classList.add("active");
    loginTab?.classList.remove("active");

    registerBox?.classList.add("active");
    loginBox?.classList.remove("active");
}


loginTab?.addEventListener("click", showLogin);
registerTab?.addEventListener("click", showRegister);
goRegister?.addEventListener("click", showRegister);
goLogin?.addEventListener("click", showLogin);


// =====================================================
// PASSWORD SHOW / HIDE
// =====================================================

function togglePassword(input, eye) {

    if (!input || !eye) return;

    eye.addEventListener("click", () => {

        if (input.type === "password") {
            input.type = "text";
            eye.textContent = "🙈";
        } else {
            input.type = "password";
            eye.textContent = "👁";
        }

    });
}


togglePassword(loginPassword, loginEye);
togglePassword(registerPassword, registerEye);
togglePassword(confirmPassword, confirmEye);


// =====================================================
// PASSWORD STRENGTH
// =====================================================

registerPassword?.addEventListener("input", () => {

    const password = registerPassword.value;

    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const width = ["0%", "25%", "50%", "75%", "100%"];

    strengthBar.style.width = width[score];

    if (!password) {
        strengthText.textContent = "Password strength";
    } else if (score <= 1) {
        strengthText.textContent = "Weak password";
    } else if (score === 2) {
        strengthText.textContent = "Medium password";
    } else if (score === 3) {
        strengthText.textContent = "Strong password";
    } else {
        strengthText.textContent = "Very strong password";
    }

});


// =====================================================
// REGISTER
// =====================================================

registerForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = confirmPassword.value;

    let role = "";

    if (jobSeeker?.checked) {
        role = "Job Seeker";
    }

    if (recruiter?.checked) {
        role = "Recruiter";
    }


    // VALIDATION

    if (name.length < 2) {
        showToast(
            "Please enter your full name.",
            "error"
        );
        return;
    }


    if (!email) {
        showToast(
            "Please enter your email address.",
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


    if (!terms?.checked) {
        showToast(
            "Please accept Terms & Conditions.",
            "error"
        );
        return;
    }


    try {

        showToast(
            "Creating your FAST-TRACK account...",
            "loading"
        );


        // CREATE FIREBASE USER

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = result.user;


        // SAVE DISPLAY NAME

        await updateProfile(user, {
            displayName: name
        });


        // SAVE FIRESTORE PROFILE

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
            "✅ Registration successful:",
            user.uid
        );


        registerForm.reset();

        if (strengthBar) {
            strengthBar.style.width = "0%";
        }

        if (strengthText) {
            strengthText.textContent = "Password strength";
        }


        showToast(
            "Your account has been created successfully! 🎉",
            "success"
        );


        // MOVE TO LOGIN

        setTimeout(() => {

            showLogin();

            if (loginEmail) {
                loginEmail.value = email;
            }

            if (loginPassword) {
                loginPassword.value = "";
            }

        }, 1400);

    }

    catch (error) {

        console.error(
            "❌ REGISTER ERROR:",
            error
        );

        showToast(
            getFirebaseError(error),
            "error"
        );
    }

});


// =====================================================
// LOGIN
// =====================================================

loginForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;


    if (!email) {
        showToast(
            "Please enter your email address.",
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
            "Signing you in...",
            "loading"
        );


        // REMEMBER ME

        await setPersistence(
            auth,
            rememberMe?.checked
                ? browserLocalPersistence
                : browserSessionPersistence
        );


        // FIREBASE LOGIN

        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = result.user;


        // GET USER PROFILE

        let profile = {};

        try {

            const userDoc =
                await getDoc(
                    doc(db, "users", user.uid)
                );

            if (userDoc.exists()) {
                profile = userDoc.data();
            }

        } catch (profileError) {

            console.warn(
                "Profile fetch warning:",
                profileError
            );

        }


        // SAVE USER LOCALLY

        const userData = {
            uid: user.uid,

            name:
                profile.name ||
                user.displayName ||
                "",

            email:
                user.email || "",

            role:
                profile.role ||
                ""
        };


        localStorage.setItem(
            "fastTrackUser",
            JSON.stringify(userData)
        );


        showToast(
            "Login successful! Redirecting to dashboard 🚀",
            "success"
        );


        // DASHBOARD

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1200);

    }

    catch (error) {

        console.error(
            "❌ LOGIN ERROR:",
            error
        );

        showToast(
            getFirebaseError(error),
            "error"
        );
    }

});


// =====================================================
// FIREBASE ERROR HANDLER
// =====================================================

function getFirebaseError(error) {

    switch (error?.code) {

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/weak-password":
            return "Password is too weak.";

        case "auth/user-disabled":
            return "This account has been disabled.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        case "auth/network-request-failed":
            return "Network error. Check your internet connection.";

        case "auth/popup-closed-by-user":
            return "Google login was cancelled.";

        case "auth/popup-blocked":
            return "Please allow popups for Google login.";

        default:
            return error?.message ||
                   "Something went wrong. Please try again.";
    }
}


// =====================================================
// FORGOT PASSWORD
// =====================================================

forgotButton?.addEventListener("click", () => {

    forgotModal?.classList.add("active");

    if (resetEmail && loginEmail) {
        resetEmail.value = loginEmail.value.trim();
    }

});


cancelForgot?.addEventListener("click", () => {

    forgotModal?.classList.remove("active");

});


forgotModal?.addEventListener("click", (event) => {

    if (event.target === forgotModal) {
        forgotModal.classList.remove("active");
    }

});


resetForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = resetEmail.value.trim();


    if (!email) {

        showToast(
            "Please enter your email address.",
            "error"
        );

        return;
    }


    try {

        showToast(
            "Sending password reset link...",
            "loading"
        );


        await sendPasswordResetEmail(
            auth,
            email
        );


        forgotModal?.classList.remove("active");


        showToast(
            "Password reset link sent to your email 📩",
            "success"
        );

    }

    catch (error) {

        console.error(
            "❌ RESET ERROR:",
            error
        );

        showToast(
            getFirebaseError(error),
            "error"
        );
    }

});


// =====================================================
// GOOGLE LOGIN
// =====================================================

async function googleLogin() {

    try {

        showToast(
            "Opening Google sign-in...",
            "loading"
        );


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

        const user = result.user;


        // USER DOCUMENT

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
                    uid: user.uid,

                    name:
                        user.displayName || "",

                    email:
                        user.email || "",

                    role: "Job Seeker",

                    profileCompleted: false,

                    createdAt:
                        serverTimestamp()
                }
            );

        }


        // LOCAL STORAGE

        localStorage.setItem(
            "fastTrackUser",
            JSON.stringify({
                uid: user.uid,

                name:
                    user.displayName || "",

                email:
                    user.email || "",

                role: "Job Seeker"
            })
        );


        showToast(
            "Google login successful! Redirecting 🚀",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1200);

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
            getFirebaseError(error),
            "error"
        );
    }

}


loginGoogle?.addEventListener(
    "click",
    googleLogin
);

registerGoogle?.addEventListener(
    "click",
    googleLogin
);


// =====================================================
// START
// =====================================================

console.log(
    "🚀 FAST-TRACK Authentication Ready"
);
