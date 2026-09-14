// ============================================
// FAST-TRACK | Firebase Authentication
// Login + Register + Google + Forgot Password
// Logout + Session Management
// ============================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    setPersistence,
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
// FORCE SESSION-ONLY LOGIN
// ============================================
// Login will remain only while the browser session
// is active.
//
// Browser close → Firebase session ends.
// Reopen → user must login again.
//
// ============================================

setPersistence(
    auth,
    browserSessionPersistence
).catch((error) => {

    console.error(
        "Persistence error:",
        error
    );

});


// ============================================
// ELEMENTS
// ============================================

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginGoogle =
    document.getElementById("loginGoogle");

const registerGoogle =
    document.getElementById("registerGoogle");

const forgotButton =
    document.getElementById("forgotButton");

const goRegister =
    document.getElementById("goRegister");

const goLogin =
    document.getElementById("goLogin");


// ============================================
// TOAST
// ============================================

function showToast(
    message,
    type = "info"
) {

    let toast =
        document.getElementById(
            "fastTrackToast"
        );

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id =
            "fastTrackToast";

        toast.style.position =
            "fixed";

        toast.style.top =
            "25px";

        toast.style.right =
            "25px";

        toast.style.zIndex =
            "99999";

        toast.style.padding =
            "14px 20px";

        toast.style.borderRadius =
            "12px";

        toast.style.background =
            "#111827";

        toast.style.color =
            "white";

        toast.style.fontSize =
            "14px";

        toast.style.fontWeight =
            "600";

        toast.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.2)";

        toast.style.transition =
            "all 0.3s ease";

        document.body.appendChild(
            toast
        );
    }

    toast.textContent =
        message;

    if (type === "success") {

        toast.style.background =
            "#16a34a";

    } else if (type === "error") {

        toast.style.background =
            "#dc2626";

    } else {

        toast.style.background =
            "#111827";
    }

    toast.style.opacity = "1";

    clearTimeout(
        window.fastTrackToastTimer
    );

    window.fastTrackToastTimer =
        setTimeout(() => {

            toast.style.opacity =
                "0";

        }, 3000);
}


// ============================================
// SAVE USER DATA
// ============================================

function saveUserData(
    user,
    role = "Job Seeker"
) {

    const userData = {

        uid: user.uid,

        name:
            user.displayName || "",

        email:
            user.email || "",

        role:
            role || "Job Seeker"
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

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const emailInput =
                document.getElementById(
                    "loginEmail"
                );

            const passwordInput =
                document.getElementById(
                    "loginPassword"
                );


            const email =
                emailInput?.value.trim();

            const password =
                passwordInput?.value;


            if (!email || !password) {

                showToast(
                    "Please enter email and password.",
                    "error"
                );

                return;
            }


            try {

                // ALWAYS SESSION PERSISTENCE
                await setPersistence(
                    auth,
                    browserSessionPersistence
                );


                const result =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    result.user;


                // Get Firestore profile

                let role =
                    "Job Seeker";


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


                saveUserData(
                    user,
                    role
                );


                showToast(
                    "Login successful! 🚀",
                    "success"
                );


                setTimeout(() => {

                    window.location.replace(
                        "dashboard.html"
                    );

                }, 700);

            } catch (error) {

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

                } else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "No account found with this email.";

                } else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    message =
                        "Incorrect password.";

                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Invalid email address.";
                }


                showToast(
                    message,
                    "error"
                );
            }
        }
    );
}


// ============================================
// REGISTER
// ============================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const nameInput =
                document.getElementById(
                    "registerName"
                );

            const emailInput =
                document.getElementById(
                    "registerEmail"
                );

            const passwordInput =
                document.getElementById(
                    "registerPassword"
                );

            const confirmInput =
                document.getElementById(
                    "confirmPassword"
                );


            const name =
                nameInput?.value.trim();

            const email =
                emailInput?.value.trim();

            const password =
                passwordInput?.value;

            const confirmPassword =
                confirmInput?.value;


            // Get selected role

            const selectedRole =
                document.querySelector(
                    'input[name="role"]:checked'
                );


            const role =
                selectedRole?.value ||
                "Job Seeker";


            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                showToast(
                    "Please fill all required fields.",
                    "error"
                );

                return;
            }


            if (
                password.length < 6
            ) {

                showToast(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showToast(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            try {

                // Register account

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    result.user;


                // Set name

                await updateProfile(
                    user,
                    {
                        displayName:
                            name
                    }
                );


                // Save Firestore profile

                await setDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    ),
                    {
                        uid:
                            user.uid,

                        name:
                            name,

                        email:
                            email,

                        role:
                            role,

                        profileCompleted:
                            false,

                        createdAt:
                            serverTimestamp()
                    }
                );


                saveUserData(
                    user,
                    role
                );


                showToast(
                    "Account created successfully! 🎉",
                    "success"
                );


                setTimeout(() => {

                    window.location.replace(
                        "dashboard.html"
                    );

                }, 700);

            } catch (error) {

                console.error(
                    "Registration error:",
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

                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Invalid email address.";

                } else if (
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
}


// ============================================
// TAB SWITCHING
// ============================================

function showLogin() {

    loginTab?.classList.add(
        "active"
    );

    registerTab?.classList.remove(
        "active"
    );


    const loginBox =
        document.getElementById(
            "loginBox"
        );

    const registerBox =
        document.getElementById(
            "registerBox"
        );


    loginBox?.classList.add(
        "active"
    );

    registerBox?.classList.remove(
        "active"
    );


    // Also support forms using active class

    loginForm?.classList.add(
        "active"
    );

    registerForm?.classList.remove(
        "active"
    );
}


function showRegister() {

    registerTab?.classList.add(
        "active"
    );

    loginTab?.classList.remove(
        "active"
    );


    const loginBox =
        document.getElementById(
            "loginBox"
        );

    const registerBox =
        document.getElementById(
            "registerBox"
        );


    registerBox?.classList.add(
        "active"
    );

    loginBox?.classList.remove(
        "active"
    );


    // Also support forms using active class

    registerForm?.classList.add(
        "active"
    );

    loginForm?.classList.remove(
        "active"
    );
}


loginTab?.addEventListener(
    "click",
    showLogin
);


registerTab?.addEventListener(
    "click",
    showRegister
);


goRegister?.addEventListener(
    "click",
    showRegister
);


goLogin?.addEventListener(
    "click",
    showLogin
);


// ============================================
// GOOGLE LOGIN
// ============================================

async function googleSignIn() {

    try {

        // ALWAYS SESSION ONLY

        await setPersistence(
            auth,
            browserSessionPersistence
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


        const user =
            result.user;


        let role =
            "Job Seeker";


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

                role =
                    userDoc.data().role ||
                    "Job Seeker";

            } else {

                await setDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    ),
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

        } catch (error) {

            console.log(
                "Google profile error:",
                error
            );
        }


        saveUserData(
            user,
            role
        );


        showToast(
            "Google login successful! 🚀",
            "success"
        );


        setTimeout(() => {

            window.location.replace(
                "dashboard.html"
            );

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


loginGoogle?.addEventListener(
    "click",
    googleSignIn
);


registerGoogle?.addEventListener(
    "click",
    googleSignIn
);


// ============================================
// FORGOT PASSWORD
// ============================================

const forgotModal =
    document.getElementById(
        "forgotModal"
    );

const resetForm =
    document.getElementById(
        "resetForm"
    );

const cancelForgot =
    document.getElementById(
        "cancelForgot"
    );


forgotButton?.addEventListener(
    "click",
    () => {

        if (forgotModal) {

            forgotModal.style.display =
                "flex";
        }

    }
);


cancelForgot?.addEventListener(
    "click",
    () => {

        if (forgotModal) {

            forgotModal.style.display =
                "none";
        }

    }
);


forgotModal?.addEventListener(
    "click",
    (e) => {

        if (
            e.target ===
            forgotModal
        ) {

            forgotModal.style.display =
                "none";
        }

    }
);


if (resetForm) {

    resetForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const resetEmail =
                document.getElementById(
                    "resetEmail"
                );


            const email =
                resetEmail?.value.trim();


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


                showToast(
                    "Password reset email sent! 📧",
                    "success"
                );


                if (forgotModal) {

                    forgotModal.style.display =
                        "none";
                }


            } catch (error) {

                console.error(
                    "Reset password error:",
                    error
                );


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
    ".p
