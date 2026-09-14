/* =========================================================
   FAST-TRACK | Firebase Authentication
   ========================================================= */

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


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecto",
    authDomain: "fast-track-6d262.firebaseapp.com",
    projectId: "fast-track-6d262",
    storageBucket: "fast-track-6d262.firebasestorage.app",
    messagingSenderId: "338934873510",
    appId: "1:338934873510:web:16b3211577dd2ce683a367",
    measurementId: "G-9TFBXV2PQM"
};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */


/*
   Get element safely
*/
function getElement(id) {
    return document.getElementById(id);
}


/*
   Show professional message
*/
function showMessage(message, type = "success") {

    /*
       If existing toast exists, use it.
    */

    const toast = getElement("toast");

    if (toast) {

        toast.textContent = message;

        toast.classList.remove(
            "show",
            "success",
            "error",
            "warning"
        );

        toast.classList.add(type);
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);

        return;
    }


    /*
       Fallback toast
    */

    const existing = document.querySelector(".ft-toast");

    if (existing) {
        existing.remove();
    }


    const newToast = document.createElement("div");

    newToast.className = `ft-toast ${type}`;

    newToast.textContent = message;

    document.body.appendChild(newToast);


    setTimeout(() => {
        newToast.classList.add("show");
    }, 50);


    setTimeout(() => {
        newToast.classList.remove("show");

        setTimeout(() => {
            newToast.remove();
        }, 300);

    }, 3500);
}


/*
   Save user information locally
   so other FAST-TRACK pages can use it.
*/
function saveCurrentUser(userData) {

    localStorage.setItem(
        "fastTrackCurrentUser",
        JSON.stringify(userData)
    );

    localStorage.setItem(
        "fastTrackUserName",
        userData.name || "User"
    );

    localStorage.setItem(
        "fastTrackUserEmail",
        userData.email || ""
    );

    localStorage.setItem(
        "fastTrackUserRole",
        userData.role || ""
    );

    localStorage.setItem(
        "fastTrackUID",
        userData.uid || ""
    );
}


/*
   Clear local user data
*/
function clearCurrentUser() {

    localStorage.removeItem("fastTrackCurrentUser");
    localStorage.removeItem("fastTrackUserName");
    localStorage.removeItem("fastTrackUserEmail");
    localStorage.removeItem("fastTrackUserRole");
    localStorage.removeItem("fastTrackUID");
}


/*
   Fetch user profile from Firestore
*/
async function getUserProfile(user) {

    if (!user) {
        return null;
    }

    try {

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const userSnapshot = await getDoc(userRef);


        if (userSnapshot.exists()) {

            const data = userSnapshot.data();

            return {
                uid: user.uid,
                name: data.name || user.displayName || "User",
                email: data.email || user.email || "",
                role: data.role || "Job Seeker"
            };
        }


        /*
           If Firestore document doesn't exist,
           create a basic local profile.
        */

        return {
            uid: user.uid,
            name: user.displayName || "User",
            email: user.email || "",
            role: "Job Seeker"
        };

    } catch (error) {

        console.error(
            "Error fetching user profile:",
            error
        );

        return {
            uid: user.uid,
            name: user.displayName || "User",
            email: user.email || "",
            role: "Job Seeker"
        };
    }
}


/* =========================================================
   PROFESSIONAL SUCCESS POPUP
   ========================================================= */

function showSuccessPopup(name = "User") {

    /*
       Remove existing popup
    */

    const oldPopup =
        document.getElementById("fastTrackSuccessPopup");

    if (oldPopup) {
        oldPopup.remove();
    }


    /*
       Popup
    */

    const popup =
        document.createElement("div");

    popup.id =
        "fastTrackSuccessPopup";


    popup.innerHTML = `

        <div class="ft-success-backdrop">

            <div class="ft-success-card">

                <div class="ft-success-icon">
                    ✓
                </div>

                <div class="ft-success-content">

                    <div class="ft-success-label">
                        FAST-TRACK
                    </div>

                    <h2>
                        Login Successful
                    </h2>

                    <p>
                        Welcome back,
                        <strong>${escapeHTML(name)}</strong> 👋
                    </p>

                    <div class="ft-loading">

                        <div class="ft-loading-bar">
                            <span></span>
                        </div>

                        <small>
                            Taking you to your dashboard...
                        </small>

                    </div>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(popup);


    /*
       Add popup styles dynamically
    */

    const style =
        document.createElement("style");

    style.id =
        "fastTrackPopupStyles";


    style.textContent = `

        #fastTrackSuccessPopup {
            position: fixed;
            inset: 0;
            z-index: 99999;
            font-family:
                Inter,
                Arial,
                sans-serif;
        }

        .ft-success-backdrop {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;

            background:
                rgba(5, 10, 30, 0.72);

            backdrop-filter:
                blur(10px);

            animation:
                ftFadeIn 0.25s ease;
        }

        .ft-success-card {

            width: min(430px, 100%);

            background:
                rgba(255, 255, 255, 0.98);

            border-radius: 24px;

            padding: 32px 28px;

            display: flex;
            align-items: center;
            gap: 20px;

            box-shadow:
                0 25px 80px
                rgba(0, 0, 0, 0.30);

            transform:
                translateY(10px);

            animation:
                ftPopup 0.4s ease forwards;
        }

        .ft-success-icon {

            min-width: 64px;
            width: 64px;
            height: 64px;

            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;

            background:
                linear-gradient(
                    135deg,
                    #2563eb,
                    #7c3aed
                );

            color: white;

            font-size: 32px;
            font-weight: 800;

            box-shadow:
                0 10px 25px
                rgba(37, 99, 235, 0.30);
        }

        .ft-success-label {

            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;

            color: #6366f1;

            margin-bottom: 5px;
        }

        .ft-success-content h2 {

            margin: 0;

            color: #111827;

            font-size: 23px;
            font-weight: 800;
        }

        .ft-success-content p {

            margin: 7px 0 16px;

            color: #6b7280;

            font-size: 14px;
        }

        .ft-success-content strong {
            color: #111827;
        }

        .ft-loading {
            width: 100%;
        }

        .ft-loading-bar {

            width: 100%;
            height: 4px;

            overflow: hidden;

            border-radius: 10px;

            background:
                #e5e7eb;
        }

        .ft-loading-bar span {

            display: block;

            width: 35%;
            height: 100%;

            border-radius: 10px;

            background:
                linear-gradient(
                    90deg,
                    #2563eb,
                    #7c3aed
                );

            animation:
                ftLoading 1.3s
                infinite ease-in-out;
        }

        .ft-loading small {

            display: block;

            margin-top: 8px;

            color: #9ca3af;

            font-size: 11px;
        }

        @keyframes ftFadeIn {

            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }

        }

        @keyframes ftPopup {

            from {
                opacity: 0;
                transform:
                    translateY(20px)
                    scale(0.96);
            }

            to {
                opacity: 1;
                transform:
                    translateY(0)
                    scale(1);
            }

        }

        @keyframes ftLoading {

            0% {
                transform:
                    translateX(-120%);
            }

            100% {
                transform:
                    translateX(320%);
            }

        }

        @media (max-width: 500px) {

            .ft-success-card {

                padding: 25px 20px;

                border-radius: 20px;

                gap: 15px;
            }

            .ft-success-icon {

                min-width: 54px;

                width: 54px;

                height: 54px;

                font-size: 27px;
            }

            .ft-success-content h2 {

                font-size: 20px;
            }

        }

    `;


    document.head.appendChild(style);
}


/*
   Escape HTML
   Prevents user-entered name from
   being inserted directly as HTML.
*/
function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   LOGIN / REGISTER TABS
   ========================================================= */

const loginTab =
    getElement("loginTab");

const registerTab =
    getElement("registerTab");

const loginBox =
    getElement("loginBox");

const registerBox =
    getElement("registerBox");


if (registerTab) {

    registerTab.addEventListener(
        "click",
        () => {

            loginTab?.classList.remove(
                "active"
            );

            registerTab.classList.add(
                "active"
            );


            loginBox?.classList.remove(
                "active"
            );

            registerBox?.classList.add(
                "active"
            );

        }
    );
}


if (loginTab) {

    loginTab.addEventListener(
        "click",
        () => {

            registerTab?.classList.remove(
                "active"
            );

            loginTab.classList.add(
                "active"
            );


            registerBox?.classList.remove(
                "active"
            );

            loginBox?.classList.add(
                "active"
            );

        }
    );
}


/* =========================================================
   CREATE ONE / LOGIN HERE
   ========================================================= */

const goRegister =
    getElement("goRegister");

const goLogin =
    getElement("goLogin");


if (goRegister) {

    goRegister.addEventListener(
        "click",
        () => {

            registerTab?.click();

        }
    );
}


if (goLogin) {

    goLogin.addEventListener(
        "click",
        () => {

            loginTab?.click();

        }
    );
}


/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

function setupPasswordToggle(
    eyeId,
    passwordId
) {

    const eye =
        getElement(eyeId);

    const password =
        getElement(passwordId);


    if (!eye || !password) {
        return;
    }


    eye.addEventListener(
        "click",
        () => {

            if (
                password.type ===
                "password"
            ) {

                password.type =
                    "text";

                eye.textContent =
                    "🙈";

            } else {

                password.type =
                    "password";

                eye.textContent =
                    "👁️";
            }

        }
    );
}


setupPasswordToggle(
    "loginEye",
    "loginPassword"
);

setupPasswordToggle(
    "registerEye",
    "registerPassword"
);

setupPasswordToggle(
    "confirmEye",
    "confirmPassword"
);


/* =========================================================
   PASSWORD STRENGTH
   ========================================================= */

const registerPassword =
    getElement("registerPassword");

const strengthBar =
    getElement("strengthBar");

const strengthText =
    getElement("strengthText");


if (registerPassword) {

    registerPassword.addEventListener(
        "input",
        () => {

            const password =
                registerPassword.value;


            if (!password) {

                if (strengthBar) {
                    strengthBar.style.width =
                        "0%";
                }

                if (strengthText) {
                    strengthText.textContent =
                        "Password strength";
                }

                return;
            }


            let score = 0;


            if (password.length >= 6) {
                score++;
            }

            if (password.length >= 10) {
                score++;
            }

            if (/[A-Z]/.test(password)) {
                score++;
            }

            if (/[0-9]/.test(password)) {
                score++;
            }

            if (/[^A-Za-z0-9]/.test(password)) {
                score++;
            }


            const percentage =
                Math.min(
                    score * 20,
                    100
                );


            if (strengthBar) {

                strengthBar.style.width =
                    percentage + "%";
            }


            if (strengthText) {

                if (score <= 1) {

                    strengthText.textContent =
                        "Weak password";

                } else if (score <= 3) {

                    strengthText.textContent =
                        "Medium password";

                } else {

                    strengthText.textContent =
                        "Strong password";
                }
            }

        }
    );
}


/* =========================================================
   REGISTER
   ========================================================= */

const registerForm =
    getElement("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                getElement(
                    "registerName"
                )?.value.trim();


            const email =
                getElement(
                    "registerEmail"
                )?.value.trim();


            const role =
                document.querySelector(
                    'input[name="role"]:checked'
                )?.value;


            const password =
                getElement(
                    "registerPassword"
                )?.value;


            const confirmPasswordValue =
                getElement(
                    "confirmPassword"
                )?.value;


            /* -------------------------
               VALIDATION
            ------------------------- */

            if (!name) {

                showMessage(
                    "Please enter your full name.",
                    "error"
                );

                return;
            }


            if (!email) {

                showMessage(
                    "Please enter your email.",
                    "error"
                );

                return;
            }


            if (!role) {

                showMessage(
                    "Please select your role.",
                    "error"
                );

                return;
            }


            if (password !== confirmPasswordValue) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "Password should be at least 6 characters.",
                    "error"
                );

                return;
            }


            try {

                /* -------------------------
                   CREATE FIREBASE ACCOUNT
                ------------------------- */

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                /* -------------------------
                   SAVE PROFILE
                ------------------------- */

                await setDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    ),
                    {

                        name: name,

                        email: email,

                        role: role,

                        /*
                           New users start with
                           zero career data.
                        */

                        skills: [],

                        projects: [],

                        certificates: [],

                        education: null,

                        resumeUploaded: false,

                        matchScore: 0,

                        createdAt:
                            serverTimestamp()

                    }
                );


                /* -------------------------
                   SAVE CURRENT USER
                ------------------------- */

                saveCurrentUser({

                    uid: user.uid,

                    name: name,

                    email: email,

                    role: role

                });


                console.log(
                    "Use
