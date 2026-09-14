/* =========================================================
   FAST-TRACK | AUTHENTICATION
   UI FIRST + FIREBASE AUTH
========================================================= */


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("FAST-TRACK script loaded");


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");

    const goRegister = document.getElementById("goRegister");
    const goLogin = document.getElementById("goLogin");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginEye = document.getElementById("loginEye");
    const registerEye = document.getElementById("registerEye");
    const confirmEye = document.getElementById("confirmEye");

    const forgotButton = document.getElementById("forgotButton");
    const forgotModal = document.getElementById("forgotModal");
    const cancelForgot = document.getElementById("cancelForgot");
    const resetForm = document.getElementById("resetForm");

    const registerPassword =
        document.getElementById("registerPassword");

    const strengthBar =
        document.getElementById("strengthBar");

    const strengthText =
        document.getElementById("strengthText");

    const toast =
        document.getElementById("toast");


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message, type = "normal") {

        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        if (type === "error") {
            toast.style.background = "#dc2626";
        } else if (type === "success") {
            toast.style.background = "#16a34a";
        } else {
            toast.style.background = "#0f172a";
        }

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    /* =====================================================
       SWITCH TO LOGIN
    ===================================================== */

    function showLogin() {

        if (!loginTab || !registerTab) return;

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginBox.classList.add("active");
        registerBox.classList.remove("active");
    }


    /* =====================================================
       SWITCH TO REGISTER
    ===================================================== */

    function showRegister() {

        if (!loginTab || !registerTab) return;

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        registerBox.classList.add("active");
        loginBox.classList.remove("active");
    }


    /* =====================================================
       TAB EVENTS
    ===================================================== */

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


    /* =====================================================
       PASSWORD TOGGLE
    ===================================================== */

    function togglePassword(inputId, eyeElement) {

        const input = document.getElementById(inputId);

        if (!input || !eyeElement) return;

        if (input.type === "password") {

            input.type = "text";

            eyeElement.textContent = "🙈";

        } else {

            input.type = "password";

            eyeElement.textContent = "👁";
        }
    }


    if (loginEye) {

        loginEye.addEventListener("click", () => {

            togglePassword(
                "loginPassword",
                loginEye
            );

        });

    }


    if (registerEye) {

        registerEye.addEventListener("click", () => {

            togglePassword(
                "registerPassword",
                registerEye
            );

        });

    }


    if (confirmEye) {

        confirmEye.addEventListener("click", () => {

            togglePassword(
                "confirmPassword",
                confirmEye
            );

        });

    }


    /* =====================================================
       PASSWORD STRENGTH
    ===================================================== */

    if (registerPassword) {

        registerPassword.addEventListener("input", () => {

            const password = registerPassword.value;

            let score = 0;

            if (password.length >= 6) {
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


            if (strengthBar) {

                strengthBar.style.width =
                    `${score * 25}%`;

            }


            if (strengthText) {

                if (password.length === 0) {

                    strengthText.textContent =
                        "Password strength";

                } else if (score <= 1) {

                    strengthText.textContent =
                        "Weak password";

                } else if (score === 2) {

                    strengthText.textContent =
                        "Medium password";

                } else if (score === 3) {

                    strengthText.textContent =
                        "Strong password";

                } else {

                    strengthText.textContent =
                        "Very strong password";

                }

            }

        });

    }


    /* =====================================================
       FORGOT PASSWORD MODAL
    ===================================================== */

    if (forgotButton) {

        forgotButton.addEventListener("click", () => {

            if (forgotModal) {
                forgotModal.classList.add("active");
            }

        });

    }


    if (cancelForgot) {

        cancelForgot.addEventListener("click", () => {

            if (forgotModal) {
                forgotModal.classList.remove("active");
            }

        });

    }


    if (forgotModal) {

        forgotModal.addEventListener("click", (event) => {

            if (event.target === forgotModal) {

                forgotModal.classList.remove("active");

            }

        });

    }


    /* =====================================================
       FIREBASE CONFIG
    ===================================================== */

    const firebaseConfig = {

        apiKey:
            "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecto",

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


    /* =====================================================
       FIREBASE LAZY LOADER
       IMPORTANT:
       UI won't stop even if Firebase has an error.
    ===================================================== */

    let firebaseReady = null;

    async function getFirebase() {

        if (firebaseReady) {
            return firebaseReady;
        }

        firebaseReady = (async () => {

            const firebaseApp =
                await import(
                    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
                );

            const firebaseAuth =
                await import(
                    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
                );

            const firebaseFirestore =
                await import(
                    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
                );


            const app =
                firebaseApp.initializeApp(firebaseConfig);


            const auth =
                firebaseAuth.getAuth(app);


            const db =
                firebaseFirestore.getFirestore(app);


            return {
                auth,
                db,
                firebaseAuth,
                firebaseFirestore
            };

        })();

        return firebaseReady;
    }


    /* =====================================================
       REGISTER
    ===================================================== */

    if (registerForm) {

        registerForm.addEventListener("submit", async (event) => {

            event.preventDefault();


            const name =
                document.getElementById("registerName").value.trim();

            const email =
                document.getElementById("registerEmail").value.trim();

            const password =
                document.getElementById("registerPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const terms =
                document.getElementById("terms");


            const selectedRole =
                document.querySelector(
                    'input[name="role"]:checked'
                );


            /* VALIDATION */

            if (!name) {

                showToast(
                    "Please enter your name",
                    "error"
                );

                return;
            }


            if (!email) {

                showToast(
                    "Please enter your email",
                    "error"
                );

                return;
            }


            if (!selectedRole) {

                showToast(
                    "Please select your role",
                    "error"
                );

                return;
            }


            if (password.length < 6) {

                showToast(
                    "Password must contain at least 6 characters",
                    "error"
                );

                return;
            }


            if (password !== confirmPassword) {

                showToast(
                    "Passwords do not match",
                    "error"
                );

                return;
            }


            if (terms && !terms.checked) {

                showToast(
                    "Please accept the terms and conditions",
                    "error"
                );

                return;
            }


            const button =
                registerForm.querySelector("button[type='submit']");


            if (button) {

                button.disabled = true;

                button.textContent =
                    "Creating Account...";

            }


            try {

                const {
                    auth,
                    db,
                    firebaseAuth,
                    firebaseFirestore
                } = await getFirebase();


                const userCredential =
                    await firebaseAuth
                        .createUserWithEmailAndPassword(
                            auth,
                            email,
                            password
                        );


                const user =
                    userCredential.user;


                await firebaseFirestore.setDoc(

                    firebaseFirestore.doc(
                        db,
                        "users",
                        user.uid
                    ),

                    {

                        name: name,

                        email: email,

                        role: selectedRole.value,

                        createdAt:
                            firebaseFirestore.serverTimestamp()

                    }

                );


                showToast(
                    "Account created successfully!",
                    "success"
                );


                registerForm.reset();


                setTimeout(() => {

                    showLogin();

                    const loginEmail =
                        document.getElementById("loginEmail");

                    if (loginEmail) {
                        loginEmail.value = email;
                    }

                }, 800);


            } catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );


                let message =
                    "Unable to create account";


                if (error.code ===
                    "auth/email-already-in-use") {

                    message =
                        "Email is already registered";

                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Invalid email address";

                } else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message =
                        "Password is too weak";

                } else if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    message =
                        "Network error. Check your internet";

                }


                showToast(
                    message,
                    "error"
                );

            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Create Account";

                }

            }

        });

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();


            const email =
                document.getElementById("loginEmail").value.trim();

            const password =
                document.getElementById("loginPassword").value;

            const rememberMe =
                document.getElementById("rememberMe");


            if (!email) {

                showToast(
                    "Please enter your email",
                    "error"
                );

                return;
            }


            if (!password) {

                showToast(
                    "Please enter your password",
                    "error"
                );

                return;
            }


            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );


            if (button) {

                button.disabled = true;

                button.textContent =
                    "Signing In...";

            }


            try {

                const {
                    auth,
                    firebaseAuth
                } = await getFirebase();


                await firebaseAuth.setPersistence(

                    auth,

                    rememberMe && rememberMe.checked

                        ? firebaseAuth.browserLocalPersistence

                        : firebaseAuth.browserSessionPersistence

                );


                await firebaseAuth.signInWithEmailAndPassword(

                    auth,

                    email,

                    password

                );


                showToast(
                    "Login successful!",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                let message =
                    "Login failed";


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    message =
                        "Invalid email or password";

                } else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "Account not found";

                } else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    message =
                        "Incorrect password";

                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Invalid email address";

                } else if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    message =
                        "Network error. Check your internet";

                }


                showToast(
                    message,
                    "error"
                );

            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Sign In";

                }

            }

        });

    }


    /* =====================================================
       GOOGLE LOGIN
    ===================================================== */

    const loginGoogle =
        document.getElementById("loginGoogle");

    const registerGoogle =
        document.getElementById("registerGoogle");


    async function googleLogin() {

        try {

            const {
                auth,
                firebaseAuth
            } = await getFirebase();


            const provider =
                new firebaseAuth.GoogleAuthProvider();


            await firebaseAuth.signInWithPopup(
                auth,
                provider
            );


            showToast(
                "Google login successful!",
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


            showToast(
                "Google login failed",
                "error"
            );

        }

    }


    if (loginGoogle) {

        loginGoogle.addEventListener(
            "click",
            googleLogin
        );

    }


    if (registerGoogle) {

        registerGoogle.addEventListener(
            "click",
            googleLogin
        );

    }


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    if (resetForm) {

        resetForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const email =
      
