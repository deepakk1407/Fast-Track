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
const googleProvider = new GoogleAuthProvider();


/* =========================
   ELEMENTS
========================= */

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

const toast = document.getElementById("toast");


/* =========================
   LOGIN ELEMENTS
========================= */

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginEye = document.getElementById("loginEye");
const loginGoogle = document.getElementById("loginGoogle");


/* =========================
   REGISTER ELEMENTS
========================= */

const registerForm = document.getElementById("registerForm");
const registerButton = document.getElementById("registerButton");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const terms = document.getElementById("terms");

const registerEye =
    document.getElementById("registerEye");

const confirmEye =
    document.getElementById("confirmEye");


/* =========================
   FORGOT PASSWORD
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
   TOAST MESSAGE
========================= */

function showToast(message, type = "success") {

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;

    if (type === "error") {
        toast.style.background = "#dc2626";
    } else {
        toast.style.background = "#111827";
    }

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 5000);
}


/* =========================
   LOGIN / REGISTER TABS
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


/* =========================
   LOGIN PASSWORD SHOW/HIDE
========================= */

if (loginEye) {

    loginEye.addEventListener("click", () => {

        if (loginPassword.type === "password") {

            loginPassword.type = "text";
            loginEye.textContent = "🙈";

        } else {

            loginPassword.type = "password";
            loginEye.textContent = "👁";

        }

    });

}


/* =========================
   REGISTER PASSWORD SHOW/HIDE
========================= */

if (registerEye) {

    registerEye.addEventListener("click", () => {

        if (registerPassword.type === "password") {

            registerPassword.type = "text";
            registerEye.textContent = "🙈";

        } else {

            registerPassword.type = "password";
            registerEye.textContent = "👁";

        }

    });

}


/* =========================
   CONFIRM PASSWORD SHOW/HIDE
========================= */

if (confirmEye) {

    confirmEye.addEventListener("click", () => {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";
            confirmEye.textContent = "🙈";

        } else {

            confirmPassword.type = "password";
            confirmEye.textContent = "👁";

        }

    });

}


/* =========================
   FORGOT PASSWORD MODAL
========================= */

if (forgotButton) {

    forgotButton.addEventListener("click", () => {

        forgotModal.classList.add("active");

        if (loginEmail) {
            resetEmail.value = loginEmail.value.trim();
        }

        setTimeout(() => {

            if (resetEmail) {
                resetEmail.focus();
            }

        }, 100);

    });

}


/* =========================
   CLOSE FORGOT MODAL
========================= */

if (cancelForgot) {

    cancelForgot.addEventListener("click", () => {

        forgotModal.classList.remove("active");

    });

}


if (forgotModal) {

    forgotModal.addEventListener("click", (event) => {

        if (event.target === forgotModal) {

            forgotModal.classList.remove("active");

        }

    });

}


/* =========================
   SEND PASSWORD RESET EMAIL
========================= */

if (resetForm) {

    resetForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = resetEmail.value.trim();

        if (!email) {

            showToast(
                "Please enter your email address.",
                "error"
            );

            return;
        }


        const resetButton =
            resetForm.querySelector(".primary-btn");


        if (resetButton) {

            resetButton.disabled = true;
            resetButton.textContent = "Sending...";

        }


        try {

            await sendPasswordResetEmail(auth, email);

            showToast(
                "📧 Password reset link sent! Check your email."
            );

            resetForm.reset();

            forgotModal.classList.remove("active");

        } catch (error) {

            console.error(
                "PASSWORD RESET ERROR:",
                error
            );


            if (error.code === "auth/user-not-found") {

                showToast(
                    "No account found with this email.",
                    "error"
                );

            } else if (error.code === "auth/invalid-email") {

                showToast(
                    "Please enter a valid email.",
                    "error"
                );

            } else if (error.code === "auth/too-many-requests") {

                showToast(
                    "Too many requests. Please try again later.",
                    "error"
                );

            } else {

                showToast(
                    "Unable to send reset email. Please try again.",
                    "error"
                );

            }

        } finally {

            if (resetButton) {

                resetButton.disabled = false;
                resetButton.textContent = "Send Reset Link";

            }

        }

    });

}


/* =========================
   GOOGLE LOGIN
========================= */

if (loginGoogle) {

    loginGoogle.addEventListener("click", async function () {

        loginGoogle.disabled = true;

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
                    error.code +
                    " | " +
                    error.message,
                    "error"
                );

            }


        } finally {

            loginGoogle.disabled = false;

            loginGoogle.innerHTML =
                originalText;

        }

    });

}


/* =========================
   EMAIL LOGIN
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


            const loginButton =
                loginForm.querySelector(
                    ".primary-btn"
                );


            if (loginButton) {

                loginButton.disabled = true;
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

                    loginButton.disabled = false;
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


            if (!name) {

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


            if (password.length < 6) {

                showToast(
                    "Password must be at least 6 characters.",
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


            if (!terms.checked) {

                showToast(
                    "Please accept Terms & Conditions.",
                    "error"
                );

                return;
            }


            registerButton.disabled = true;

            registerButton.textContent =
                "Creating Account...";


            try {

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                await updateProfile(
                    result.user,
                    {
                        displayName: name
                    }
                );


                console.log(
                    "REGISTER SUCCESS:",
                    result.user
                );


                showToast(
                    "🎉 Account created successfully!"
                );


                registerForm.reset();


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

                registerButton.disabled = false;

                registerButton.textContent =
                    "Create Account";

            }

        }
    );

}
