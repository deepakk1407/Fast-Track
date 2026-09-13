/* =========================================================
   FAST-TRACK | Firebase Authentication
   Login • Register • Google • Forgot Password
========================================================= */

/* ================= FIREBASE IMPORTS ================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    sendPasswordResetEmail,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged,
    signOut,
    getAdditionalUserInfo
} from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecto",
    authDomain: "fast-track-6d262.firebaseapp.com",
    projectId: "fast-track-6d262",
    storageBucket: "fast-track-6d262.firebasestorage.app",
    messagingSenderId: "338934873510",
    appId: "1:338934873510:web:16b3211577dd2ce683a367",
    measurementId: "G-9TFBXV2PQM"
};


/* ================= INITIALIZE FIREBASE ================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

console.log("🔥 FAST-TRACK Firebase JS loaded");


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* ================= TOAST ================= */

function showToast(message, type = "success") {

    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.remove("show", "success", "error");

    toast.classList.add("show", type);

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


/* ================= BUTTON LOADING ================= */

function setButtonLoading(button, loading, normalText) {

    if (!button) return;

    button.disabled = loading;

    if (loading) {
        button.dataset.originalText = button.textContent;
        button.textContent = "Please wait...";
    } else {
        button.textContent =
            button.dataset.originalText || normalText;
    }
}


/* =========================================================
   AUTH TABS
========================================================= */

const loginTab = $("loginTab");
const registerTab = $("registerTab");

const loginBox = $("loginBox");
const registerBox = $("registerBox");


function showLogin() {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginBox.classList.add("active");
    registerBox.classList.remove("active");
}


function showRegister() {

    registerTab.classList.remove("active");
    loginTab.classList.remove("active");

    registerTab.classList.add("active");

    registerBox.classList.add("active");
    loginBox.classList.remove("active");
}


if (loginTab) {
    loginTab.addEventListener("click", showLogin);
}


if (registerTab) {
    registerTab.addEventListener("click", showRegister);
}


if ($("goRegister")) {
    $("goRegister").addEventListener("click", showRegister);
}


if ($("goLogin")) {
    $("goLogin").addEventListener("click", showLogin);
}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

function setupPasswordToggle(eyeId, inputId) {

    const eye = $(eyeId);
    const input = $(inputId);

    if (!eye || !input) return;

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


setupPasswordToggle("loginEye", "loginPassword");
setupPasswordToggle("registerEye", "registerPassword");
setupPasswordToggle("confirmEye", "confirmPassword");


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

const registerPassword = $("registerPassword");
const strengthBar = $("strengthBar");
const strengthText = $("strengthText");


if (registerPassword) {

    registerPassword.addEventListener("input", () => {

        const password = registerPassword.value;

        let strength = 0;

        if (password.length >= 6) {
            strength++;
        }

        if (/[A-Z]/.test(password)) {
            strength++;
        }

        if (/[0-9]/.test(password)) {
            strength++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength++;
        }


        if (!password) {

            strengthBar.style.width = "0%";
            strengthText.textContent = "Password strength";

        }

        else if (strength === 1) {

            strengthBar.style.width = "25%";
            strengthText.textContent = "Weak password";

        }

        else if (strength === 2) {

            strengthBar.style.width = "50%";
            strengthText.textContent = "Medium password";

        }

        else if (strength === 3) {

            strengthBar.style.width = "75%";
            strengthText.textContent = "Strong password";

        }

        else {

            strengthBar.style.width = "100%";
            strengthText.textContent = "Very strong password";

        }

    });

}


/* =========================================================
   FIRESTORE USER PROFILE
========================================================= */

async function saveUserProfile(user, extraData = {}) {

    try {

        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                name: user.displayName || extraData.name || "",
                email: user.email || "",
                role: extraData.role || "Job Seeker",
                photoURL: user.photoURL || "",
                createdAt:
                    extraData.createdAt || serverTimestamp(),
                lastLoginAt: serverTimestamp()
            },
            {
                merge: true
            }
        );

        console.log("✅ User profile saved");

    } catch (error) {

        console.error(
            "Firestore profile error:",
            error
        );

        /*
           Authentication should still work even if
           Firestore temporarily fails.
        */
    }
}


/* =========================================================
   REGISTER WITH EMAIL
========================================================= */

const registerForm = $("registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const name =
            $("registerName").value.trim();

        const email =
            $("registerEmail").value.trim();

        const password =
            $("registerPassword").value;

        const confirmPassword =
            $("confirmPassword").value;

        const terms =
            $("terms").checked;


        const selectedRole =
            document.querySelector(
                'input[name="role"]:checked'
            );


        /* VALIDATION */

        if (!name) {

            showToast(
                "Please enter your full name.",
                "error"
            );

            return;
        }


        if (!selectedRole) {

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


        const registerButton =
            registerForm.querySelector(
                'button[type="submit"]'
            );


        try {

            setButtonLoading(
                registerButton,
                true
            );


            /* CREATE FIREBASE ACCOUNT */

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            /* UPDATE DISPLAY NAME */

            await updateProfile(user, {
                displayName: name
            });


            /* SAVE PROFILE */

            await saveUserProfile(
                user,
                {
                    name: name,
                    role: selectedRole.value
                }
            );


            showToast(
                "🎉 Account created successfully!",
                "success"
            );


            /* CLEAR FORM */

            registerForm.reset();

            strengthBar.style.width = "0%";
            strengthText.textContent =
                "Password strength";


            /*
              Move to login after registration
            */

            setTimeout(() => {

                showLogin();

                $("loginEmail").value = email;

            }, 1200);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            showToast(
                getFirebaseErrorMessage(error),
                "error"
            );

        } finally {

            setButtonLoading(
                registerButton,
                false
            );

        }

    });

}


/* =========================================================
   LOGIN WITH EMAIL
========================================================= */

const loginForm = $("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            $("loginEmail").value.trim();

        const password =
            $("loginPassword").value;

        const remember =
            $("rememberMe").checked;


        const loginButton =
            loginForm.querySelector(
                'button[type="submit"]'
            );


        try {

            setButtonLoading(
                loginButton,
                true
            );


            /* REMEMBER ME */

            await setPersistence(
                auth,
                remember
                    ? browserLocalPersistence
                    : browserSessionPersistence
            );


            /* LOGIN */

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            /* UPDATE LAST LOGIN */

            await saveUserProfile(user);


            showToast(
                `Welcome back, ${user.displayName || "User"}! 🚀`,
                "success"
            );


            /*
              TODO:
              Replace this with your dashboard page
              when dashboard.html is ready.
            */

            setTimeout(() => {

                console.log(
                    "✅ Login successful:",
                    user.email
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            showToast(
                getFirebaseErrorMessage(error),
                "error"
            );

        } finally {

            setButtonLoading(
                loginButton,
                false
            );

        }

    });

}


/* =========================================================
   GOOGLE LOGIN / REGISTER
========================================================= */

async function googleLogin() {

    try {

        /*
          Desktop browsers → popup
          Mobile browsers → redirect
        */

        const isMobile =
            /Android|iPhone|iPad|iPod/i.test(
                navigator.userAgent
            );


        if (isMobile) {

            await signInWithRedirect(
                auth,
                googleProvider
            );

            return;
        }


        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        const user =
            result.user;


        const additionalInfo =
            getAdditionalUserInfo(result);


        /*
          Only ask for role when the Google account
          is being created for the first time.
        */

        if (
            additionalInfo &&
            additionalInfo.isNewUser
        ) {

            const role =
                confirm(
                    "Are you registering as a Recruiter?\n\nOK = Recruiter\nCancel = Job Seeker"
                )
                    ? "Recruiter"
                    : "Job Seeker";


            await saveUserProfile(
                user,
                {
                    name:
                        user.displayName || "",
                    role: role
                }
            );

        } else {

            await saveUserProfile(user);

        }


        showToast(
            `Welcome, ${user.displayName || "User"}! 🚀`,
            "success"
        );


    } catch (error) {

        console.error(
            "Google authentication error:",
            error
        );

        showToast(
            getFirebaseErrorMessage(error),
            "error"
        );

    }

}


/* LOGIN GOOGLE */

if ($("loginGoogle")) {

    $("loginGoogle").addEventListener(
        "click",
        googleLogin
    );

}


/* REGISTER GOOGLE */

if ($("registerGoogle")) {

    $("registerGoogle").addEventListener(
        "click",
        googleLogin
    );

}


/* =========================================================
   GOOGLE REDIRECT RESULT
========================================================= */

async function handleGoogleRedirect() {

    try {

        const result =
            await getRedirectResult(auth);


        if (!result) {
            return;
        }


        const user =
            result.user;


        const additionalInfo =
            getAdditionalUserInfo(result);


        if (
            additionalInfo &&
            additionalInfo.isNewUser
        ) {

            const role =
                confirm(
                    "Are you registering as a Recruiter?\n\nOK = Recruiter\nCancel = Job Seeker"
                )
                    ? "Recruiter"
                    : "Job Seeker";


            await saveUserProfile(
                user,
                {
                    name:
                        user.displayName || "",
                    role: role
                }
            );

        } else {

            await saveUserProfile(user);

        }


        showToast(
            `Welcome, ${user.displayName || "User"}! 🚀`,
            "success"
        );


    } catch (error) {

        console.error(
            "Google redirect error:",
            error
        );

        showToast(
            getFirebaseErrorMessage(error),
            "error"
        );

    }

}


handleGoogleRedirect();


/* =========================================================
   FORGOT PASSWORD MODAL
========================================================= */

const forgotModal = $("forgotModal");


if ($("forgotButton")) {

    $("forgotButton").addEventListener(
        "click",
        () => {

            forgotModal.classList.add("active");

            const loginEmail =
                $("loginEmail").value.trim();

            if (loginEmail) {
                $("resetEmail").value =
                    loginEmail;
            }

        }
    );

}


/* CANCEL FORGOT PASSWORD */

if ($("cancelForgot")) {

    $("cancelForgot").addEventListener(
        "click",
        () => {

            forgotModal.classList.remove(
                "active"
            );

        }
    );

}


/* CLOSE MODAL WHEN CLICKING OUTSIDE */

if (forgotModal) {

    forgotModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                forgotModal
            ) {

                forgotModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   SEND PASSWORD RESET EMAIL
========================================================= */

const resetForm = $("resetForm");


if (resetForm) {

    resetForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                $("resetEmail").value.trim();


            const resetButton =
                resetForm.querySelector(
                    'button[type="submit"]'
                );


            try {

                setButtonLoading(
                    resetButton,
                    true
                );


                await sendPasswordResetEmail(
                    auth,
                    email
                );


                showToast(
                    "📧 Password reset link sent to your email.",
                    "success"
                );


                resetForm.reset();


                setTimeout(() => {

                    forgotModal.classList.remove(
                        "active"
                    );

                }, 1000);


            } catch (error) {

                console.error(
                    "Password reset error:",
                    error
                );

                showToast(
                    getFirebaseErrorMessage(error),
                    "error"
                );

            } finally {

                setButtonLoading(
                    resetButton,
                    false
                );

            }

        }
    );

}


/* =========================================================
   FIREBASE AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            console.log(
                "👤 Firebase user:",
                user.email
            );

        } else {

            console.log(
                "👤 No user currently signed in"
            );

        }

    }
);


/* =========================================================
   LOGOUT FUNCTION
========================================================= */

window.fastTrackLogout = async function () {

    try {

        await signOut(auth);

        showToast(
            "You have been logged out.",
            "success"
        );

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        showToast(
            getFirebaseErrorMessage(error),
            "error"
        );

    }

};


/* =========================================================
   FIREBASE ERROR MESSAGES
=============================
