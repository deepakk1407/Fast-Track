import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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
   FIREBASE
========================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* =========================
   TOAST
========================= */

const toast = document.getElementById("toast");

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

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 5000);
}


/* =========================
   REGISTER FORM
========================= */

const registerForm =
    document.getElementById("registerForm");


if (!registerForm) {

    showToast(
        "ERROR: registerForm not found",
        "error"
    );

} else {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* TEST */

            showToast(
                "REGISTER BUTTON WORKING"
            );


            const name =
                document
                    .getElementById("registerName")
                    ?.value.trim();

            const email =
                document
                    .getElementById("registerEmail")
                    ?.value.trim();

            const password =
                document
                    .getElementById("registerPassword")
                    ?.value;


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


            if (!password) {

                showToast(
                    "Please enter a password.",
                    "error"
                );

                return;
            }


            if (password.length < 6) {

                showToast(
                    "Password needs at least 6 characters.",
                    "error"
                );

                return;
            }


            try {

                showToast(
                    "Connecting to Firebase..."
                );


                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    result.user;


                console.log(
                    "USER CREATED:",
                    user
                );


                showToast(
                    "🎉 REGISTER SUCCESSFUL!"
                );


            } catch (error) {

                console.error(
                    "FIREBASE REGISTER ERROR:",
                    error
                );


                const code =
                    error?.code || "NO_CODE";

                const message =
                    error?.message || "NO_MESSAGE";


                showToast(
                    `${code} | ${message}`,
                    "error"
                );

            }

        }
    );
}
