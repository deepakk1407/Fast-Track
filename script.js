import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    updateProfile
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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
   INITIALIZE
========================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* =========================
   ELEMENTS
========================= */

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginGoogle = document.getElementById("loginGoogle");
const registerGoogle = document.getElementById("registerGoogle");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

const forgotButton = document.getElementById("forgotButton");
const forgotModal = document.getElementById("forgotModal");
const cancelForgot = document.getElementById("cancelForgot");
const resetForm = document.getElementById("resetForm");

const toast = document.getElementById("toast");


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

    clearTimeout(window.fastTrackToastTimer);

    window.fastTrackToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}


/* =========================
   FIREBASE ERROR MESSAGE
========================= */

function firebaseError(error) {

    console.error("Firebase Error:", error);

    const code = error?.code || "";

    switch (code) {

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Invalid email address.";

        case "auth/weak-password":
            return "Password must contain at least 6 characters.";

        case "auth/operation-not-allowed":
            return "Email/Password login is not enabled in Firebase.";

        case "auth/unauthorized-domain":
            return "This website domain is not authorized in Firebase.";

        case "auth/popup-blocked":
            return "Google login popup was blocked.";

        case "auth/popup-closed-by-user":
            return "Google login was cancelled.";

        case "auth/network-request-failed":
            return "Network error. Check your internet connection.";

        case "auth/too-many-requests":
            return "Too many attempts. Try again later.";

        case "permission-denied":
            return "Firestore permission denied. Check Firestore Rules.";

        default:
            return `Firebase error: ${code || "unknown-error"}`;
    }
}


/* =========================
   LOGIN / REGISTER SWITCH
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


loginTab?.addEventListener("click", showLogin);
registerTab?.addEventListener("click", showRegister);

goRegister?.addEventListener("click", showRegister);
goLogin?.addEventListener("click", showLogin);


/* =========================
   PASSWORD TOGGLE
========================= */

function setupPasswordToggle(inputId, buttonId) {

    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (!input || !button) return;

    button.addEventListener("click", () => {

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "🙈";
        } else {
            input.type = "password";
            button.textContent = "👁";
        }

    });
}


setupPasswordToggle("loginPassword", "loginEye");
setupPasswordToggle("registerPassword", "registerEye");
setupPasswordToggle("confirmPassword", "confirmEye");


/* =========================
   LOGIN
========================= */

loginForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail")?.value.trim();

    const password =
        document.getElementById("loginPassword")?.value;

    const rememberMe =
        document.getElementById("rememberMe")?.checked;


    if (!email || !password) {

        showToast(
            "Please enter email and password.",
            "error"
        );

        return;
    }


    try {

        await setPersistence(
            auth,
            rememberMe
                ? browserLocalPersistence
                : browserSessionPersistence
        );


        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = result.user;


        localStorage.setItem(
            "fastTrackUser",
            JSON.stringify({
                uid: user.uid,
                name: user.displayName || "User",
                email: user.email || ""
            })
        );


        showToast(
            "Login successful! Welcome back 👋"
        );


        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);


    } catch (error) {

        showToast(
            firebaseError(error),
            "error"
        );

    }

});


/* =========================
   REGISTER
========================= */

registerForm?.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        document.getElementById("registerName")?.value.trim();

    const email =
        document.getElementById("registerEmail")?.value.trim();

    const password =
        document.getElementById("registerPassword")?.value;

    const confirmPassword =
        document.getElementById("confirmPassword")?.value;

    const terms =
        document.getElementById("terms")?.checked;


    const roleElement =
        document.querySelector(
            'input[name="role"]:checked'
        );

    const role =
        roleElement?.value || "Job Seeker";


    /* VALIDATION */

    if (!name) {
        showToast("Please enter your name.", "error");
        return;
    }

    if (!email) {
        showToast("Please enter your email.", "error");
        return;
    }

    if (password.length < 6) {
        showToast(
            "Password must contain at least 6 characters.",
            "error"
        );
        return;
    }

    if (password !== confirmPassword) {
        showToast(
            "Passwords do not match.",
            "error"
        );
        return;
    }

    if (!terms) {
        showToast(
            "Please accept the Terms & Conditions.",
            "error"
        );
        return;
    }


    try {

        /* CREATE AUTH ACCOUNT */

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = result.user;


        /* DISPLAY NAME */

        await updateProfile(user, {
            displayName: name
        });


        /* FIRESTORE PROFILE */

        try {

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

        } catch (firestoreError) {

            console.error(
                "Firestore error:",
                firestoreError
            );

            /*
              Auth account is already created.
              So don't show registration failure.
            */

            showToast(
                "Account created! Profile storage needs setup."
            );
        }


        /* LOCAL STORAGE */

        localStorage.setItem(
            "fastTrackUser",
            JSON.stringify({
                uid: user.uid,
                name: name,
                email: email,
                role: role
            })
        );


        showToast(
            "Account created successfully! 🚀"
        );


        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);


    } catch (error) {

        showToast(
            firebaseError(error),
            "error"
        );

    }

});


/* =========================
   GOOGLE LOGIN
========================= */

async function googleLogin() {

    try {

        const provider =
            new GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        await setPersistence(
            auth,
            browserLocalPersistence
        );


        /*
          Redirect is more reliable on mobile
          browsers than popup.
        */

        await signInWithRedirect(
            auth,
            provider
        );

    } catch (error) {

        showToast(
            firebaseError(error),
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


/* =========================
   GOOGLE REDIRECT RESULT
========================= */

getRedirectResult(auth)
    .then(async (result) => {

        if (!result) return;

        const user = result.user;


        const userRef =
            doc(db, "users", user.uid);


        let userData = {
            uid: user.uid,
            name: user.displayName || "User",
            email: user.email || "",
            role: "Job Seeker"
        };


        try {

            const userDoc =
                await getDoc(userRef);


            if (!userDoc.exists()) {

                await setDoc(
                    userRef,
                    {
                        ...userData,
                        profileCompleted: false,
                        createdAt: serverTimestamp()
                    }
                );

            } else {

                userData.role =
                    userDoc.data().role ||
                    "Job Seeker";
            }

        } catch (error) {

            console.error(
                "Google Firestore error:",
                error
            );

        }


        localStorage.setItem(
            "fastTrackUser",
            JSON.stringify(userData)
        );


        showToast(
            "Google login successful! 🚀"
        );


        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);


    })
    .catch((error) => {

        showToast(
            firebaseError(error),
            "error"
        );

    });


/* =========================
   FORGOT PASSWORD
========================= */

forgotButton?.addEventListener(
    "click",
    () => {

        forgotModal.classList.add("active");

    }
);


cancelForgot?.addEventListener(
    "click",
    () => {

        forgotModal.classList.remove("active");

    }
);


forgotModal?.addEventListener(
    "click",
    (event) => {

        if (event.target === forgotModal) {

            forgotModal.classList.remove("active");

        }

    }
);


/* =========================
   RESET PASSWORD
========================= */

resetForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("resetEmail")
                ?.value.trim();


        if (!email) {

            showToast(
                "Please enter your email.",
                "error"
            );

            return;
        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            forgotModal.classList.remove("active");

            resetForm.reset();


            showToast(
                "Password reset link sent to your email."
            );


        } catch (error) {

            showToast(
                firebaseError(error),
                "error"
            );

        }

    }
);
