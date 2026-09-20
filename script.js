import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecto",
    authDomain: "fast-track-6d262.firebaseapp.com",
    projectId: "fast-track-6d262",
    storageBucket: "fast-track-6d262.firebasestorage.app",
    messagingSenderId: "338934873510",
    appId: "1:338934873510:web:1ad3791207107af183a367",
    measurementId: "G-M6FSRH2Y9H"
};


/* =========================
   INITIALIZE FIREBASE
========================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


/* =========================
   GOOGLE PROVIDER
========================= */

const googleProvider =
    new GoogleAuthProvider();


/* =========================
   ELEMENTS
========================= */

/* Tabs */

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");


/* Boxes */

const loginBox =
    document.getElementById("loginBox");

const registerBox =
    document.getElementById("registerBox");


/* Switch buttons */

const goRegister =
    document.getElementById("goRegister");

const goLogin =
    document.getElementById("goLogin");


/* Toast */

const toast =
    document.getElementById("toast");


/* =========================
   LOGIN ELEMENTS
========================= */

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginEye =
    document.getElementById("loginEye");

const loginGoogle =
    document.getElementById("loginGoogle");


/* =========================
   REGISTER ELEMENTS
========================= */

const registerForm =
    document.getElementById("registerForm");

const registerButton =
    document.getElementById("registerButton");

const registerName =
    document.getElementById("registerName");

const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const terms =
    document.getElementById("terms");

const registerEye =
    document.getElementById("registerEye");

const confirmEye =
    document.getElementById("confirmEye");


/* Role */

const jobSeeker =
    document.getElementById("jobSeeker");

const recruiter =
    document.getElementById("recruiter");


/* Google Register */

const registerGoogle =
    document.getElementById("registerGoogle");


/* =========================
   FORGOT PASSWORD ELEMENTS
========================= */

const forgotButton =
    document.getElementById("forgotButton");

const forgotModal =
    document.getElementById("forgotModal");

const cancelForgot =
    document.getElementById("cancelForgot");

const resetForm =
    document.getElementById("resetForm");

const resetEmail =
    document.getElementById("resetEmail");


/* =========================
   CHECK ELEMENTS
========================= */

console.log(
    "FAST-TRACK script loaded successfully."
);

console.log(
    "Forgot button:",
    forgotButton
);

console.log(
    "Forgot modal:",
    forgotModal
);


/* =========================
   TOAST
========================= */

function showToast(
    message,
    type = "success"
) {

    if (!toast) {

        alert(message);

        return;
    }


    toast.textContent =
        message;


    toast.style.background =
        type === "error"
            ? "#dc2626"
            : "#111827";


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 5000);
}


/* =========================
   TAB SWITCHING
========================= */

function showLogin() {

    if (!loginTab ||
        !registerTab ||
        !loginBox ||
        !registerBox) {

        return;
    }


    loginTab.classList.add(
        "active"
    );

    registerTab.classList.remove(
        "active"
    );


    loginBox.classList.add(
        "active"
    );

    registerBox.classList.remove(
        "active"
    );
}


function showRegister() {

    if (!loginTab ||
        !registerTab ||
        !loginBox ||
        !registerBox) {

        return;
    }


    registerTab.classList.add(
        "active"
    );

    loginTab.classList.remove(
        "active"
    );


    registerBox.classList.add(
        "active"
    );

    loginBox.classList.remove(
        "active"
    );
}


/* Tab events */

if (loginTab) {

    loginTab.addEventListener(
        "click",
        showLogin
    );
}


if (registerTab) {

    registerTab.addEventListener(
        "click",
        showRegister
    );
}


if (goRegister) {

    goRegister.addEventListener(
        "click",
        showRegister
    );
}


if (goLogin) {

    goLogin.addEventListener(
        "click",
        showLogin
    );
}


/* =========================
   PASSWORD SHOW / HIDE
========================= */

/* LOGIN PASSWORD */

if (
    loginEye &&
    loginPassword
) {

    loginEye.addEventListener(
        "click",
        () => {

            if (
                loginPassword.type ===
                "password"
            ) {

                loginPassword.type =
                    "text";

                loginEye.textContent =
                    "🙈";

            } else {

                loginPassword.type =
                    "password";

                loginEye.textContent =
                    "👁";
            }

        }
    );
}


/* REGISTER PASSWORD */

if (
    registerEye &&
    registerPassword
) {

    registerEye.addEventListener(
        "click",
        () => {

            if (
                registerPassword.type ===
                "password"
            ) {

                registerPassword.type =
                    "text";

                registerEye.textContent =
                    "🙈";

            } else {

                registerPassword.type =
                    "password";

                registerEye.textContent =
                    "👁";
            }

        }
    );
}


/* CONFIRM PASSWORD */

if (
    confirmEye &&
    confirmPassword
) {

    confirmEye.addEventListener(
        "click",
        () => {

            if (
                confirmPassword.type ===
                "password"
            ) {

                confirmPassword.type =
                    "text";

                confirmEye.textContent =
                    "🙈";

            } else {

                confirmPassword.type =
                    "password";

                confirmEye.textContent =
                    "👁";
            }

        }
    );
}


/* =================================================
   FORGOT PASSWORD
   OPEN MODAL
================================================= */

if (
    forgotButton &&
    forgotModal
) {

    forgotButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            console.log(
                "FORGOT PASSWORD BUTTON CLICKED"
            );


            /*
             * Show modal directly.
             * This avoids problems if CSS
             * active class is missing.
             */

            forgotModal.style.display =
                "flex";


            forgotModal.classList.add(
                "active"
            );


            forgotModal.setAttribute(
                "aria-hidden",
                "false"
            );


            /*
             * Copy login email automatically.
             */

            if (
                loginEmail &&
                resetEmail
            ) {

                resetEmail.value =
                    loginEmail.value.trim();
            }


            /*
             * Focus email field.
             */

            setTimeout(() => {

                if (resetEmail) {

                    resetEmail.focus();
                }

            }, 100);

        }
    );

} else {

    console.error(
        "Forgot Password elements not found!"
    );
}


/* =================================================
   FORGOT PASSWORD
   CLOSE MODAL
================================================= */

if (
    cancelForgot &&
    forgotModal
) {

    cancelForgot.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            forgotModal.style.display =
                "none";


            forgotModal.classList.remove(
                "active"
            );


            forgotModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );
}


/* =================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
================================================= */

if (forgotModal) {

    forgotModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                forgotModal
            ) {

                forgotModal.style.display =
                    "none";


                forgotModal.classList.remove(
                    "active"
                );


                forgotModal.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );
}


/* =================================================
   SEND PASSWORD RESET EMAIL
================================================= */

if (resetForm) {

    resetForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                resetEmail.value.trim();


            /* Check email */

            if (!email) {

                showToast(
                    "Please enter your email address.",
                    "error"
                );

                return;
            }


            /*
             * Get reset button.
             */

            const resetButton =
                resetForm.querySelector(
                    ".primary-btn"
                );


            if (resetButton) {

                resetButton.disabled =
                    true;

                resetButton.textContent =
                    "Sending...";
            }


            try {

                /*
                 * Firebase password
                 * reset email.
                 */

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                console.log(
                    "PASSWORD RESET EMAIL SENT"
                );


                showToast(
                    "📧 Password reset link sent! Check your email."
                );


                /*
                 * Clear form.
                 */

                resetForm.reset();


                /*
                 * Close modal.
                 */

                forgotModal.style.display =
                    "none";


                forgotModal.classList.remove(
                    "active"
                );


                forgotModal.setAttribute(
                    "aria-hidden",
                    "true"
                );


            } catch (error) {

                console.error(
                    "PASSWORD RESET ERROR:",
                    error
                );


                if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    showToast(
                        "Please enter a valid email.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    showToast(
                        "No account found with this email.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    showToast(
                        "Too many requests. Please try again later.",
                        "error"
                    );


                } else {

                    showToast(
                        "Unable to send reset link. Please try again.",
                        "error"
                    );
                }

            } finally {

                if (resetButton) {

                    resetButton.disabled =
                        false;

                    resetButton.textContent =
                        "Send Reset Link";
                }

            }

        }
    );
}


/* =========================
   GOOGLE LOGIN
========================= */

if (loginGoogle) {

    loginGoogle.addEventListener(
        "click",
        async function () {

            loginGoogle.disabled =
                true;


            const originalText =
                loginGoogle.innerHTML;


            loginGoogle.innerHTML =
                "Signing in with Google...";


            try {

                const result =
                    await signInWithPopup(
                        auth,
                        googleProvider
                    );


                console.log(
                    "GOOGLE LOGIN SUCCESS:",
                    result.user
                );


                showToast(
                    "🎉 Google login successful!"
                );


                setTimeout(() => {

                    window.location.href =
                        "./dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "GOOGLE LOGIN ERROR:",
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


                } else if (
                    error.code ===
                    "auth/popup-blocked"
                ) {

                    showToast(
                        "Google popup was blocked. Please allow popups.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/account-exists-with-different-credential"
                ) {

                    showToast(
                        "This email already has an account with another login method.",
                        "error"
                    );


                } else {

                    showToast(
                        "Google login failed. Please try again.",
                        "error"
                    );
                }

            } finally {

                loginGoogle.disabled =
                    false;


                loginGoogle.innerHTML =
                    originalText;
            }

        }
    );
}


/* =========================
   GOOGLE REGISTER
========================= */

if (registerGoogle) {

    registerGoogle.addEventListener(
        "click",
        async function () {

            registerGoogle.disabled =
                true;


            const originalText =
                registerGoogle.innerHTML;


            registerGoogle.innerHTML =
                "Connecting to Google...";


            try {

                const result =
                    await signInWithPopup(
                        auth,
                        googleProvider
                    );


                console.log(
                    "GOOGLE REGISTER SUCCESS:",
                    result.user
                );


                showToast(
                    "🎉 Google account connected!"
                );


                setTimeout(() => {

                    window.location.href =
                        "./dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "GOOGLE REGISTER ERROR:",
                    error
                );


                if (
                    error.code ===
                    "auth/popup-closed-by-user"
                ) {

                    showToast(
                        "Google registration was cancelled.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/popup-blocked"
                ) {

                    showToast(
                        "Google popup was blocked.",
                        "error"
                    );


                } else {

                    showToast(
                        "Google registration failed. Please try again.",
                        "error"
                    );
                }

            } finally {

                registerGoogle.disabled =
                    false;


                registerGoogle.innerHTML =
                    originalText;
            }

        }
    );
}


/* =========================
   LOGIN
========================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                loginEmail.value.trim();


            const password =
                loginPassword.value;


            /* EMAIL */

            if (!email) {

                showToast(
                    "Please enter your email.",
                    "error"
                );

                return;
            }


            /* PASSWORD */

            if (!password) {

                showToast(
                    "Please enter your password.",
                    "error"
                );

                return;
            }


            const loginButton =
                loginForm.querySelector(
                    ".primary-btn"
                );


            if (loginButton) {

                loginButton.disabled =
                    true;

                loginButton.textContent =
                    "Logging in...";
            }


            try {

                const result =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                console.log(
                    "LOGIN SUCCESS:",
                    result.user
                );


                showToast(
                    "🎉 Login successful!"
                );


                setTimeout(() => {

                    window.location.href =
                        "./dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    showToast(
                        "Invalid email or password.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    showToast(
                        "No account found with this email.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    showToast(
                        "Incorrect password.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    showToast(
                        "Please enter a valid email.",
                        "error"
                    );


                } else {

                    showToast(
                        error.code +
                        " | " +
                        error.message,
                        "error"
                    );
                }

            } finally {

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "Login";
                }

            }

        }
    );
}


/* =========================
   REGISTER
========================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                registerName.value.trim();


            const email =
                registerEmail.value.trim();


            const password =
                registerPassword.value;


            const confirm =
                confirmPassword.value;


            /* NAME */

            if (!name) {

                showToast(
                    "Please enter your full name.",
                    "error"
                );

                return;
            }


            /* EMAIL */

            if (!email) {

                showToast(
                    "Please enter your email.",
                    "error"
                );

                return;
            }


            /* PASSWORD */

            if (
                password.length < 6
            ) {

                showToast(
                    "Password must be at least 6 characters.",
                    "error"
                );

                return;
            }


            /* CONFIRM PASSWORD */

            if (
                password !== confirm
            ) {

                showToast(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            /* TERMS */

            if (
                !terms.checked
            ) {

                showToast(
                    "Please accept Terms & Conditions.",
                    "error"
                );

                return;
            }


            if (registerButton) {

                registerButton.disabled =
                    true;

                registerButton.textContent =
                    "Creating Account...";
            }


            try {

                /*
                 * Create Firebase account.
                 */

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                /*
                 * Save display name.
                 */

                await updateProfile(
                    result.user,
                    {
                        displayName:
                            name
                    }
                );


                console.log(
                    "REGISTER SUCCESS:",
                    result.user
                );


                /*
                 * Get selected role.
                 * Currently used only for
                 * validation/logging.
                 */

                const selectedRole =
                    recruiter &&
                    recruiter.checked
                        ? "Recruiter"
                        : "Job Seeker";


                console.log(
                    "SELECTED ROLE:",
                    selectedRole
                );


                showToast(
                    "🎉 Account created successfully!"
                );


                /*
                 * Reset register form.
                 */

                registerForm.reset();


                /*
                 * Return to login.
                 */

                setTimeout(() => {

                    showLogin();

                }, 1500);


            } catch (error) {

                console.error(
                    "REGISTER ERROR:",
                    error
                );


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    showToast(
                        "This email is already registered.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    showToast(
                        "Please enter a valid email.",
                        "error"
                    );


                } else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    showToast(
                        "Password is too weak.",
                        "error"
                    );


                } else {

                    showToast(
                        error.code +
                        " | " +
                        error.message,
                        "error"
                    );
                }

            } finally {

                if (registerButton) {

                    registerButton.disabled =
                        false;

                    registerButton.textContent =
                        "Create Account";
                }

            }

        }
    );
}
