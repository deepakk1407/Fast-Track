import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

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

    apiKey:
        "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecta",

    authDomain:
        "fast-track-6d262.firebaseapp.com",

    projectId:
        "fast-track-6d262",

    storageBucket:
        "fast-track-6d262.firebasestorage.app",

    messagingSenderId:
        "338934873510",

    appId:
        "1:338934873510:web:16b3211577dd2ce683a367",

    measurementId:
        "G-9TFBXV2PQM"
};


/* =========================
   INITIALIZE FIREBASE
========================= */

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


/* =========================
   HTML ELEMENTS
========================= */

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginBox =
    document.getElementById("loginBox");

const registerBox =
    document.getElementById("registerBox");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginGoogle =
    document.getElementById("loginGoogle");

const registerGoogle =
    document.getElementById("registerGoogle");

const goRegister =
    document.getElementById("goRegister");

const goLogin =
    document.getElementById("goLogin");

const forgotButton =
    document.getElementById("forgotButton");

const forgotModal =
    document.getElementById("forgotModal");

const cancelForgot =
    document.getElementById("cancelForgot");

const resetForm =
    document.getElementById("resetForm");

const toast =
    document.getElementById("toast");


/* =========================
   TOAST MESSAGE
========================= */

function showToast(message, type = "success") {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    if (type === "error") {

        toast.style.background =
            "#dc2626";

    } else {

        toast.style.background =
            "#111827";
    }

    clearTimeout(
        window.fastTrackToastTimer
    );

    window.fastTrackToastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);
}


/* =========================
   SWITCH TO LOGIN
========================= */

function showLogin() {

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    loginBox.classList.add("active");

    registerBox.classList.remove("active");
}


/* =========================
   SWITCH TO REGISTER
========================= */

function showRegister() {

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    registerBox.classList.add("active");

    loginBox.classList.remove("active");
}


/* =========================
   TAB EVENTS
========================= */

loginTab.addEventListener(
    "click",
    showLogin
);

registerTab.addEventListener(
    "click",
    showRegister
);

goRegister.addEventListener(
    "click",
    showRegister
);

goLogin.addEventListener(
    "click",
    showLogin
);


/* =========================
   PASSWORD SHOW / HIDE
========================= */

function setupPasswordToggle(
    inputId,
    buttonId
) {

    const input =
        document.getElementById(inputId);

    const button =
        document.getElementById(buttonId);

    if (!input || !button) return;

    button.addEventListener(
        "click",
        () => {

            if (input.type === "password") {

                input.type = "text";

                button.textContent = "🙈";

            } else {

                input.type = "password";

                button.textContent = "👁";
            }

        }
    );
}


setupPasswordToggle(
    "loginPassword",
    "loginEye"
);

setupPasswordToggle(
    "registerPassword",
    "registerEye"
);

setupPasswordToggle(
    "confirmPassword",
    "confirmEye"
);


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("loginPassword")
                .value;


        if (!email || !password) {

            showToast(
                "Please enter email and password.",
                "error"
            );

            return;
        }


        const rememberMe =
            document
                .getElementById("rememberMe")
                .checked;


        try {

            /* Persistence */

            await setPersistence(
                auth,
                rememberMe
                    ? browserLocalPersistence
                    : browserSessionPersistence
            );


            /* Sign in */

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                result.user;


            /* Save basic user data */

            localStorage.setItem(
                "fastTrackUser",
                JSON.stringify({
                    uid: user.uid,
                    name:
                        user.displayName ||
                        "User",
                    email:
                        user.email || ""
                })
            );


            showToast(
                "Login successful! Welcome back 👋"
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 900);

        }
        catch (error) {

            console.error(
                "Login error:",
                error
            );


            let message =
                "Login failed. Please try again.";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message =
                    "Invalid email or password.";

            }
            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                message =
                    "No account found with this email.";

            }
            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                message =
                    "Incorrect password.";

            }
            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Please enter a valid email.";

            }


            showToast(
                message,
                "error"
            );

        }

    }
);


/* =========================
   REGISTER
========================= */

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("registerName")
                .value
                .trim();

        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("registerPassword")
                .value;

        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;

        const terms =
            document
                .getElementById("terms")
                .checked;


        const roleElement =
            document.querySelector(
                'input[name="role"]:checked'
            );


        const role =
            roleElement
                ? roleElement.value
                : "Job Seeker";


        /* Validation */

        if (!name) {

            showToast(
                "Please enter your name.",
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

            /* Create Firebase account */

            const result =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                result.user;


            /* Add display name */

            await updateProfile(
                user,
                {
                    displayName: name
                }
            );


            /* Save Firestore profile */

            await setDoc(
                doc(
                    db,
                    "users",
                    user.uid
                ),
                {
                    uid: user.uid,
                    name: name,
                    email: email,
                    role: role,
                    profileCompleted: false,
                    createdAt:
                        serverTimestamp()
                }
            );


            /* Save local data */

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

                window.location.href =
                    "dashboard.html";

            }, 900);

        }
        catch (error) {

            console.error(
                "Registration error:",
                error
            );


            let message =
                "Registration failed. Please try again.";


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
                    "Please enter a valid email.";

            }
            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message =
                    "Password is too weak.";

            }


            showToast(
                message,
                "error"
            );

        }

    }
);


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
                    uid: user.uid,
                    name:
                        user.displayName ||
                        "User",
                    email:
                        user.email || "",
                    role: "Job Seeker",
                    profileCompleted: false,
                    createdAt:
                        serverTimestamp()
                }
            );

        }


        localStorage.setItem(
            "fastTrackUser",
            JSON.stringify({
                uid: user.uid,
                name:
                    user.displayName ||
                    "User",
                email:
                    user.email || "",
                role:
                    userDoc.exists()
                        ? userDoc.data().role
                        : "Job Seeker"
            })
        );


        showToast(
            "Google login successful! 🚀"
        );


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 900);

    }
    catch (error) {

        console.error(
            "Google login error:",
            error
        );


        if (
            error.code ===
            "auth/popup-closed-by-user"
        ) {

            showToast(
                "Google login was cancelled.",
                "error"
            );

            return;
        }


        showToast(
            "Google login failed. Please try again.",
            "error"
        );

    }

}


loginGoogle.addEventListener(
    "click",
    googleLogin
);

registerGoogle.addEventListener(
    "click",
    googleLogin
);


/* =========================
   FORGOT PASSWORD
========================= */

forgotButton.addEventListener(
    "click",
    () => {

        forgotModal.classList.add(
            "active"
        );

    }
);


cancelForgot.addEventListener(
    "click",
    () => {

        forgotModal.classList.remove(
            "active"
        );

    }
);


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


/* =========================
   RESET PASSWORD
========================= */

resetForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("resetEmail")
                .value
                .trim();


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


            forgotModal.classList.remove(
                "active"
            );


            resetForm.reset();


            showToast(
                "Password reset link sent to your email."
            );

        }
        catch (error) {

            console.error(
                "Reset error:",
                error
            );


            showToast(
                "Unable to send reset link. Check the email.",
                "error"
            );

        }

    }
);
