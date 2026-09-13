/* =====================================================
   FAST-TRACK | FIREBASE JAVASCRIPT
   Firebase Authentication + Firestore
===================================================== */

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


/* ================= GET ELEMENTS ================= */

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginBox =
    document.getElementById("loginBox");

const registerBox =
    document.getElementById("registerBox");


/* ================= SWITCH FORMS ================= */

function showLogin() {

    loginBox.classList.add("active");

    registerBox.classList.remove("active");

    loginTab.classList.add("active");

    registerTab.classList.remove("active");
}


function showRegister() {

    registerBox.classList.add("active");

    loginBox.classList.remove("active");

    registerTab.classList.add("active");

    loginTab.classList.remove("active");
}


/* ================= TAB BUTTONS ================= */

loginTab.addEventListener(
    "click",
    showLogin
);

registerTab.addEventListener(
    "click",
    showRegister
);


/* ================= BOTTOM LINKS ================= */

document
    .getElementById("goRegister")
    .addEventListener(
        "click",
        showRegister
    );


document
    .getElementById("goLogin")
    .addEventListener(
        "click",
        showLogin
    );


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function passwordToggle(inputId, eyeId) {

    const input =
        document.getElementById(inputId);

    const eye =
        document.getElementById(eyeId);


    if (input.type === "password") {

        input.type = "text";

        eye.textContent = "🙈";

    } else {

        input.type = "password";

        eye.textContent = "👁";

    }
}


/* ================= LOGIN PASSWORD ================= */

document
    .getElementById("loginEye")
    .addEventListener(
        "click",
        function () {

            passwordToggle(
                "loginPassword",
                "loginEye"
            );

        }
    );


/* ================= REGISTER PASSWORD ================= */

document
    .getElementById("registerEye")
    .addEventListener(
        "click",
        function () {

            passwordToggle(
                "registerPassword",
                "registerEye"
            );

        }
    );


/* ================= CONFIRM PASSWORD ================= */

document
    .getElementById("confirmEye")
    .addEventListener(
        "click",
        function () {

            passwordToggle(
                "confirmPassword",
                "confirmEye"
            );

        }
    );


/* =====================================================
   PASSWORD STRENGTH
===================================================== */

document
    .getElementById("registerPassword")
    .addEventListener(
        "input",
        function () {

            const password =
                this.value;

            const bar =
                document.getElementById(
                    "strengthBar"
                );

            const text =
                document.getElementById(
                    "strengthText"
                );


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


            if (password.length === 0) {

                bar.style.width = "0%";

                text.textContent =
                    "Password strength";

            }

            else if (strength === 1) {

                bar.style.width = "25%";

                text.textContent =
                    "Weak password";

            }

            else if (strength === 2) {

                bar.style.width = "50%";

                text.textContent =
                    "Medium password";

            }

            else if (strength === 3) {

                bar.style.width = "75%";

                text.textContent =
                    "Strong password";

            }

            else {

                bar.style.width = "100%";

                text.textContent =
                    "Very strong password";

            }

        }
    );


/* =====================================================
   FIREBASE ERROR MESSAGE
===================================================== */

function getFirebaseErrorMessage(error) {

    switch (error.code) {

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/missing-password":
            return "Please enter your password.";

        case "auth/invalid-credential":
            return "Invalid email or password ❌";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
            return "Incorrect password ❌";

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/weak-password":
            return "Password must contain at least 6 characters.";

        case "auth/popup-closed-by-user":
            return "Google sign-in was cancelled.";

        case "auth/popup-blocked":
            return "Google popup was blocked. Please allow popups.";

        case "auth/unauthorized-domain":
            return "This website domain is not authorized in Firebase.";

        case "auth/network-request-failed":
            return "Network error. Please check your internet.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        case "auth/account-exists-with-different-credential":
            return "An account already exists with this email using another sign-in method.";

        case "auth/operation-not-allowed":
            return "Email/Password sign-in is not enabled in Firebase.";

        default:
            console.error(error);

            return "Something went wrong. Please try again.";
    }
}


/* =====================================================
   SAVE USER PROFILE TO FIRESTORE
===================================================== */

async function saveUserProfile(user, extraData = {}) {

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    const provider =
        extraData.provider ||
        (
            user.providerData?.[0]?.providerId ===
            "google.com"
                ? "google"
                : "password"
        );


    const userData = {

        uid: user.uid,

        name:
            extraData.name ||
            user.displayName ||
            "",

        email:
            user.email ||
            "",

        provider: provider,

        photoURL:
            user.photoURL ||
            "",

        updatedAt:
            serverTimestamp()

    };


    if (extraData.role) {

        userData.role =
            extraData.role;

    }


    if (extraData.createdAt) {

        userData.createdAt =
            extraData.createdAt;

    }


    await setDoc(
        userRef,
        userData,
        {
            merge: true
        }
    );
}


/* =====================================================
   REGISTER WITH EMAIL + PASSWORD
===================================================== */

document
    .getElementById("registerForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const role =
                document.querySelector(
                    'input[name="role"]:checked'
                );


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            const terms =
                document.getElementById(
                    "terms"
                );


            /* VALIDATION */

            if (!name) {

                showToast(
                    "Please enter your name."
                );

                return;
            }


            if (!role) {

                showToast(
                    "Please select your role."
                );

                return;
            }


            if (password.length < 6) {

                showToast(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            if (password !== confirmPassword) {

                showToast(
                    "Passwords do not match ❌"
                );

                return;
            }


            if (terms && !terms.checked) {

                showToast(
                    "Please accept the Terms & Conditions."
                );

                return;
            }


            try {

                /* CREATE FIREBASE ACCOUNT */

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                /* ADD DISPLAY NAME */

                await updateProfile(
                    user,
                    {
                        displayName: name
                    }
                );


                /* SAVE USER TO FIRESTORE */

                await saveUserProfile(
                    user,
                    {
                        name: name,
                        role: role.value,
                        provider: "password",
                        createdAt:
                            serverTimestamp()
                    }
                );


                showToast(
                    "Account created successfully 🚀"
                );


                /* RESET FORM */

                document
                    .getElementById(
                        "registerForm"
                    )
                    .reset();


                document
                    .getElementById(
                        "strengthBar"
                    )
                    .style.width = "0%";


                document
                    .getElementById(
                        "strengthText"
                    )
                    .textContent =
                        "Password strength";


                /* GO TO LOGIN */

                setTimeout(
                    function () {

                        document
                            .getElementById(
                                "loginEmail"
                            )
                            .value = email;

                        showLogin();

                    },
                    1200
                );


            } catch (error) {

                showToast(
                    getFirebaseErrorMessage(error)
                );

            }

        }
    );


/* =====================================================
   LOGIN WITH EMAIL + PASSWORD
===================================================== */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            const rememberMe =
                document.getElementById(
                    "rememberMe"
                );


            try {

                /* REMEMBER ME */

                await setPersistence(
                    auth,
                    rememberMe &&
                    rememberMe.checked
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


                /* UPDATE FIRESTORE */

                await saveUserProfile(
                    user,
                    {
                        name:
                            user.displayName ||
                            "",
                        provider: "password"
                    }
                );


                showToast(
                    "Login successful! Welcome " +
                    (
                        user.displayName ||
                        user.email
                    ) +
                    " 🚀"
                );


                /*
                   DASHBOARD REDIRECT

                   Later we can add:
                   window.location.href =
                       "dashboard.html";
                */

            } catch (error) {

                showToast(
                    getFirebaseErrorMessage(error)
                );

            }

        }
    );


/* =====================================================
   GOOGLE LOGIN / REGISTER
===================================================== */

async function googleLogin(mode) {

    try {

        /* REGISTER MODE */

        if (mode === "register") {

            const role =
                document.querySelector(
                    'input[name="role"]:checked'
                );


            if (!role) {

                showToast(
                    "Please select Job Seeker or Recruiter first."
                );

                return;
            }


            sessionStorage.setItem(
                "fastTrackGoogleRole",
                role.value
            );
        }


        /* SAVE MODE */

        sessionStorage.setItem(
            "fastTrackGoogleMode",
            mode
        );


        /*
           On mobile, redirect is more reliable
           than popup.
        */

        const isMobile =
            window.matchMedia(
                "(max-width: 700px)"
            ).matches;


        if (isMobile) {

            await signInWithRedirect(
                auth,
                googleProvider
            );

            return;
        }


        /* DESKTOP POPUP */

        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        await handleGoogleUser(
            result
        );


    } catch (error) {

        showToast(
            getFirebaseErrorMessage(error)
        );

    }
}


/* ================= GOOGLE BUTTONS ================= */

document
    .getElementById("loginGoogle")
    .addEventListener(
        "click",
        function () {

            googleLogin("login");

        }
    );


document
    .getElementById("registerGoogle")
    .addEventListener(
        "click",
        function () {

            googleLogin("register");

        }
    );


/* =====================================================
   HANDLE GOOGLE USER
===================================================== */

async function handleGoogleUser(result) {

    const user =
        result.user;


    const additionalInfo =
        getAdditionalUserInfo(result);


    const isNewUser =
        additionalInfo?.isNewUser === true;


    const mode =
        sessionStorage.getItem(
            "fastTrackGoogleMode"
        );


    const savedRole =
        sessionStorage.getItem(
            "fastTrackGoogleRole"
        );


    const profileData = {

        name:
            user.displayName ||
            "",

        provider:
            "google"

    };


    /*
       Only assign role to a newly-created
       Google account.

       Existing account role will not
       accidentally be overwritten.
    */

    if (
        isNewUser &&
        mode === "register" &&
        savedRole
    ) {

        profileData.role =
            savedRole;

        profileData.createdAt =
            serverTimestamp();
    }


    await saveUserProfile(
        user,
        profileData
    );


    sessionStorage.removeItem(
        "fastTrackGoogleRole"
    );

    sessionStorage.removeItem(
        "fastTrackGoogleMode"
    );


    showToast(
        "Google sign-in successful! Welcome " +
        (
            user.displayName ||
            user.email
        ) +
        " 🚀"
    );


    /*
       Later:

       window.location.href =
           "dashboard.html";
    */
}


/* =====================================================
   HANDLE GOOGLE REDIRECT RESULT
===================================================== */

async function checkGoogleRedirect() {

    try {

        const result =
            await getRedirectResult(auth);


        if (!result) {
            return;
        }


        await handleGoogleUser(
            result
        );


    } catch (error) {

        showToast(
            getFirebaseErrorMessage(error)
        );

    }
}


checkGoogleRedirect();


/* =====================================================
   FORGOT PASSWORD
===================================================== */

const forgotModal =
    document.getElementById(
        "forgotModal"
    );


document
    .getElementById("forgotButton")
    .
