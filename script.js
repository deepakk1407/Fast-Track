// ============================================
// FAST-TRACK | Firebase Authentication
// Login + Register + Google + Forgot Password
// Logout + Session Management
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================
// FIREBASE CONFIG
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecta",
    authDomain: "fast-track-6d262.firebaseapp.com",
    projectId: "fast-track-6d262",
    storageBucket: "fast-track-6d262.firebasestorage.app",
    messagingSenderId: "338934873510",
    appId: "1:338934873510:web:16b3211577dd2ce683a367",
    measurementId: "G-9TFBXV2PQM"
};


// ============================================
// INITIALIZE FIREBASE
// ============================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ============================================
// ELEMENTS
// ============================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const googleLoginBtn = document.getElementById("googleLoginBtn");

const forgotPassword = document.getElementById("forgotPassword");


// ============================================
// TOAST MESSAGE
// ============================================

function showToast(message, type = "info") {

    let toast = document.getElementById("fastTrackToast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "fastTrackToast";

        toast.style.position = "fixed";
        toast.style.top = "25px";
        toast.style.right = "25px";
        toast.style.zIndex = "99999";
        toast.style.padding = "14px 20px";
        toast.style.borderRadius = "12px";
        toast.style.background = "#111827";
        toast.style.color = "white";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "600";
        toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
        toast.style.transition = "all 0.3s ease";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    if (type === "success") {
        toast.style.background = "#16a34a";
    } else if (type === "error") {
        toast.style.background = "#dc2626";
    } else {
        toast.style.background = "#111827";
    }

    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 3000);
}


// ============================================
// SAVE USER DATA
// ============================================

function saveUserData(user, role = "") {

    const userData = {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        role: role || "Job Seeker"
    };

    localStorage.setItem(
        "fastTrackUser",
        JSON.stringify(userData)
    );
}


// ============================================
// LOGIN
// ============================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const emailInput =
            document.getElementById("loginEmail");

        const passwordInput =
            document.getElementById("loginPassword");

        const rememberMe =
            document.getElementById("rememberMe");

        const email = emailInput?.value.trim();
        const password = passwordInput?.value;

        if (!email || !password) {

            showToast(
                "Please enter email and password",
                "error"
            );

            return;
        }

        try {

            // Remember me
            if (rememberMe && rememberMe.checked) {

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


            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = result.user;


            // Get profile from Firestore
            let role = "Job Seeker";

            try {

                const userDoc = await getDoc(
                    doc(db, "users", user.uid)
                );

                if (userDoc.exists()) {

                    role =
                        userDoc.data().role ||
                        "Job Seeker";
                }

            } catch (error) {

                console.log(
                    "Profile fetch skipped:",
                    error
                );
            }


            saveUserData(user, role);

            showToast(
                "Login successful! 🚀",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 700);


        } catch (error) {

            console.error(error);

            let message =
                "Login failed. Please try again.";

            if (error.code === "auth/invalid-credential") {

                message =
                    "Invalid email or password.";

            } else if (error.code === "auth/user-not-found") {

                message =
                    "No account found with this email.";

            } else if (error.code === "auth/wrong-password") {

                message =
                    "Incorrect password.";

            } else if (error.code === "auth/invalid-email") {

                message =
                    "Invalid email address.";

            }

            showToast(message, "error");
        }

    });
}


// ============================================
// REGISTER
// ============================================

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const nameInput =
            document.getElementById("registerName");

        const emailInput =
            document.getElementById("registerEmail");

        const passwordInput =
            document.getElementById("registerPassword");

        const roleInput =
            document.getElementById("registerRole");


        const name =
            nameInput?.value.trim();

        const email =
            emailInput?.value.trim();

        const password =
            passwordInput?.value;

        const role =
            roleInput?.value || "Job Seeker";


        if (!name || !email || !password) {

            showToast(
                "Please fill all required fields.",
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


        try {

            const result =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = result.user;


            // Set display name
            await updateProfile(user, {
                displayName: name
            });


            // Save user profile
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


            saveUserData(user, role);


            showToast(
                "Account created successfully! 🎉",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 700);


        } catch (error) {

            console.error(error);

            let message =
                "Registration failed.";

            if (error.code === "auth/email-already-in-use") {

                message =
                    "This email is already registered.";

            } else if (error.code === "auth/invalid-email") {

                message =
                    "Invalid email address.";

            } else if (error.code === "auth/weak-password") {

                message =
                    "Password is too weak.";

            }

            showToast(message, "error");
        }

    });
}


// ============================================
// LOGIN / REGISTER TABS
// ============================================

if (loginTab && registerTab) {

    loginTab.addEventListener("click", () => {

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        if (loginForm) {
            loginForm.classList.add("active");
        }

        if (registerForm) {
            registerForm.classList.remove("active");
        }
    });


    registerTab.addEventListener("click", () => {

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        if (registerForm) {
            registerForm.classList.add("active");
        }

        if (loginForm) {
            loginForm.classList.remove("active");
        }
    });
}


// ============================================
// GOOGLE SIGN-IN
// ============================================

if (googleLoginBtn) {

    googleLoginBtn.addEventListener(
        "click",
        async () => {

            try {

                const provider =
                    new GoogleAuthProvider();


                const result =
                    await signInWithPopup(
                        auth,
                        provider
                    );


                const user = result.user;


                // Check existing Firestore profile
                let role = "Job Seeker";

                try {

                    const userDoc =
                        await getDoc(
                            doc(db, "users", user.uid)
                        );

                    if (userDoc.exists()) {

                        role =
                            userDoc.data().role ||
                            "Job Seeker";

                    } else {

                        // Create profile for first Google login
                        await setDoc(
                            doc(db, "users", user.uid),
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

                } catch (error) {

                    console.log(
                        "Google profile error:",
                        error
                    );
                }


                saveUserData(user, role);


                showToast(
                    "Google login successful! 🚀",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            } catch (error) {

                console.error(
                    "Google Login Error:",
                    error
                );


                if (
                    error.code ===
                    "auth/popup-closed-by-user"
                ) {

                    showToast(
                        "Google login cancelled.",
                        "error"
                    );

                } else {

                    showToast(
                        "Google login failed.",
                        "error"
                    );
                }
            }
        }
    );
}


// ============================================
// FORGOT PASSWORD
// ============================================

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async (e) => {

            e.preventDefault();


            const emailInput =
                document.getElementById("loginEmail");

            const email =
                emailInput?.value.trim();


            if (!email) {

                showToast(
                    "Enter your email first.",
                    "error"
                );

                return;
            }


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                showToast(
                    "Password reset email sent! 📧",
                    "success"
                );


            } catch (error) {

                console.error(error);

                showToast(
                    "Unable to send reset email.",
                    "error"
                );
            }
        }
    );
}


// ============================================
// PASSWORD SHOW / HIDE
// ============================================

document.querySelectorAll(
    ".password-toggle"
).forEach((button) => {

    button.addEventListener("click", () => {

        const input =
            button.parentElement.querySelector(
                "input"
            );

        if (!input) return;


        if (input.type === "password") {

            input.type = "text";

            button.textContent = "🙈";

        } else {

            input.type = "password";

            button.textContent = "👁";
        }
    });
});


// ============================================
// LOGOUT FUNCTION
// ============================================

async function logoutUser() {

    try {

        // Firebase logout
        await signOut(auth);

    } catch (error) {

        console.error(
            "Firebase logout error:",
            error
        );

    } finally {

        // Remove saved login information
        localStorage.removeItem(
            "fastTrackUser"
        );

        // Also clear session storage
        sessionStorage.clear();

        // Go back to login page
        window.location.replace(
            "index.html"
        );
    }
}


// ============================================
// LOGOUT BUTTON
// ============================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            await logoutUser();

        }
    );
}


// ============================================
// MAKE LOGOUT AVAILABLE GLOBALLY
// ============================================

window.logoutUser = logoutUser;


// ============================================
// AUTH STATE
// ============================================

onAuthStateChanged(
    auth,
    (user) => {

        // IMPORTANT:
        // Don't automatically redirect
        // from index.html.
        //
        // This allows the user to stay on
        // the login page and manually login.

        if (user) {

            console.log(
                "Firebase user:",
                user.email
            );

        } else {

            console.log(
                "No Firebase user logged in."
            );
        }
    }
);


// ============================================
// FINISHED
// ============================================

console.log(
    "FAST-TRACK Authentication JS Loaded 🚀"
);
